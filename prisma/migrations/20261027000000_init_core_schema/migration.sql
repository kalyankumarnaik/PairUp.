-- ============================================================================
-- Migration: 20261027000000_init_core_schema
-- PairUp Platform Core Schema - Owned by Member 1 (Platform Technical Lead)
-- ============================================================================

-- Create Enums
CREATE TYPE "AccountStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'BANNED', 'DELETED');
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHER');
CREATE TYPE "SexualOrientation" AS ENUM ('HETEROSEXUAL', 'GAY', 'LESBIAN', 'BISEXUAL', 'ASEXUAL', 'PANSEXUAL', 'QUEER', 'OTHER');
CREATE TYPE "RelationshipIntent" AS ENUM ('LONG_TERM', 'LONG_TERM_OPEN_TO_SHORT', 'SHORT_TERM_OPEN_TO_LONG', 'SHORT_TERM', 'CASUAL', 'FRIENDSHIP', 'NOT_SURE_YET');
CREATE TYPE "HabitFrequency" AS ENUM ('NEVER', 'SOCIALLY', 'REGULARLY', 'PREFER_NOT_TO_SAY');
CREATE TYPE "PhotoStatus" AS ENUM ('APPROVED', 'PENDING_REVIEW', 'REJECTED');
CREATE TYPE "VisibilityLevel" AS ENUM ('PUBLIC', 'INCOGNITO', 'MATCHES_ONLY');
CREATE TYPE "LikeType" AS ENUM ('STANDARD', 'SUPERLIKE');
CREATE TYPE "MatchStatus" AS ENUM ('ACTIVE', 'UNMATCHED', 'BLOCKED');
CREATE TYPE "MatchEventType" AS ENUM ('CREATED', 'UNMATCHED', 'RECONNECTED', 'SUPERMATCH');
CREATE TYPE "AuditActionType" AS ENUM (
    'REGISTER', 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT',
    'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS', 'EMAIL_VERIFIED',
    'PROFILE_UPDATED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_RESTORED',
    'ACCOUNT_DELETED', 'USER_BLOCKED', 'USER_UNBLOCKED', 'SECURITY_ALERT'
);

-- Create Table: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create Table: user_credentials
CREATE TABLE "user_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordAlgo" TEXT NOT NULL DEFAULT 'bcrypt',
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutUntil" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_credentials_pkey" PRIMARY KEY ("id")
);

-- Create Table: user_sessions
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- Create Table: verification_tokens
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- Create Table: profiles
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "sexualOrientation" "SexualOrientation" NOT NULL,
    "bio" VARCHAR(1000),
    "occupation" TEXT,
    "education" TEXT,
    "heightCm" INTEGER,
    "drinkingHabit" "HabitFrequency",
    "smokingHabit" "HabitFrequency",
    "workoutHabit" "HabitFrequency",
    "relationshipIntent" "RelationshipIntent" NOT NULL DEFAULT 'LONG_TERM',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT,
    "country" TEXT,
    "completionScore" INTEGER NOT NULL DEFAULT 0,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- Create Table: profile_photos
CREATE TABLE "profile_photos" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "PhotoStatus" NOT NULL DEFAULT 'APPROVED',
    "moderationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_photos_pkey" PRIMARY KEY ("id")
);

-- Create Table: interests
CREATE TABLE "interests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- Create Table: profile_interests
CREATE TABLE "profile_interests" (
    "profileId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_interests_pkey" PRIMARY KEY ("profileId","interestId")
);

-- Create Table: profile_prompts
CREATE TABLE "profile_prompts" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "promptQuestion" TEXT NOT NULL,
    "promptAnswer" VARCHAR(500) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_prompts_pkey" PRIMARY KEY ("id")
);

-- Create Table: dating_preferences
CREATE TABLE "dating_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL DEFAULT 18,
    "maxAge" INTEGER NOT NULL DEFAULT 100,
    "genderPreferences" "Gender"[],
    "maxDistanceKm" INTEGER NOT NULL DEFAULT 50,
    "intentPreferences" "RelationshipIntent"[],
    "globalDiscovery" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dating_preferences_pkey" PRIMARY KEY ("id")
);

-- Create Table: privacy_settings
CREATE TABLE "privacy_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visibility" "VisibilityLevel" NOT NULL DEFAULT 'PUBLIC',
    "showDistance" BOOLEAN NOT NULL DEFAULT true,
    "showOnlineStatus" BOOLEAN NOT NULL DEFAULT true,
    "showReadReceipts" BOOLEAN NOT NULL DEFAULT true,
    "showAge" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "privacy_settings_pkey" PRIMARY KEY ("id")
);

-- Create Table: notification_preferences
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailOnMatch" BOOLEAN NOT NULL DEFAULT true,
    "emailOnMessage" BOOLEAN NOT NULL DEFAULT false,
    "pushOnMatch" BOOLEAN NOT NULL DEFAULT true,
    "pushOnMessage" BOOLEAN NOT NULL DEFAULT true,
    "pushOnLike" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- Create Table: user_likes
CREATE TABLE "user_likes" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "type" "LikeType" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_likes_pkey" PRIMARY KEY ("id")
);

-- Create Table: user_passes
CREATE TABLE "user_passes" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_passes_pkey" PRIMARY KEY ("id")
);

-- Create Table: matches
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unmatchedAt" TIMESTAMP(3),
    "unmatchedById" TEXT,
    "unmatchReason" TEXT,
    "lastInteractionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- Create Table: match_events
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "eventType" "MatchEventType" NOT NULL,
    "triggeredById" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- Create Table: user_blocks
CREATE TABLE "user_blocks" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- Create Table: account_status_history
CREATE TABLE "account_status_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "previousStatus" "AccountStatus" NOT NULL,
    "newStatus" "AccountStatus" NOT NULL,
    "reason" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_status_history_pkey" PRIMARY KEY ("id")
);

-- Create Table: audit_logs
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditActionType" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Unique Constraints
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");
CREATE UNIQUE INDEX "user_credentials_userId_key" ON "user_credentials"("userId");
CREATE UNIQUE INDEX "user_sessions_refreshTokenHash_key" ON "user_sessions"("refreshTokenHash");
CREATE UNIQUE INDEX "verification_tokens_tokenHash_key" ON "verification_tokens"("tokenHash");
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");
CREATE UNIQUE INDEX "dating_preferences_userId_key" ON "dating_preferences"("userId");
CREATE UNIQUE INDEX "privacy_settings_userId_key" ON "privacy_settings"("userId");
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");
CREATE UNIQUE INDEX "user_likes_fromUserId_toUserId_key" ON "user_likes"("fromUserId", "toUserId");
CREATE UNIQUE INDEX "user_passes_fromUserId_toUserId_key" ON "user_passes"("fromUserId", "toUserId");
CREATE UNIQUE INDEX "matches_userOneId_userTwoId_key" ON "matches"("userOneId", "userTwoId");
CREATE UNIQUE INDEX "user_blocks_blockerId_blockedId_key" ON "user_blocks"("blockerId", "blockedId");

-- Performance & Query Indexes
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");
CREATE INDEX "verification_tokens_userId_type_idx" ON "verification_tokens"("userId", "type");
CREATE INDEX "profiles_latitude_longitude_idx" ON "profiles"("latitude", "longitude");
CREATE INDEX "profiles_birthDate_idx" ON "profiles"("birthDate");
CREATE INDEX "profiles_gender_idx" ON "profiles"("gender");
CREATE INDEX "profile_photos_profileId_displayOrder_idx" ON "profile_photos"("profileId", "displayOrder");
CREATE INDEX "user_likes_toUserId_fromUserId_idx" ON "user_likes"("toUserId", "fromUserId");
CREATE INDEX "user_passes_fromUserId_createdAt_idx" ON "user_passes"("fromUserId", "createdAt");
CREATE INDEX "matches_userOneId_status_idx" ON "matches"("userOneId", "status");
CREATE INDEX "matches_userTwoId_status_idx" ON "matches"("userTwoId", "status");
CREATE INDEX "matches_lastInteractionAt_idx" ON "matches"("lastInteractionAt");
CREATE INDEX "match_events_matchId_createdAt_idx" ON "match_events"("matchId", "createdAt");
CREATE INDEX "user_blocks_blockerId_idx" ON "user_blocks"("blockerId");
CREATE INDEX "user_blocks_blockedId_idx" ON "user_blocks"("blockedId");
CREATE INDEX "account_status_history_userId_createdAt_idx" ON "account_status_history"("userId", "createdAt");
CREATE INDEX "audit_logs_userId_action_idx" ON "audit_logs"("userId", "action");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- Foreign Keys with Cascade & Reference Policies
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_photos" ADD CONSTRAINT "profile_photos_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_interests" ADD CONSTRAINT "profile_interests_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_interests" ADD CONSTRAINT "profile_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profile_prompts" ADD CONSTRAINT "profile_prompts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dating_preferences" ADD CONSTRAINT "dating_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "privacy_settings" ADD CONSTRAINT "privacy_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_passes" ADD CONSTRAINT "user_passes_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_passes" ADD CONSTRAINT "user_passes_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matches" ADD CONSTRAINT "matches_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "matches" ADD CONSTRAINT "matches_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_blocks" ADD CONSTRAINT "user_blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_status_history" ADD CONSTRAINT "account_status_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
