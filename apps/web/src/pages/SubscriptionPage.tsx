import React, { useState } from 'react';
import {
  Check,
  CheckCircle,
  CreditCard,
  Crown,
  Download,
  HelpCircle,
  Receipt,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  color: string;
  badge?: string;
  features: string[];
}

const TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Explorer',
    price: '₹0',
    period: 'Forever free',
    color: '#6B6684',
    features: [
      '50 standard profile swipes per day',
      'Encrypted end-to-end messaging with matches',
      'Nearby radar discovery (up to 25 km)',
      'Join public live audio voice rooms',
      'Standard 18+ adult verification shield'
    ]
  },
  {
    id: 'plus',
    name: 'PairUp Plus',
    price: '₹499',
    period: 'per month',
    highlight: false,
    color: '#7C3AED',
    badge: 'Popular for Dating',
    features: [
      'Unlimited profile swipes',
      'Rewind & undo accidental passes',
      '5 free Super Likes every week',
      'Passport: Match with people in any Indian city',
      'Ad-free experience',
      'Control who sees your age and distance'
    ]
  },
  {
    id: 'gold',
    name: 'PairUp Gold',
    price: '₹999',
    period: 'per month',
    highlight: true,
    color: '#FF8A5B',
    badge: 'Best Value & VIP',
    features: [
      'Everything in PairUp Plus',
      'See who liked your profile before swiping',
      '1 free 30-minute Profile Radar Boost per week',
      'Priority matching in active surge areas (2.4x)',
      'Incognito VIP browsing mode',
      'VIP badge displayed on profile',
      'Direct message before matching (1 per day)'
    ]
  }
];

export const SubscriptionPage: React.FC = () => {
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'tiers' | 'billing'>('tiers');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'PAIRUPGOLD' || promoCode.trim().toUpperCase() === 'FIRSTLOVE') {
      setCurrentTier('gold');
      setPromoMessage('🎉 Promo applied! You have been granted 1 Month of PairUp Gold VIP!');
      setPromoCode('');
    } else {
      setPromoMessage('Invalid coupon code. Try code "PAIRUPGOLD" for testing.');
    }
    setTimeout(() => setPromoMessage(''), 5000);
  };

  const handleUpgrade = (tierId: string) => {
    setCurrentTier(tierId);
    setPromoMessage(`🎉 Upgraded successfully to ${tierId.toUpperCase()} tier! Enjoy premium benefits.`);
    setTimeout(() => setPromoMessage(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/15 text-amber-600 text-xs font-black uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>PairUp Premium Club</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-ink">
          Upgrade Your Social Experience
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto">
          See who liked you, enjoy unlimited swipes, boost your profile visibility during activity surges, and access VIP voice stages.
        </p>

        {/* Tab switch */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tiers' ? 'bg-violet text-white shadow-sm' : 'bg-white text-ink-muted border border-borderSoft'
            }`}
          >
            Membership Plans
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'billing' ? 'bg-violet text-white shadow-sm' : 'bg-white text-ink-muted border border-borderSoft'
            }`}
          >
            Billing & Invoices
          </button>
        </div>
      </div>

      {promoMessage && (
        <div className="p-4 rounded-2xl bg-lavender-light border border-violet/30 text-xs font-bold text-violet text-center animate-in fade-in">
          {promoMessage}
        </div>
      )}

      {activeTab === 'tiers' ? (
        <>
          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const isCurrent = currentTier === tier.id;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                    tier.highlight
                      ? 'bg-gradient-to-b from-white via-white to-amber-50/50 border-2 border-amber-400 shadow-xl'
                      : 'bg-white border border-borderSoft shadow-sm hover:border-violet/40'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-coral text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="font-display font-black text-xl text-ink">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-display font-black text-ink">{tier.price}</span>
                      <span className="text-xs text-ink-muted font-medium">{tier.period}</span>
                    </div>

                    <ul className="space-y-3 pt-3 border-t border-borderSoft/60">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-ink-muted">
                          <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-borderSoft/60">
                    <button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-2xl text-xs font-bold shadow-md transition-all ${
                        isCurrent
                          ? 'bg-cloud text-ink font-bold opacity-60 cursor-default'
                          : tier.highlight
                          ? 'bg-gradient-to-r from-amber to-coral text-white hover:opacity-95 hover:scale-102 active:scale-98'
                          : 'bg-violet text-white hover:bg-violet-hover hover:scale-102 active:scale-98'
                      }`}
                    >
                      {isCurrent ? 'Current Active Plan ✓' : `Select ${tier.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coupon Code Redeemer */}
          <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-ink">Have a Promo Coupon or Gift Code?</h4>
              <p className="text-xs text-ink-muted">
                Redeem codes from campus events, brand partnerships, or dating festivals. (Try: <strong className="text-violet">PAIRUPGOLD</strong>)
              </p>
            </div>

            <form onSubmit={handleApplyPromo} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter coupon code"
                className="px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-violet hover:bg-violet-hover text-white text-xs font-bold shadow-xs whitespace-nowrap"
              >
                Apply Code
              </button>
            </form>
          </div>
        </>
      ) : (
        /* Billing & Invoices Tab */
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
                <Receipt className="w-4 h-4 text-violet" />
                <span>Payment Methods & Billing Invoices</span>
              </h3>
              <p className="text-xs text-ink-muted">
                All transactions are encrypted and processed securely via RBI-compliant UPI & card gateways.
              </p>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-4 rounded-2xl bg-cloud border border-borderSoft flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-borderSoft flex items-center justify-center font-bold text-emerald">
                UPI
              </div>
              <div>
                <p className="text-xs font-bold text-ink">UPI AutoPay (Google Pay / PhonePe)</p>
                <p className="text-[10px] text-ink-muted">Recurring billing renewal • Active</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald/10 text-emerald text-[10px] font-bold">
              Default Method
            </span>
          </div>

          {/* Past Invoices */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Invoice Receipts</h4>
            <div className="divide-y divide-borderSoft">
              {[
                { id: 'INV-2026-0891', date: 'Oct 28, 2026', amount: '₹999.00', plan: 'PairUp Gold (1 Month)' },
                { id: 'INV-2026-0742', date: 'Sep 28, 2026', amount: '₹499.00', plan: 'PairUp Plus (1 Month)' }
              ].map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-ink">{inv.plan}</p>
                    <p className="text-[10px] text-ink-muted">{inv.id} • {inv.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-ink">{inv.amount}</span>
                    <button
                      onClick={() => alert(`Downloading invoice ${inv.id}...`)}
                      className="p-1.5 rounded-lg hover:bg-cloud text-ink-muted hover:text-ink transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
