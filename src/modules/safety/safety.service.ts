import { Injectable, Logger } from '@nestjs/common';
import { AuditActionType, MatchEventType, MatchStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { BlockUserDto, BlockedUserResponseDto, SubmitReportDto, AuditQueryDto, AuditLogResponseDto } from './dto/safety.dto';
import { IModerationService, ReportResult, MODERATION_SERVICE_TOKEN } from './contracts/moderation.interface';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class SafetyService implements IModerationService {
  private readonly logger = new Logger(SafetyService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Blocks a user, immediately dissolving any existing match and likes.
   */
  async blockUser(
    blockerId: string,
    targetUserId: string,
    dto: BlockUserDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    if (blockerId === targetUserId) {
      throw new DomainException(
        'You cannot block your own account',
        DomainErrorCode.CANNOT_BLOCK_SELF,
        400,
      );
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!target) {
      throw new DomainException('Target user not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    // Canonical ordering for match lookup
    const [u1, u2] = [blockerId, targetUserId].sort();

    await this.prisma.$transaction(async (tx) => {
      // 1. Upsert block
      await tx.userBlock.upsert({
        where: {
          blockerId_blockedId: { blockerId, blockedId: targetUserId },
        },
        create: {
          blockerId,
          blockedId: targetUserId,
          reason: dto.reason || 'User block request',
        },
        update: {
          reason: dto.reason || 'User block request',
        },
      });

      // 2. Terminate any active match
      const existingMatch = await tx.match.findUnique({
        where: { userOneId_userTwoId: { userOneId: u1, userTwoId: u2 } },
      });

      if (existingMatch && existingMatch.status === MatchStatus.ACTIVE) {
        await tx.match.update({
          where: { id: existingMatch.id },
          data: {
            status: MatchStatus.BLOCKED,
            unmatchedAt: new Date(),
            unmatchedById: blockerId,
            unmatchReason: `BLOCKED: ${dto.reason || 'Blocked by user'}`,
          },
        });

        await tx.matchEvent.create({
          data: {
            matchId: existingMatch.id,
            eventType: MatchEventType.UNMATCHED,
            triggeredById: blockerId,
            metadata: { note: 'Match terminated due to user block' },
          },
        });
      }

      // 3. Remove pending likes between both users
      await tx.userLike.deleteMany({
        where: {
          OR: [
            { fromUserId: blockerId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: blockerId },
          ],
        },
      });

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          userId: blockerId,
          action: AuditActionType.USER_BLOCKED,
          ipAddress,
          userAgent,
          details: { blockedUserId: targetUserId, reason: dto.reason },
        },
      });
    });

    return { message: 'User blocked successfully' };
  }

  /**
   * Unblocks a previously blocked user.
   */
  async unblockUser(
    blockerId: string,
    targetUserId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string }> {
    const existing = await this.prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId, blockedId: targetUserId },
      },
    });

    if (!existing) {
      throw new DomainException('User block not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    await this.prisma.$transaction([
      this.prisma.userBlock.delete({
        where: {
          blockerId_blockedId: { blockerId, blockedId: targetUserId },
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: blockerId,
          action: AuditActionType.USER_UNBLOCKED,
          ipAddress,
          userAgent,
          details: { unblockedUserId: targetUserId },
        },
      }),
    ]);

    return { message: 'User unblocked successfully' };
  }

  /**
   * Retrieves all users currently blocked by the authenticated user.
   */
  async getBlockedUsers(userId: string): Promise<BlockedUserResponseDto[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return blocks.map((b) => ({
      blockedUserId: b.blockedId,
      displayName: b.blocked.profile?.displayName || 'PairUp User',
      reason: b.reason,
      blockedAt: b.createdAt,
    }));
  }

  /**
   * Implements IModerationService: Ingests user safety report and logs for Member 4 processing.
   */
  async processReport(dto: SubmitReportDto & { reporterUserId: string }): Promise<ReportResult> {
    this.logger.log(`Safety Report received: ${dto.reporterUserId} reported ${dto.reportedUserId} for ${dto.reason}`);

    // Audit the safety report event
    const audit = await this.prisma.auditLog.create({
      data: {
        userId: dto.reporterUserId,
        action: AuditActionType.SECURITY_ALERT as any,
        details: {
          reportType: 'USER_FLAG',
          reportedUserId: dto.reportedUserId,
          reason: dto.reason,
          description: dto.description,
        },
      },
    });

    return {
      reportId: audit.id,
      status: 'PENDING_REVIEW',
      autoActionTaken: 'Flagged for Member 4 AI Moderation Pipeline',
    };
  }

  /**
   * Administrative query of system security audit logs.
   */
  async getAuditLogs(query: AuditQueryDto): Promise<PaginatedResultDto<AuditLogResponseDto>> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.action && { action: query.action }),
      ...(query.userId && { userId: query.userId }),
    };

    const [totalItems, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: logs.map((l) => ({
        id: l.id,
        userId: l.userId,
        action: l.action,
        ipAddress: l.ipAddress,
        userAgent: l.userAgent,
        details: l.details as any,
        createdAt: l.createdAt,
      })),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }
}
