-- ============================================================================
-- PairUp Enterprise PostgreSQL 16 Initial DDL Schema
-- Auto-generated for high-concurrency social discovery
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ----------------------------------------------------------------------------
-- Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_credentials
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_status ON user_credentials(status);
CREATE INDEX IF NOT EXISTS idx_user_credentials_created_at ON user_credentials(created_at DESC);

ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_credentials ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_status ON user_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);

ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: verification_tokens
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_status ON verification_tokens(status);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_created_at ON verification_tokens(created_at DESC);

ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE verification_tokens ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: profiles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: profile_photos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_photos_user_id ON profile_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photos_status ON profile_photos(status);
CREATE INDEX IF NOT EXISTS idx_profile_photos_created_at ON profile_photos(created_at DESC);

ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE profile_photos ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: profile_prompts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_prompts_user_id ON profile_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_prompts_status ON profile_prompts(status);
CREATE INDEX IF NOT EXISTS idx_profile_prompts_created_at ON profile_prompts(created_at DESC);

ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE profile_prompts ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: interest_tags
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interest_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interest_tags_user_id ON interest_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_interest_tags_status ON interest_tags(status);
CREATE INDEX IF NOT EXISTS idx_interest_tags_created_at ON interest_tags(created_at DESC);

ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE interest_tags ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: profile_interests
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_interests_user_id ON profile_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_interests_status ON profile_interests(status);
CREATE INDEX IF NOT EXISTS idx_profile_interests_created_at ON profile_interests(created_at DESC);

ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE profile_interests ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_locations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_status ON user_locations(status);
CREATE INDEX IF NOT EXISTS idx_user_locations_created_at ON user_locations(created_at DESC);

ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_locations ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: location_history
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_history_user_id ON location_history(user_id);
CREATE INDEX IF NOT EXISTS idx_location_history_status ON location_history(status);
CREATE INDEX IF NOT EXISTS idx_location_history_created_at ON location_history(created_at DESC);

ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE location_history ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_likes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_status ON user_likes(status);
CREATE INDEX IF NOT EXISTS idx_user_likes_created_at ON user_likes(created_at DESC);

ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_likes ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_passes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_passes_user_id ON user_passes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_passes_status ON user_passes(status);
CREATE INDEX IF NOT EXISTS idx_user_passes_created_at ON user_passes(created_at DESC);

ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_passes ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: matches
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);

ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: match_events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_events_user_id ON match_events(user_id);
CREATE INDEX IF NOT EXISTS idx_match_events_status ON match_events(status);
CREATE INDEX IF NOT EXISTS idx_match_events_created_at ON match_events(created_at DESC);

ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE match_events ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: conversations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: conversation_participants
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_status ON conversation_participants(status);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_created_at ON conversation_participants(created_at DESC);

ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: chat_messages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_status ON chat_messages(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: message_reactions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_status ON message_reactions(status);
CREATE INDEX IF NOT EXISTS idx_message_reactions_created_at ON message_reactions(created_at DESC);

ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE message_reactions ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: message_attachments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_attachments_user_id ON message_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_status ON message_attachments(status);
CREATE INDEX IF NOT EXISTS idx_message_attachments_created_at ON message_attachments(created_at DESC);

ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE message_attachments ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: call_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS call_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_user_id ON call_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_created_at ON call_sessions(created_at DESC);

ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE call_sessions ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: call_quality_logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS call_quality_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_call_quality_logs_user_id ON call_quality_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_quality_logs_status ON call_quality_logs(status);
CREATE INDEX IF NOT EXISTS idx_call_quality_logs_created_at ON call_quality_logs(created_at DESC);

ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE call_quality_logs ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: voice_rooms
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voice_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_rooms_user_id ON voice_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_rooms_status ON voice_rooms(status);
CREATE INDEX IF NOT EXISTS idx_voice_rooms_created_at ON voice_rooms(created_at DESC);

ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE voice_rooms ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: voice_room_speakers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS voice_room_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_room_speakers_user_id ON voice_room_speakers(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_room_speakers_status ON voice_room_speakers(status);
CREATE INDEX IF NOT EXISTS idx_voice_room_speakers_created_at ON voice_room_speakers(created_at DESC);

ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE voice_room_speakers ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: social_events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_events_user_id ON social_events(user_id);
CREATE INDEX IF NOT EXISTS idx_social_events_status ON social_events(status);
CREATE INDEX IF NOT EXISTS idx_social_events_created_at ON social_events(created_at DESC);

ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE social_events ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: event_rsvps
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_status ON event_rsvps(status);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_created_at ON event_rsvps(created_at DESC);

ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: community_clubs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_clubs_user_id ON community_clubs(user_id);
CREATE INDEX IF NOT EXISTS idx_community_clubs_status ON community_clubs(status);
CREATE INDEX IF NOT EXISTS idx_community_clubs_created_at ON community_clubs(created_at DESC);

ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE community_clubs ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: community_memberships
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_memberships_user_id ON community_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_community_memberships_status ON community_memberships(status);
CREATE INDEX IF NOT EXISTS idx_community_memberships_created_at ON community_memberships(created_at DESC);

ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE community_memberships ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: community_posts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: community_comments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_status ON community_comments(status);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: date_guard_sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS date_guard_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_date_guard_sessions_user_id ON date_guard_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_date_guard_sessions_status ON date_guard_sessions(status);
CREATE INDEX IF NOT EXISTS idx_date_guard_sessions_created_at ON date_guard_sessions(created_at DESC);

ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE date_guard_sessions ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: safety_reports
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS safety_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_reports_user_id ON safety_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_reports_status ON safety_reports(status);
CREATE INDEX IF NOT EXISTS idx_safety_reports_created_at ON safety_reports(created_at DESC);

ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE safety_reports ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_blocks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON user_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_status ON user_blocks(status);
CREATE INDEX IF NOT EXISTS idx_user_blocks_created_at ON user_blocks(created_at DESC);

ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_blocks ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: user_subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_created_at ON user_subscriptions(created_at DESC);

ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: billing_invoices
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_billing_invoices_user_id ON billing_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_status ON billing_invoices(status);
CREATE INDEX IF NOT EXISTS idx_billing_invoices_created_at ON billing_invoices(created_at DESC);

ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE billing_invoices ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: activity_surge_zones
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_surge_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_surge_zones_user_id ON activity_surge_zones(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_surge_zones_status ON activity_surge_zones(status);
CREATE INDEX IF NOT EXISTS idx_activity_surge_zones_created_at ON activity_surge_zones(created_at DESC);

ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE activity_surge_zones ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: notification_records
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_records_user_id ON notification_records(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_records_status ON notification_records(status);
CREATE INDEX IF NOT EXISTS idx_notification_records_created_at ON notification_records(created_at DESC);

ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE notification_records ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: device_tokens
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_status ON device_tokens(status);
CREATE INDEX IF NOT EXISTS idx_device_tokens_created_at ON device_tokens(created_at DESC);

ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE device_tokens ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

-- ----------------------------------------------------------------------------
-- Table: system_configurations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_ref VARCHAR(128),
    user_id UUID,
    status VARCHAR(64) DEFAULT 'ACTIVE',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_configurations_user_id ON system_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_system_configurations_status ON system_configurations(status);
CREATE INDEX IF NOT EXISTS idx_system_configurations_created_at ON system_configurations(created_at DESC);

ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_1 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_2 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_3 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_4 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_5 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_6 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_7 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_8 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_9 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_10 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_11 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_12 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_13 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_14 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_15 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_16 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_17 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_18 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_19 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_20 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_21 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_22 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_23 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_24 VARCHAR(255);
ALTER TABLE system_configurations ADD COLUMN IF NOT EXISTS attribute_col_25 VARCHAR(255);

