/**
 * API Contract & Shared Frontend DTOs for Member 2 (Web & Mobile UI Lead)
 * Provided by Member 1 (Platform Architecture & Core Backend)
 */

import { UUID, PlatformGender, PlatformRelationshipIntent } from './shared-types';

export interface FrontendStandardResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    nextCursor?: string | null;
    hasNextPage?: boolean;
  };
  timestamp: string;
}

export interface FrontendErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

export interface FrontendAuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: UUID;
    email: string;
    role: string;
    status: string;
    isEmailVerified: boolean;
    hasProfile: boolean;
  };
}

export interface FrontendDiscoveryCard {
  userId: UUID;
  displayName: string;
  age?: number;
  gender: PlatformGender;
  bio?: string;
  occupation?: string;
  education?: string;
  distanceKm?: number;
  city?: string;
  relationshipIntent: PlatformRelationshipIntent;
  photos: Array<{
    id: UUID;
    url: string;
    thumbnailUrl?: string;
    isPrimary: boolean;
  }>;
  interests: Array<{
    id: UUID;
    name: string;
    category: string;
    icon?: string;
  }>;
  prompts: Array<{
    id: UUID;
    promptQuestion: string;
    promptAnswer: string;
  }>;
}

export interface FrontendMatchCard {
  id: UUID;
  status: 'ACTIVE' | 'UNMATCHED' | 'BLOCKED';
  matchedAt: string;
  lastInteractionAt: string;
  partner: FrontendDiscoveryCard;
  hasUnreadMessages: boolean;
}
