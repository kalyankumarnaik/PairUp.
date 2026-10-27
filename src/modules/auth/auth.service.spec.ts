import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let redis: any;
  let jwt: any;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    isEmailVerified: false,
    profile: null,
  };

  const mockCredential = {
    id: 'cred-uuid-1',
    userId: 'user-uuid-1',
    passwordHash: '$2b$10$hashedpasswordstringhere',
    failedLoginAttempts: 0,
    lockoutUntil: null,
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      userCredential: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      userSession: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn(),
      },
      verificationToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (arg) => {
        if (typeof arg === 'function') {
          return arg(prisma);
        }
        return Promise.all(arg);
      }),
    };

    redis = {
      blacklistToken: jest.fn().mockResolvedValue(undefined),
      isTokenBlacklisted: jest.fn().mockResolvedValue(false),
    };

    jwt = {
      sign: jest.fn().mockReturnValue('mock.jwt.access.token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: redis },
        { provide: JwtService, useValue: jwt },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def: any) => def),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully and issue session tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.verificationToken.create.mockResolvedValue({});
      prisma.auditLog.create.mockResolvedValue({});
      prisma.userSession.create.mockResolvedValue({
        id: 'session-uuid-1',
        userId: 'user-uuid-1',
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBe('mock.jwt.access.token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject registration if email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@example.com', password: 'Password123!' }),
      ).rejects.toThrow(DomainException);
    });
  });

  describe('login', () => {
    it('should authenticate valid credentials and issue tokens', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        credential: mockCredential,
      });
      prisma.userCredential.update.mockResolvedValue({});
      prisma.user.update.mockResolvedValue({});
      prisma.userSession.create.mockResolvedValue({
        id: 'session-uuid-1',
        userId: 'user-uuid-1',
      });

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('mock.jwt.access.token');
      expect(result.user.id).toBe('user-uuid-1');
    });

    it('should reject invalid password and increment failed attempts', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        credential: mockCredential,
      });
      prisma.userCredential.update.mockResolvedValue({});

      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPassword!' }),
      ).rejects.toThrow(DomainException);

      expect(prisma.userCredential.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ failedLoginAttempts: 1 }),
        }),
      );
    });

    it('should reject login if account is currently locked out', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        credential: {
          ...mockCredential,
          lockoutUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 mins in future
        },
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'Password123!' }),
      ).rejects.toThrow(DomainException);
    });

    it('should reject login if account is suspended', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        status: AccountStatus.SUSPENDED,
        credential: mockCredential,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'Password123!' }),
      ).rejects.toThrow(DomainException);
    });
  });

  describe('refreshToken (Token Rotation)', () => {
    it('should detect token reuse on revoked session and revoke entire family', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-uuid-revoked',
        userId: 'user-uuid-1',
        isRevoked: true,
        expiresAt: new Date(Date.now() + 100000),
        user: mockUser,
      });

      await expect(service.refreshToken('stolen-refresh-token')).rejects.toThrow(
        DomainException,
      );

      // Verify all sessions were revoked for that user
      expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-uuid-1', isRevoked: false },
        }),
      );
    });

    it('should rotate token successfully when valid', async () => {
      prisma.userSession.findUnique.mockResolvedValue({
        id: 'session-uuid-valid',
        userId: 'user-uuid-1',
        isRevoked: false,
        expiresAt: new Date(Date.now() + 100000),
        user: mockUser,
      });

      prisma.userSession.update.mockResolvedValue({});
      prisma.userSession.create.mockResolvedValue({
        id: 'new-session-id',
        userId: 'user-uuid-1',
      });

      const result = await service.refreshToken('valid-refresh-token');

      expect(result.accessToken).toBe('mock.jwt.access.token');
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should revoke session and blacklist access token in redis', async () => {
      prisma.userSession.updateMany.mockResolvedValue({ count: 1 });

      await service.logout(
        'user-uuid-1',
        'session-uuid-1',
        'mock-access-token',
      );

      expect(prisma.userSession.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-uuid-1', userId: 'user-uuid-1' },
        }),
      );
      expect(redis.blacklistToken).toHaveBeenCalledWith('mock-access-token', 900);
    });
  });
});
