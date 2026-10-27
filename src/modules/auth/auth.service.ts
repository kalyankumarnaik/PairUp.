import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccountStatus,
  AuditActionType,
  TokenType,
  UserRole,
  VisibilityLevel,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { SYSTEM_CONSTANTS } from '../../common/constants/system.constant';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, SessionResponseDto } from './dto/auth-response.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Registers a new user with secure password hashing and default settings.
   */
  async register(
    dto: RegisterDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new DomainException(
        'An account with this email address already exists',
        DomainErrorCode.EMAIL_ALREADY_EXISTS,
        409,
      );
    }

    const salt = await bcrypt.genSalt(SYSTEM_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Atomically create User, Credential, Preferences, and Privacy settings
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          phoneNumber: dto.phoneNumber?.trim() || null,
          role: UserRole.USER,
          status: AccountStatus.ACTIVE, // Allow instant access, verify in background
          isEmailVerified: false,
          credential: {
            create: {
              passwordHash,
              passwordAlgo: 'bcrypt',
            },
          },
          privacySetting: {
            create: {
              visibility: VisibilityLevel.PUBLIC,
              showDistance: true,
              showOnlineStatus: true,
              showReadReceipts: true,
              showAge: true,
            },
          },
          notificationPreference: {
            create: {
              emailOnMatch: true,
              emailOnMessage: true,
              pushOnMatch: true,
              pushOnMessage: true,
              pushOnLike: false,
            },
          },
          datingPreference: {
            create: {
              minAge: 18,
              maxAge: 99,
              maxDistanceKm: SYSTEM_CONSTANTS.DEFAULT_SEARCH_RADIUS_KM,
              genderPreferences: [],
              intentPreferences: [],
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Generate Email Verification Token
      const rawVerifyToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = this.hashToken(rawVerifyToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await tx.verificationToken.create({
        data: {
          userId: newUser.id,
          tokenHash,
          type: TokenType.EMAIL_VERIFICATION,
          expiresAt,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: AuditActionType.REGISTER,
          ipAddress,
          userAgent,
          details: { email: normalizedEmail },
        },
      });

      return newUser;
    });

    // Create session and issue tokens
    return this.createSessionAndIssueTokens(user, 'Initial Registration', ipAddress, userAgent);
  }

  /**
   * Authenticates credentials, validates lockout policy, and generates new session tokens.
   */
  async login(
    dto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        credential: true,
        profile: true,
      },
    });

    if (!user || !user.credential) {
      await this.logAudit(null, AuditActionType.LOGIN_FAILED, ipAddress, userAgent, {
        email: normalizedEmail,
        reason: 'User not found',
      });
      throw new DomainException(
        'Invalid email or password',
        DomainErrorCode.INVALID_CREDENTIALS,
        401,
      );
    }

    // Check account status
    if (user.status === AccountStatus.SUSPENDED) {
      throw new DomainException(
        'Account is suspended',
        DomainErrorCode.ACCOUNT_SUSPENDED,
        403,
      );
    }
    if (user.status === AccountStatus.DELETED || user.status === AccountStatus.BANNED) {
      throw new DomainException(
        'Account is inactive',
        DomainErrorCode.ACCOUNT_DELETED,
        403,
      );
    }

    // Check account lockout
    if (user.credential.lockoutUntil && user.credential.lockoutUntil > new Date()) {
      const waitMinutes = Math.ceil(
        (user.credential.lockoutUntil.getTime() - Date.now()) / (60 * 1000),
      );
      throw new DomainException(
        `Account temporarily locked due to consecutive failed attempts. Try again in ${waitMinutes} minute(s).`,
        DomainErrorCode.ACCOUNT_LOCKED,
        429,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.credential.passwordHash,
    );

    if (!isPasswordValid) {
      const attempts = user.credential.failedLoginAttempts + 1;
      const lockoutUntil =
        attempts >= SYSTEM_CONSTANTS.LOCKOUT_THRESHOLD_ATTEMPTS
          ? new Date(Date.now() + SYSTEM_CONSTANTS.LOCKOUT_DURATION_MINUTES * 60 * 1000)
          : null;

      await this.prisma.userCredential.update({
        where: { id: user.credential.id },
        data: {
          failedLoginAttempts: attempts,
          lockoutUntil,
        },
      });

      await this.logAudit(user.id, AuditActionType.LOGIN_FAILED, ipAddress, userAgent, {
        attempts,
        isLockedOut: !!lockoutUntil,
      });

      throw new DomainException(
        'Invalid email or password',
        DomainErrorCode.INVALID_CREDENTIALS,
        401,
      );
    }

    // Reset lockout counters & update lastLoginAt
    await this.prisma.$transaction([
      this.prisma.userCredential.update({
        where: { id: user.credential.id },
        data: {
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
    ]);

    await this.logAudit(user.id, AuditActionType.LOGIN_SUCCESS, ipAddress, userAgent, {
      deviceInfo: dto.deviceInfo,
    });

    return this.createSessionAndIssueTokens(user, dto.deviceInfo, ipAddress, userAgent);
  }

  /**
   * Refreshes access token with secure Refresh Token Rotation.
   * If a revoked or reused refresh token is presented, invalidates the whole session family.
   */
  async refreshToken(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const tokenHash = this.hashToken(rawRefreshToken);

    const session = await this.prisma.userSession.findUnique({
      where: { refreshTokenHash: tokenHash },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session) {
      throw new DomainException(
        'Invalid or expired refresh session',
        DomainErrorCode.TOKEN_INVALID,
        401,
      );
    }

    // Token reuse detection: If session was already revoked, someone may have stolen it
    if (session.isRevoked) {
      this.logger.warn(`Security Alert: Replay of revoked refresh token for user ${session.userId}. Revoking all sessions.`);
      await this.revokeAllUserSessions(session.userId, 'REFRESH_TOKEN_REUSE_DETECTED');
      throw new DomainException(
        'Security violation detected. All sessions revoked.',
        DomainErrorCode.SESSION_REVOKED,
        401,
      );
    }

    if (session.expiresAt < new Date()) {
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { isRevoked: true, revokedAt: new Date(), revocationReason: 'EXPIRED' },
      });
      throw new DomainException(
        'Refresh token has expired. Please log in again.',
        DomainErrorCode.SESSION_EXPIRED,
        401,
      );
    }

    // Atomically rotate: revoke old session, create new session
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = this.hashToken(newRawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [, newSession] = await this.prisma.$transaction([
      this.prisma.userSession.update({
        where: { id: session.id },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: 'ROTATED',
        },
      }),
      this.prisma.userSession.create({
        data: {
          userId: session.userId,
          refreshTokenHash: newRefreshTokenHash,
          deviceInfo: session.deviceInfo,
          ipAddress: ipAddress || session.ipAddress,
          userAgent: userAgent || session.userAgent,
          expiresAt: refreshExpiresAt,
        },
      }),
    ]);

    const accessToken = this.generateAccessToken(session.user, newSession.id);

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        status: session.user.status,
        isEmailVerified: session.user.isEmailVerified,
        hasProfile: !!session.user.profile,
      },
      accessToken,
      refreshToken: newRawRefreshToken,
      expiresIn: 900,
    };
  }

  /**
   * Logs out the current session and blacklists the active JWT access token in Redis.
   */
  async logout(
    userId: string,
    sessionId: string,
    accessToken?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: 'USER_LOGOUT',
      },
    });

    if (accessToken) {
      // Blacklist token in Redis for 15 minutes (max token lifetime)
      await this.redisService.blacklistToken(accessToken, 900);
    }

    await this.logAudit(userId, AuditActionType.LOGOUT, ipAddress, userAgent, {
      sessionId,
    });
  }

  /**
   * Verifies an email token.
   */
  async verifyEmail(rawToken: string): Promise<{ success: boolean; message: string }> {
    const tokenHash = this.hashToken(rawToken);

    const record = await this.prisma.verificationToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.type !== TokenType.EMAIL_VERIFICATION || record.usedAt) {
      throw new DomainException(
        'Invalid verification token',
        DomainErrorCode.TOKEN_INVALID,
        400,
      );
    }

    if (record.expiresAt < new Date()) {
      throw new DomainException(
        'Verification token has expired',
        DomainErrorCode.TOKEN_EXPIRED,
        400,
      );
    }

    await this.prisma.$transaction([
      this.prisma.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { isEmailVerified: true, status: AccountStatus.ACTIVE },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: record.userId,
          action: AuditActionType.EMAIL_VERIFIED,
        },
      }),
    ]);

    return {
      success: true,
      message: 'Email address verified successfully. Welcome to PairUp!',
    };
  }

  /**
   * Initiates password recovery.
   */
  async forgotPassword(
    dto: ForgotPasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string; previewToken?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });

    // Always return success message to prevent user enumeration
    if (!user) {
      return {
        message: 'If an account exists with this email, password reset instructions have been dispatched.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.verificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        type: TokenType.PASSWORD_RESET,
        expiresAt,
      },
    });

    await this.logAudit(user.id, AuditActionType.PASSWORD_RESET_REQUEST, ipAddress, userAgent);

    return {
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
      ...(process.env.NODE_ENV !== 'production' && { previewToken: rawToken }),
    };
  }

  /**
   * Resets password using a validated token and revokes all active sessions.
   */
  async resetPassword(
    dto: ResetPasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const tokenHash = this.hashToken(dto.token);

    const record = await this.prisma.verificationToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.type !== TokenType.PASSWORD_RESET || record.usedAt) {
      throw new DomainException(
        'Invalid or already used password reset token',
        DomainErrorCode.TOKEN_INVALID,
        400,
      );
    }

    if (record.expiresAt < new Date()) {
      throw new DomainException(
        'Password reset token has expired',
        DomainErrorCode.TOKEN_EXPIRED,
        400,
      );
    }

    const salt = await bcrypt.genSalt(SYSTEM_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.$transaction([
      this.prisma.userCredential.update({
        where: { userId: record.userId },
        data: {
          passwordHash,
          passwordChangedAt: new Date(),
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      }),
      this.prisma.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all existing sessions on password change
      this.prisma.userSession.updateMany({
        where: { userId: record.userId, isRevoked: false },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: 'PASSWORD_RESET',
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: record.userId,
          action: AuditActionType.PASSWORD_RESET_SUCCESS,
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { message: 'Password has been updated successfully. Please log in with your new credentials.' };
  }

  /**
   * Retrieves active sessions for a user.
   */
  async getUserSessions(userId: string, currentSessionId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      deviceInfo: s.deviceInfo,
      ipAddress: s.ipAddress,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === currentSessionId,
    }));
  }

  /**
   * Revokes a specific session.
   */
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new DomainException(
        'Session not found',
        DomainErrorCode.RESOURCE_NOT_FOUND,
        404,
      );
    }

    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: 'USER_REVOKED_MANUALLY',
      },
    });
  }

  /**
   * Revokes all active sessions for a user except the current session.
   */
  async revokeOtherSessions(userId: string, currentSessionId: string): Promise<{ revokedCount: number }> {
    const result = await this.prisma.userSession.updateMany({
      where: {
        userId,
        id: { not: currentSessionId },
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: 'REVOKED_OTHER_SESSIONS',
      },
    });

    return { revokedCount: result.count };
  }

  // --------------------------------------------------------------------------
  // Private Helper Methods
  // --------------------------------------------------------------------------

  private async createSessionAndIssueTokens(
    user: any,
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = this.hashToken(rawRefreshToken);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        deviceInfo: deviceInfo || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt: refreshExpiresAt,
      },
    });

    const accessToken = this.generateAccessToken(user, session.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        hasProfile: !!user.profile,
      },
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private generateAccessToken(user: any, sessionId: string): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      sessionId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret', 'pairup_dev_jwt_access_secret_super_secure_key_12345'),
      expiresIn: '15m',
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async revokeAllUserSessions(userId: string, reason: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, isRevoked: false },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revocationReason: reason,
      },
    });
  }

  private async logAudit(
    userId: string | null,
    action: AuditActionType,
    ipAddress?: string,
    userAgent?: string,
    details?: any,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          details: details ? (details as any) : undefined,
        },
      });
    } catch (e: any) {
      this.logger.error(`Audit logging failed: ${e.message}`);
    }
  }
}
