/**
 * PairUp Platform - Shared Cross-Module Domain Types
 * Technical Lead & Platform Architecture: Member 1
 */

export type UUID = string;

export enum PlatformAccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export enum PlatformUserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum PlatformGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
}

export enum PlatformRelationshipIntent {
  LONG_TERM = 'LONG_TERM',
  LONG_TERM_OPEN_TO_SHORT = 'LONG_TERM_OPEN_TO_SHORT',
  SHORT_TERM_OPEN_TO_LONG = 'SHORT_TERM_OPEN_TO_LONG',
  SHORT_TERM = 'SHORT_TERM',
  CASUAL = 'CASUAL',
  FRIENDSHIP = 'FRIENDSHIP',
  NOT_SURE_YET = 'NOT_SURE_YET',
}

export enum PlatformMatchStatus {
  ACTIVE = 'ACTIVE',
  UNMATCHED = 'UNMATCHED',
  BLOCKED = 'BLOCKED',
}

export interface SharedUserPayload {
  userId: UUID;
  email: string;
  role: PlatformUserRole;
  status: PlatformAccountStatus;
  sessionId?: UUID;
}
