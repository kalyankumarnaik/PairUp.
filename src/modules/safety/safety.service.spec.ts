import { Test, TestingModule } from '@nestjs/testing';
import { MatchStatus } from '@prisma/client';
import { SafetyService } from './safety.service';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainException } from '../../common/exceptions/domain.exception';
import { ReportReason } from './contracts/moderation.interface';

describe('SafetyService', () => {
  let service: SafetyService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      userBlock: {
        upsert: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      match: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      matchEvent: {
        create: jest.fn(),
      },
      userLike: {
        deleteMany: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(async (arg) => {
        if (typeof arg === 'function') {
          return arg(prisma);
        }
        return Promise.all(arg);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafetyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SafetyService>(SafetyService);
  });

  describe('blockUser', () => {
    it('should reject blocking oneself', async () => {
      await expect(
        service.blockUser('user-1', 'user-1', { reason: 'Test' }),
      ).rejects.toThrow(DomainException);
    });

    it('should block user and dissolve any active mutual match', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
      prisma.userBlock.upsert.mockResolvedValue({});
      prisma.match.findUnique.mockResolvedValue({
        id: 'match-1',
        userOneId: 'user-1',
        userTwoId: 'user-2',
        status: MatchStatus.ACTIVE,
      });
      prisma.match.update.mockResolvedValue({});
      prisma.matchEvent.create.mockResolvedValue({});
      prisma.userLike.deleteMany.mockResolvedValue({ count: 2 });
      prisma.auditLog.create.mockResolvedValue({});

      const result = await service.blockUser('user-1', 'user-2', {
        reason: 'Harassment',
      });

      expect(result.message).toBe('User blocked successfully');
      expect(prisma.match.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'match-1' },
          data: expect.objectContaining({
            status: MatchStatus.BLOCKED,
          }),
        }),
      );
      expect(prisma.userLike.deleteMany).toHaveBeenCalled();
    });
  });

  describe('processReport (Member 4 Interface)', () => {
    it('should ingest safety report and return PENDING_REVIEW status', async () => {
      prisma.auditLog.create.mockResolvedValue({ id: 'audit-log-123' });

      const res = await service.processReport({
        reporterUserId: 'user-1',
        reportedUserId: 'user-2',
        reason: ReportReason.HARASSMENT,
        description: 'Offensive language',
      });

      expect(res.reportId).toBe('audit-log-123');
      expect(res.status).toBe('PENDING_REVIEW');
    });
  });
});
