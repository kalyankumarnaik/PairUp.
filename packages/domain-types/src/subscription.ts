export enum SubscriptionTier {
  FREE = 'FREE',
  PLUS = 'PLUS',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  priceMonthlyInr: number;
  features: string[];
  maxLikesPerDay: number;
  unlimitedRewinds: boolean;
  seeWhoLikesYou: boolean;
  passportLocationChange: boolean;
  freeSuperLikesPerWeek: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  isActive: boolean;
  startsAt: Date | string;
  expiresAt: Date | string;
}
