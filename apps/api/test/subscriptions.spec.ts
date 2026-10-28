import { describe, expect, it, beforeEach } from 'vitest';
import { SubscriptionsService } from '../src/modules/subscriptions/subscriptions.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { SubscriptionTier, PaymentStatus } from '@pairup/domain-types';

describe('SubscriptionsService - Tiers, Monetization & Billing', () => {
  let subService: SubscriptionsService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    subService = new SubscriptionsService(store);
  });

  it('retrieves all available subscription plans with feature limits', () => {
    const plans = subService.getAvailablePlans();
    expect(plans.length).toBe(3);

    const plusPlan = plans.find((p) => p.tier === SubscriptionTier.PLUS);
    const goldPlan = plans.find((p) => p.tier === SubscriptionTier.GOLD);

    expect(plusPlan?.priceMonthlyInr).toBe(499);
    expect(goldPlan?.priceMonthlyInr).toBe(999);
    expect(goldPlan?.seeWhoLikesYou).toBe(true);
    expect(goldPlan?.passportLocationChange).toBe(true);
  });

  it('assigns free tier by default for a new member', () => {
    const { subscription, plan } = subService.getCurrentSubscription('usr_new_1');
    expect(subscription.tier).toBe(SubscriptionTier.FREE);
    expect(subscription.isActive).toBe(true);
    expect(plan.name).toBe('PairUp Explorer');
  });

  it('upgrades user to Gold tier and generates a compliant tax invoice', () => {
    const { subscription, invoice } = subService.upgradeSubscription(
      'usr_demo_1',
      SubscriptionTier.GOLD,
      'UPI'
    );

    expect(subscription.tier).toBe(SubscriptionTier.GOLD);
    expect(subscription.isActive).toBe(true);
    expect(invoice.id).toBeDefined();
    expect(invoice.status).toBe(PaymentStatus.COMPLETED);
    expect(invoice.amountInr).toBe(999);
    expect(invoice.taxInr).toBe(Math.round(999 * 0.18)); // 18% GST
    expect(invoice.totalInr).toBe(invoice.amountInr + invoice.taxInr);
  });

  it('applies promo code discounts (PAIRUPGOLD 100% discount)', () => {
    const { subscription, invoice } = subService.upgradeSubscription(
      'usr_demo_1',
      SubscriptionTier.GOLD,
      'CARD',
      'PAIRUPGOLD'
    );

    expect(subscription.tier).toBe(SubscriptionTier.GOLD);
    expect(invoice.amountInr).toBe(0);
    expect(invoice.totalInr).toBe(0);
  });

  it('records and returns user invoice history', () => {
    subService.upgradeSubscription('usr_demo_1', SubscriptionTier.PLUS, 'UPI');
    subService.upgradeSubscription('usr_demo_1', SubscriptionTier.GOLD, 'UPI');

    const invoices = subService.getUserInvoices('usr_demo_1');
    expect(invoices.length).toBe(2);
  });

  it('allows cancelling recurring subscription renewal', () => {
    subService.upgradeSubscription('usr_demo_1', SubscriptionTier.PLUS);
    const cancelResult = subService.cancelSubscription('usr_demo_1');

    expect(cancelResult.cancelled).toBe(true);
    const current = subService.getCurrentSubscription('usr_demo_1');
    expect(current.subscription.isActive).toBe(false);
  });
});
