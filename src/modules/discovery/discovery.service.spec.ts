import { Test, TestingModule } from '@nestjs/testing';
import { AccountStatus, Gender, LikeType, MatchStatus, SexualOrientation, VisibilityLevel } from '@prisma/client';
import { DiscoveryService } from './discovery.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { DomainException } from '../../common/exceptions/domain.exception';

describe('DiscoveryService', () => {
  let service: DiscoveryService;
  let prisma: any;
  let profilesService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      userLike: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
      userPass: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
      userBlock: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      match: {
        upsert: jest.fn(),
      },
      $transaction: jest.fn(async (arg) => {
        if (typeof arg === 'function') {
          return arg(prisma);
        }
        return Promise.all(arg);
      }),
    };

    profilesService = {
      getPublicProfile: jest.fn().mockResolvedValue({
        userId: 'user-2',
        displayName: 'Liam Chen',
        age: 30,
        gender: Gender.MALE,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscoveryService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProfilesService, useValue: profilesService },
      ],
    }).compile();

    service = module.get<DiscoveryService>(DiscoveryService);
  });

  describe('likeUser', () => {
    it('should reject liking oneself', async () => {
      await expect(
        service.likeUser('user-1', { toUserId: 'user-1' }),
      ).rejects.toThrow(DomainException);
    });

    it('should record Like without match if target has not liked back', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', status: AccountStatus.ACTIVE });
      prisma.userBlock.findFirst.mockResolvedValue(null);
      prisma.userLike.upsert.mockResolvedValue({});
      prisma.userPass.deleteMany.mockResolvedValue({ count: 0 });
      prisma.userLike.findUnique.mockResolvedValue(null); // No reciprocal like yet

      const result = await service.likeUser('user-1', { toUserId: 'user-2' });

      expect(result.isMatch).toBe(false);
      expect(result.matchId).toBeNull();
    });

    it('should atomically create a match when reciprocal like is detected', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2', status: AccountStatus.ACTIVE });
      prisma.userBlock.findFirst.mockResolvedValue(null);
      prisma.userLike.upsert.mockResolvedValue({});
      prisma.userPass.deleteMany.mockResolvedValue({ count: 0 });

      // Target user-2 has already liked user-1
      prisma.userLike.findUnique.mockResolvedValue({
        fromUserId: 'user-2',
        toUserId: 'user-1',
        type: LikeType.STANDARD,
      });

      prisma.match.upsert.mockResolvedValue({
        id: 'match-uuid-123',
        userOneId: 'user-1',
        userTwoId: 'user-2',
        status: MatchStatus.ACTIVE,
      });

      const result = await service.likeUser('user-1', { toUserId: 'user-2' });

      expect(result.isMatch).toBe(true);
      expect(result.matchId).toBe('match-uuid-123');
      expect(result.matchedProfile).toBeDefined();

      // Verify canonical ordering userOneId < userTwoId
      expect(prisma.match.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userOneId_userTwoId: { userOneId: 'user-1', userTwoId: 'user-2' },
          },
        }),
      );
    });
  });

  describe('passUser', () => {
    it('should record a pass for candidate', async () => {
      prisma.userPass.upsert.mockResolvedValue({});

      const result = await service.passUser('user-1', { toUserId: 'user-2' });

      expect(result.success).toBe(true);
      expect(prisma.userPass.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            fromUserId_toUserId: { fromUserId: 'user-1', toUserId: 'user-2' },
          },
        }),
      );
    });
  });
});
