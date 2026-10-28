import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionPlan, SubscriptionTier, UserSubscription, PaymentStatus } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

export interface BillingInvoice {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amountInr: number;
  taxInr: number;
  totalInr: number;
  paymentMethod: string;
  status: PaymentStatus;
  razorpayPaymentId?: string;
  paidAt: string;
  pdfInvoiceUrl: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_explorer_free',
    tier: SubscriptionTier.FREE,
    name: 'PairUp Explorer',
    priceMonthlyInr: 0,
    features: [
      '50 Likes daily',
      'Standard location radius (15km)',
      '1-on-1 Text chat with mutual matches',
      'Join public voice rooms & local events',
      'Standard AI conversation starters (3/day)',
      'Complete Date Guard safety check-in'
    ],
    maxLikesPerDay: 50,
    unlimitedRewinds: false,
    seeWhoLikesYou: false,
    passportLocationChange: false,
    freeSuperLikesPerWeek: 1
  },
  {
    id: 'plan_plus_monthly',
    tier: SubscriptionTier.PLUS,
    name: 'PairUp Plus',
    priceMonthlyInr: 499,
    features: [
      'Unlimited daily likes & passes',
      'Unlimited Rewinds on accidental passes',
      '5 Free Super Likes per week',
      'Extended radius up to 50km',
      'Unlimited AI conversation suggestions',
      'Incognito mode browsing',
      'Priority delivery for chat messages'
    ],
    maxLikesPerDay: 999999,
    unlimitedRewinds: true,
    seeWhoLikesYou: false,
    passportLocationChange: false,
    freeSuperLikesPerWeek: 5
  },
  {
    id: 'plan_gold_monthly',
    tier: SubscriptionTier.GOLD,
    name: 'PairUp Gold',
    priceMonthlyInr: 999,
    features: [
      'All PairUp Plus perks included',
      'See Who Likes You & match instantly',
      'Passport mode: Match anywhere in India & globally',
      '1 Free Profile Surge / Boost per month',
      '10 Free Super Likes weekly',
      'Verified Gold Shield badge on profile',
      'VIP priority matching in busy areas',
      'HD Voice & Video calling priority'
    ],
    maxLikesPerDay: 999999,
    unlimitedRewinds: true,
    seeWhoLikesYou: true,
    passportLocationChange: true,
    freeSuperLikesPerWeek: 10
  }
];

@Injectable()
export class SubscriptionsService {
  private userSubscriptions: Map<string, UserSubscription> = new Map();
  private invoices: Map<string, BillingInvoice[]> = new Map();
  private promoCodes: Map<string, { discountPercent: number; expiresAt: string }> = new Map([
    ['PAIRUPGOLD', { discountPercent: 100, expiresAt: '2026-12-31' }],
    ['WELCOME50', { discountPercent: 50, expiresAt: '2026-12-31' }],
    ['DATENIGHT', { discountPercent: 20, expiresAt: '2026-12-31' }]
  ]);

  constructor(private readonly store: MemoryStoreService) {}

  getAvailablePlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  getCurrentSubscription(userId: string): { subscription: UserSubscription; plan: SubscriptionPlan } {
    let sub = this.userSubscriptions.get(userId);
    if (!sub) {
      sub = {
        id: `sub_free_${userId}`,
        userId,
        tier: SubscriptionTier.FREE,
        isActive: true,
        startsAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 86400000).toISOString()
      };
      this.userSubscriptions.set(userId, sub);
    }

    const plan =
      SUBSCRIPTION_PLANS.find((p) => p.tier === sub!.tier) || SUBSCRIPTION_PLANS[0];

    return { subscription: sub, plan };
  }

  upgradeSubscription(
    userId: string,
    targetTier: SubscriptionTier,
    paymentMethod: string = 'UPI',
    promoCode?: string
  ): { subscription: UserSubscription; invoice: BillingInvoice } {
    const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.tier === targetTier);
    if (!targetPlan) {
      throw new BadRequestException(`Invalid subscription tier ${targetTier}`);
    }

    let discount = 0;
    if (promoCode) {
      const codeInfo = this.promoCodes.get(promoCode.trim().toUpperCase());
      if (codeInfo) {
        discount = codeInfo.discountPercent;
      }
    }

    const baseAmount = targetPlan.priceMonthlyInr;
    const discountedBase = Math.round(baseAmount * (1 - discount / 100));
    const gstTax = Math.round(discountedBase * 0.18); // 18% GST India
    const totalAmount = discountedBase + gstTax;

    const subId = `sub_${Date.now()}_${userId}`;
    const newSub: UserSubscription = {
      id: subId,
      userId,
      tier: targetTier,
      isActive: true,
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    this.userSubscriptions.set(userId, newSub);

    // Create Invoice
    const invoiceId = `inv_pu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const invoice: BillingInvoice = {
      id: invoiceId,
      userId,
      planId: targetPlan.id,
      planName: targetPlan.name,
      amountInr: discountedBase,
      taxInr: gstTax,
      totalInr: totalAmount,
      paymentMethod,
      status: PaymentStatus.COMPLETED,
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      paidAt: new Date().toISOString(),
      pdfInvoiceUrl: `https://pairup.internal/invoices/${invoiceId}.pdf`
    };

    const userInvoices = this.invoices.get(userId) || [];
    userInvoices.unshift(invoice);
    this.invoices.set(userId, userInvoices);

    return {
      subscription: newSub,
      invoice
    };
  }

  getUserInvoices(userId: string): BillingInvoice[] {
    return this.invoices.get(userId) || [];
  }

  cancelSubscription(userId: string): { cancelled: boolean; message: string } {
    const sub = this.userSubscriptions.get(userId);
    if (!sub || sub.tier === SubscriptionTier.FREE) {
      return { cancelled: false, message: 'No paid active subscription to cancel.' };
    }

    sub.isActive = false;
    this.userSubscriptions.set(userId, sub);
    return {
      cancelled: true,
      message: 'Subscription has been cancelled and will not renew automatically.'
    };
  }
}
