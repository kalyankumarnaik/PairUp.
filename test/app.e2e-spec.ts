import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { TransformResponseInterceptor } from '../src/common/interceptors/transform-response.interceptor';
import { AccountStatus, Gender, LikeType, MatchStatus, SexualOrientation, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('PairUp Core Backend API (E2E Integration)', () => {
  let app: INestApplication;
  let prismaMock: any;

  const mockUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'alex.rivera@example.com',
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    isEmailVerified: true,
    isPhoneVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      id: 'prof-1',
      displayName: 'Alex Rivera',
      birthDate: new Date('1996-05-14'),
      gender: Gender.FEMALE,
      sexualOrientation: SexualOrientation.HETEROSEXUAL,
      bio: 'Product Designer',
      photos: [],
      interests: [],
      prompts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockTargetUser = {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'liam.chen@example.com',
    role: UserRole.USER,
    status: AccountStatus.ACTIVE,
    isEmailVerified: true,
    profile: {
      id: 'prof-2',
      displayName: 'Liam Chen',
      birthDate: new Date('1994-11-20'),
      gender: Gender.MALE,
      sexualOrientation: SexualOrientation.HETEROSEXUAL,
      photos: [],
      interests: [],
      prompts: [],
    },
  };

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    prismaMock = {
      user: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.email === 'alex.rivera@example.com' || where.id === mockUser.id) {
            return Promise.resolve({
              ...mockUser,
              credential: {
                id: 'cred-1',
                userId: mockUser.id,
                passwordHash,
                failedLoginAttempts: 0,
                lockoutUntil: null,
              },
            });
          }
          if (where.id === mockTargetUser.id) {
            return Promise.resolve(mockTargetUser);
          }
          return Promise.resolve(null);
        }),
        findMany: jest.fn().mockResolvedValue([mockTargetUser]),
        create: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockResolvedValue(mockUser),
      },
      userCredential: {
        update: jest.fn().mockResolvedValue({}),
      },
      userSession: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'sess-1',
          userId: mockUser.id,
          isRevoked: false,
          expiresAt: new Date(Date.now() + 1000000),
          user: mockUser,
        }),
        create: jest.fn().mockResolvedValue({
          id: 'sess-1',
          userId: mockUser.id,
          refreshTokenHash: 'mock-hash',
          expiresAt: new Date(Date.now() + 1000000),
        }),
        update: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      profile: {
        findUnique: jest.fn().mockResolvedValue(mockUser.profile),
        create: jest.fn().mockResolvedValue(mockUser.profile),
        update: jest.fn().mockResolvedValue(mockUser.profile),
      },
      userBlock: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        upsert: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
      },
      userLike: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      userPass: {
        findMany: jest.fn().mockResolvedValue([]),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      match: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({
          id: 'match-1',
          userOneId: mockUser.id,
          userTwoId: mockTargetUser.id,
          status: MatchStatus.ACTIVE,
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      matchEvent: {
        create: jest.fn().mockResolvedValue({}),
      },
      verificationToken: {
        create: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue(null),
      },
      datingPreference: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({}),
      },
      privacySetting: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
        upsert: jest.fn().mockResolvedValue({}),
      },
      notificationPreference: {
        create: jest.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
      },
      $transaction: jest.fn(async (arg) => {
        if (typeof arg === 'function') {
          return arg(prismaMock);
        }
        return Promise.all(arg);
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new TransformResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  let jwtToken: string;

  describe('1. Authentication Endpoints', () => {
    it('POST /api/v1/auth/login - should log in and return accessToken', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'alex.rivera@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe('alex.rivera@example.com');
      jwtToken = res.body.data.accessToken;
    });

    it('POST /api/v1/auth/login - should return 400 validation error for invalid body', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'not-an-email',
          password: '',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('2. Protected Profile Access', () => {
    it('GET /api/v1/profiles/me - should reject request without Bearer token (401)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/profiles/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(401);
    });

    it('GET /api/v1/profiles/me - should return profile for authenticated user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/profiles/me')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.displayName).toBe('Alex Rivera');
      expect(res.body.data.completion).toBeDefined();
    });
  });

  describe('3. Discovery & Like Actions', () => {
    it('GET /api/v1/discovery - should return candidate profiles feed', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/discovery')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/discovery/like - should perform like action', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/discovery/like')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          toUserId: mockTargetUser.id,
          type: LikeType.STANDARD,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.likeType).toBe('STANDARD');
      expect(res.body.data.isMatch).toBeDefined();
    });
  });

  describe('4. Matches & Safety Endpoints', () => {
    it('GET /api/v1/matches - should return matches list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/matches')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('POST /api/v1/users/:id/block - should block target user', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/users/${mockTargetUser.id}/block`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ reason: 'Testing block action' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('User blocked successfully');
    });
  });
});
