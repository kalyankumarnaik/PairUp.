export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isAdultVerified: boolean;
  role: UserRole;
  status: AccountStatus;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserSession {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  deviceId?: string | null;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  profile?: ProfileSummary | null;
  tokens: AuthTokens;
}

export interface ProfileSummary {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  primaryPhotoUrl?: string | null;
  city?: string | null;
  isVerified: boolean;
}
