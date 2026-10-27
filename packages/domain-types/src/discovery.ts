import { ConnectionMode, Gender, InterestTag, ProfilePhoto, ProfilePrompt, RelationshipIntention, VerificationStatus } from './profile';

export enum SwipeAction {
  LIKE = 'LIKE',
  PASS = 'PASS',
  SUPER_LIKE = 'SUPER_LIKE'
}

export enum MatchStatus {
  ACTIVE = 'ACTIVE',
  UNMATCHED = 'UNMATCHED',
  BLOCKED = 'BLOCKED'
}

export interface DiscoveryCard {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  bio?: string | null;
  gender: Gender;
  pronouns?: string | null;
  relationshipIntention: RelationshipIntention;
  connectionMode: ConnectionMode;
  city?: string | null;
  approximateDistanceKm?: number | null; // Privacy-safe approximate distance
  interests: InterestTag[];
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
  verificationStatus: VerificationStatus;
  compatibilityScore?: number;
  compatibilityReasons?: string[];
}

export interface SwipeDecisionRequest {
  targetUserId: string;
  action: SwipeAction;
  connectionMode: ConnectionMode;
}

export interface SwipeDecisionResponse {
  isMatch: boolean;
  matchId?: string | null;
  matchedProfile?: DiscoveryCard | null;
  remainingLikesToday?: number;
}

export interface MatchSummary {
  id: string;
  conversationId: string;
  matchedUserId: string;
  matchedProfile: {
    displayName: string;
    age: number;
    primaryPhotoUrl?: string | null;
    city?: string | null;
    isVerified: boolean;
  };
  connectionMode: ConnectionMode;
  status: MatchStatus;
  lastMessageSnippet?: string | null;
  lastMessageAt?: Date | string | null;
  unreadCount: number;
  createdAt: Date | string;
}

export interface DiscoveryFilter {
  minAge?: number;
  maxAge?: number;
  maxDistanceKm?: number;
  genderPreferences?: Gender[];
  relationshipIntentions?: RelationshipIntention[];
  connectionMode?: ConnectionMode;
  categories?: string[];
  hasVerifiedPhotos?: boolean;
}

export interface UserLocationRecord {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  isPaused: boolean;
  updatedAt: Date | string;
}
