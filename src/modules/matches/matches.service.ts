import { Injectable, Logger } from '@nestjs/common';
import { AccountStatus, MatchEventType, MatchStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { MatchQueryDto, UnmatchDto, MatchResponseDto } from './dto/match-response.dto';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';
import { IMatchPermissionService, MatchPermissionResult } from './contracts/match-permission.interface';

@Injectable()
export class MatchesService implements IMatchPermissionService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Retrieves matches for a user with cursor pagination and partner previews.
   */
  async getMatches(
    userId: string,
    query: MatchQueryDto,
  ): Promise<PaginatedResultDto<MatchResponseDto>> {
    const limit = query.limit || 20;
    const status = query.status || MatchStatus.ACTIVE;

    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
        status,
        ...(query.cursor ? { id: { gt: query.cursor } } : {}),
      },
      take: limit + 1,
      orderBy: { lastInteractionAt: 'desc' },
    });

    const hasNextPage = matches.length > limit;
    const itemsToReturn = hasNextPage ? matches.slice(0, limit) : matches;

    const formattedMatches: MatchResponseDto[] = [];

    for (const match of itemsToReturn) {
      const partnerId = match.userOneId === userId ? match.userTwoId : match.userOneId;

      try {
        const partnerProfile = await this.profilesService.getPublicProfile(partnerId, userId);
        formattedMatches.push({
          id: match.id,
          status: match.status,
          matchedAt: match.matchedAt,
          lastInteractionAt: match.lastInteractionAt,
          partner: partnerProfile,
          hasUnreadMessages: false, // Placeholder for Member 3
        });
      } catch {
        // Skip if partner profile is blocked or inactive
      }
    }

    const nextCursor =
      itemsToReturn.length > 0 ? itemsToReturn[itemsToReturn.length - 1].id : null;

    return {
      items: formattedMatches,
      meta: {
        limit,
        nextCursor,
        hasNextPage,
      },
    };
  }

  /**
   * Retrieves single match by ID with access control.
   */
  async getMatchById(matchId: string, userId: string): Promise<MatchResponseDto> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        events: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!match || (match.userOneId !== userId && match.userTwoId !== userId)) {
      throw new DomainException('Match not found or access denied', DomainErrorCode.MATCH_NOT_FOUND, 404);
    }

    const partnerId = match.userOneId === userId ? match.userTwoId : match.userOneId;
    const partnerProfile = await this.profilesService.getPublicProfile(partnerId, userId);

    return {
      id: match.id,
      status: match.status,
      matchedAt: match.matchedAt,
      lastInteractionAt: match.lastInteractionAt,
      partner: partnerProfile,
      hasUnreadMessages: false,
    };
  }

  /**
   * Unmatches a pair safely, recording reason and timestamp.
   */
  async unmatch(
    matchId: string,
    userId: string,
    dto: UnmatchDto,
  ): Promise<{ message: string }> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || (match.userOneId !== userId && match.userTwoId !== userId)) {
      throw new DomainException('Match not found', DomainErrorCode.MATCH_NOT_FOUND, 404);
    }

    if (match.status !== MatchStatus.ACTIVE) {
      throw new DomainException('Match is already closed', DomainErrorCode.MATCH_ALREADY_CLOSED, 400);
    }

    await this.prisma.$transaction([
      this.prisma.match.update({
        where: { id: matchId },
        data: {
          status: MatchStatus.UNMATCHED,
          unmatchedAt: new Date(),
          unmatchedById: userId,
          unmatchReason: dto.reason || 'User unmatch request',
        },
      }),
      this.prisma.matchEvent.create({
        data: {
          matchId,
          eventType: MatchEventType.UNMATCHED,
          triggeredById: userId,
          metadata: { reason: dto.reason },
        },
      }),
    ]);

    return { message: 'Successfully unmatched' };
  }

  /**
   * Interface implementation for Member 3 (Chat & WebSockets service).
   * Verifies if two users can send messages or call each other.
   */
  async canUsersCommunicate(userAId: string, userBId: string): Promise<MatchPermissionResult> {
    // 1. Verify blocks
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userAId, blockedId: userBId },
          { blockerId: userBId, blockedId: userAId },
        ],
      },
    });

    if (block) {
      return { canCommunicate: false, reason: 'USER_BLOCKED' };
    }

    // 2. Verify account statuses
    const users = await this.prisma.user.findMany({
      where: { id: { in: [userAId, userBId] } },
      select: { id: true, status: true },
    });

    const allActive = users.length === 2 && users.every((u) => u.status === AccountStatus.ACTIVE);
    if (!allActive) {
      return { canCommunicate: false, reason: 'USER_INACTIVE' };
    }

    // 3. Verify active mutual match
    const [u1, u2] = [userAId, userBId].sort();
    const match = await this.prisma.match.findUnique({
      where: { userOneId_userTwoId: { userOneId: u1, userTwoId: u2 } },
    });

    if (!match) {
      return { canCommunicate: false, reason: 'NO_MATCH' };
    }

    if (match.status !== MatchStatus.ACTIVE) {
      return { canCommunicate: false, matchId: match.id, reason: 'MATCH_UNMATCHED' };
    }

    return {
      canCommunicate: true,
      matchId: match.id,
      reason: 'ACTIVE_MATCH',
    };
  }
}
