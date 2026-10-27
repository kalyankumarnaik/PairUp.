import { Test, TestingModule } from '@nestjs/testing';
import { AccountStatus, MatchStatus } from '@prisma/client';
import { MatchesService } from './matches.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { DomainException } from '../../common/exceptions/domain.exception';

describe('MatchesService', () => {
  let service: MatchesService;
  let prisma: any;
  let profilesService: any;

  beforeEach(async () => {
    prisma = {
      match: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      matchEvent: {
        create: jest.fn(),
      },
      userBlock: {
        findFirst: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
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
        displayName: 'Partner User',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProfilesService, useValue: profilesService },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  describe('unmatch', () => {
    it('should unmatch an active match successfully', async () => {
      prisma.match.findUnique.mockResolvedValue({
        id: 'match-1',
        userOneId: 'user-1',
        userTwoId: 'user-2',
        status: MatchStatus.ACTIVE,
      });

      prisma.match.update.mockResolvedValue({});
      prisma.matchEvent.create.mockResolvedValue({});

      const result = await service.unmatch('match-1', 'user-1', {
        reason: 'No longer interested',
      });

      expect(result.message).toBe('Successfully unmatched');
      expect(prisma.match.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'match-1' },
          data: expect.objectContaining({
            status: MatchStatus.UNMATCHED,
            unmatchedById: 'user-1',
          }),
        }),
      );
    });

    it('should reject unmatching a non-active or already closed match', async () => {
      prisma.match.findUnique.mockResolvedValue({
        id: 'match-1',
        userOneId: 'user-1',
        userTwoId: 'user-2',
        status: MatchStatus.UNMATCHED,
      });

      await expect(
        service.unmatch('match-1', 'user-1', { reason: 'Test' }),
      ).rejects.toThrow(DomainException);
    });
  });

  describe('canUsersCommunicate (Member 3 Interface)', () => {
    it('should allow communication when an active match exists and neither is blocked', async () => {
      prisma.userBlock.findFirst.mockResolvedValue(null);
      prisma.user.findMany.mockResolvedValue([
        { id: 'user-1', status: AccountStatus.ACTIVE },
        { id: 'user-2', status: AccountStatus.ACTIVE },
      ]);
      prisma.match.findUnique.mockResolvedValue({
        id: 'match-1',
        userOneId: 'user-1',
        userTwoId: 'user-2',
        status: MatchStatus.ACTIVE,
      });

      const res = await service.canUsersCommunicate('user-1', 'user-2');

      expect(res.canCommunicate).toBe(true);
      expect(res.matchId).toBe('match-1');
      expect(res.reason).toBe('ACTIVE_MATCH');
    });

    it('should forbid communication if either user blocked the other', async () => {
      prisma.userBlock.findFirst.mockResolvedValue({ id: 'block-1' });

      const res = await service.canUsersCommunicate('user-1', 'user-2');

      expect(res.canCommunicate).toBe(false);
      expect(res.reason).toBe('USER_BLOCKED');
    });

    it('should forbid communication if no match exists', async () => {
      prisma.userBlock.findFirst.mockResolvedValue(null);
      prisma.user.findMany.mockResolvedValue([
        { id: 'user-1', status: AccountStatus.ACTIVE },
        { id: 'user-2', status: AccountStatus.ACTIVE },
      ]);
      prisma.match.findUnique.mockResolvedValue(null);

      const res = await service.canUsersCommunicate('user-1', 'user-2');

      expect(res.canCommunicate).toBe(false);
      expect(res.reason).toBe('NO_MATCH');
    });
  });
});
