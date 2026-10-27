import { Injectable, Logger } from '@nestjs/common';
import {
  AccountStatus,
  LikeType,
  MatchEventType,
  MatchStatus,
  PhotoStatus,
  VisibilityLevel,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { calculateAge, calculateHaversineDistanceKm } from '../../common/utils/distance.util';
import { DiscoveryQueryDto, LikeActionDto, PassActionDto, LikeResultDto, PassResultDto } from './dto/discovery-query.dto';
import { PublicProfileResponseDto } from '../profiles/dto/profile-response.dto';
import { PaginatedResultDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Generates candidate profiles feed using preference matching,
   * distance calculations, and exclusion filters.
   */
  async getDiscoveryFeed(
    userId: string,
    query: DiscoveryQueryDto,
  ): Promise<PaginatedResultDto<PublicProfileResponseDto>> {
    const limit = query.limit || 10;

    // 1. Fetch requester's profile and dating preferences
    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: { interests: true },
        },
        datingPreference: true,
      },
    });

    if (!requester || !requester.profile) {
      throw new DomainException(
        'Please complete your profile before exploring discovery',
        DomainErrorCode.PROFILE_INCOMPLETE,
        400,
      );
    }

    const preferences = requester.datingPreference || {
      minAge: 18,
      maxAge: 99,
      maxDistanceKm: 50,
      genderPreferences: [],
      intentPreferences: [],
      globalDiscovery: false,
    };

    // 2. Collect all excluded User IDs:
    // - Self
    // - Users already liked by requester
    // - Users already passed by requester
    // - Users blocked by requester or who blocked requester
    const [sentLikes, sentPasses, blockedByMe, blockedMe] = await Promise.all([
      this.prisma.userLike.findMany({
        where: { fromUserId: userId },
        select: { toUserId: true },
      }),
      this.prisma.userPass.findMany({
        where: { fromUserId: userId },
        select: { toUserId: true },
      }),
      this.prisma.userBlock.findMany({
        where: { blockerId: userId },
        select: { blockedId: true },
      }),
      this.prisma.userBlock.findMany({
        where: { blockedId: userId },
        select: { blockerId: true },
      }),
    ]);

    const excludedIds = new Set<string>([
      userId,
      ...sentLikes.map((l) => l.toUserId),
      ...sentPasses.map((p) => p.toUserId),
      ...blockedByMe.map((b) => b.blockedId),
      ...blockedMe.map((b) => b.blockerId),
    ]);

    // 3. Query candidate pool from DB
    const candidateUsers = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: Array.from(excludedIds),
          ...(query.cursor ? { gt: query.cursor } : {}),
        },
        status: AccountStatus.ACTIVE,
        profile: {
          isProfileComplete: true,
          ...(preferences.genderPreferences && preferences.genderPreferences.length > 0
            ? { gender: { in: preferences.genderPreferences } }
            : {}),
          ...(preferences.intentPreferences && preferences.intentPreferences.length > 0
            ? { relationshipIntent: { in: preferences.intentPreferences } }
            : {}),
        },
      },
      include: {
        profile: {
          include: {
            photos: {
              where: { status: PhotoStatus.APPROVED },
              orderBy: { displayOrder: 'asc' },
            },
            interests: { include: { interest: true } },
            prompts: { orderBy: { displayOrder: 'asc' } },
          },
        },
        privacySetting: true,
        receivedLikes: {
          where: { fromUserId: userId },
        },
      },
      take: limit * 2, // Take larger batch for post-filtering
      orderBy: { id: 'asc' },
    });

    const requesterInterestIds = new Set(
      requester.profile.interests.map((i) => i.interestId),
    );

    const filteredCandidates: (PublicProfileResponseDto & { sortScore: number })[] = [];

    for (const candidate of candidateUsers) {
      if (!candidate.profile) continue;

      // Privacy checks
      if (candidate.privacySetting?.visibility === VisibilityLevel.INCOGNITO) {
        // Incognito profiles are only visible if the candidate has ALREADY liked the requester!
        const reciprocalLike = await this.prisma.userLike.findUnique({
          where: {
            fromUserId_toUserId: { fromUserId: candidate.id, toUserId: userId },
          },
        });
        if (!reciprocalLike) continue;
      } else if (candidate.privacySetting?.visibility === VisibilityLevel.MATCHES_ONLY) {
        continue; // Not visible in discovery feed
      }

      // Age calculation & preference filter
      const candidateAge = calculateAge(candidate.profile.birthDate);
      if (candidateAge < preferences.minAge || candidateAge > preferences.maxAge) {
        continue;
      }

      // Distance calculation & filter
      let distanceKm: number | null = null;
      if (
        requester.profile.latitude &&
        requester.profile.longitude &&
        candidate.profile.latitude &&
        candidate.profile.longitude
      ) {
        distanceKm = calculateHaversineDistanceKm(
          requester.profile.latitude,
          requester.profile.longitude,
          candidate.profile.latitude,
          candidate.profile.longitude,
        );

        if (!preferences.globalDiscovery && distanceKm > preferences.maxDistanceKm) {
          continue;
        }
      }

      // Calculate shared interests
      let sharedCount = 0;
      for (const item of candidate.profile.interests) {
        if (requesterInterestIds.has(item.interestId)) {
          sharedCount++;
        }
      }

      // Ranking score heuristic: shared interests + proximity bonus
      const distanceBonus = distanceKm !== null ? Math.max(0, 50 - distanceKm / 2) : 10;
      const sortScore = sharedCount * 20 + distanceBonus;

      const publicDto: PublicProfileResponseDto & { sortScore: number } = {
        userId: candidate.id,
        displayName: candidate.profile.displayName,
        age: candidate.privacySetting?.showAge !== false ? candidateAge : undefined,
        gender: candidate.profile.gender,
        sexualOrientation: candidate.profile.sexualOrientation,
        bio: candidate.profile.bio,
        occupation: candidate.profile.occupation,
        education: candidate.profile.education,
        heightCm: candidate.profile.heightCm,
        drinkingHabit: candidate.profile.drinkingHabit,
        smokingHabit: candidate.profile.smokingHabit,
        workoutHabit: candidate.profile.workoutHabit,
        relationshipIntent: candidate.profile.relationshipIntent,
        city: candidate.profile.city,
        distanceKm:
          candidate.privacySetting?.showDistance !== false && distanceKm !== null
            ? distanceKm
            : undefined,
        photos: candidate.profile.photos.map((p) => ({
          id: p.id,
          url: p.url,
          thumbnailUrl: p.thumbnailUrl,
          displayOrder: p.displayOrder,
          isPrimary: p.isPrimary,
        })),
        interests: candidate.profile.interests.map((pi) => ({
          id: pi.interest.id,
          name: pi.interest.name,
          category: pi.interest.category,
          icon: pi.interest.icon,
        })),
        prompts: candidate.profile.prompts.map((pr) => ({
          id: pr.id,
          promptQuestion: pr.promptQuestion,
          promptAnswer: pr.promptAnswer,
          displayOrder: pr.displayOrder,
        })),
        sortScore,
      };

      filteredCandidates.push(publicDto);
    }

    // Sort candidates by compatibility heuristic
    filteredCandidates.sort((a, b) => b.sortScore - a.sortScore);

    const pagedItems = filteredCandidates.slice(0, limit);
    const nextCursor =
      pagedItems.length > 0 ? pagedItems[pagedItems.length - 1].userId : null;

    return {
      items: pagedItems.map(({ sortScore, ...rest }) => rest),
      meta: {
        limit,
        nextCursor,
        hasNextPage: filteredCandidates.length > limit,
      },
    };
  }

  /**
   * Executes a Like or Superlike action with atomic mutual-match creation.
   * Transaction-safe: prevents duplicate matches under concurrent likes.
   */
  async likeUser(fromUserId: string, dto: LikeActionDto): Promise<LikeResultDto> {
    if (fromUserId === dto.toUserId) {
      throw new DomainException(
        'You cannot like your own profile',
        DomainErrorCode.SELF_ACTION_NOT_ALLOWED,
        400,
      );
    }

    // 1. Verify target user exists and is active
    const target = await this.prisma.user.findUnique({
      where: { id: dto.toUserId },
      select: { id: true, status: true },
    });

    if (!target || target.status !== AccountStatus.ACTIVE) {
      throw new DomainException('Target user is not available', DomainErrorCode.TARGET_NOT_FOUND, 404);
    }

    // 2. Verify neither user is blocked
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: fromUserId, blockedId: dto.toUserId },
          { blockerId: dto.toUserId, blockedId: fromUserId },
        ],
      },
    });

    if (block) {
      throw new DomainException('Cannot interact with this profile', DomainErrorCode.USER_IS_BLOCKED, 403);
    }

    const likeType = dto.type || LikeType.STANDARD;

    // 3. Transaction-safe Like insertion and Mutual Match check
    // Canonical ordering: [userOneId, userTwoId] ensures userOneId < userTwoId
    const [userOneId, userTwoId] = [fromUserId, dto.toUserId].sort();

    const result = await this.prisma.$transaction(async (tx) => {
      // Upsert UserLike to prevent duplicates
      await tx.userLike.upsert({
        where: {
          fromUserId_toUserId: { fromUserId, toUserId: dto.toUserId },
        },
        create: {
          fromUserId,
          toUserId: dto.toUserId,
          type: likeType,
        },
        update: {
          type: likeType, // Upgrade to Superlike if already liked
        },
      });

      // Remove any existing pass if user changed their mind
      await tx.userPass.deleteMany({
        where: { fromUserId, toUserId: dto.toUserId },
      });

      // Check for reciprocal like
      const reciprocalLike = await tx.userLike.findUnique({
        where: {
          fromUserId_toUserId: { fromUserId: dto.toUserId, toUserId: fromUserId },
        },
      });

      if (!reciprocalLike) {
        return { isMatch: false, matchId: null };
      }

      // Reciprocal like detected: Atomically create or reactivate Match
      const isSuperMatch = likeType === LikeType.SUPERLIKE || reciprocalLike.type === LikeType.SUPERLIKE;

      const match = await tx.match.upsert({
        where: {
          userOneId_userTwoId: { userOneId, userTwoId },
        },
        create: {
          userOneId,
          userTwoId,
          status: MatchStatus.ACTIVE,
          matchedAt: new Date(),
          lastInteractionAt: new Date(),
          events: {
            create: {
              eventType: isSuperMatch ? MatchEventType.SUPERMATCH : MatchEventType.CREATED,
              triggeredById: fromUserId,
              metadata: {
                fromUserLike: likeType,
                reciprocalLike: reciprocalLike.type,
              },
            },
          },
        },
        update: {
          status: MatchStatus.ACTIVE,
          unmatchedAt: null,
          unmatchedById: null,
          unmatchReason: null,
          lastInteractionAt: new Date(),
        },
      });

      return { isMatch: true, matchId: match.id };
    });

    let matchedProfile: PublicProfileResponseDto | null = null;
    if (result.isMatch) {
      try {
        matchedProfile = await this.profilesService.getPublicProfile(dto.toUserId, fromUserId);
      } catch {
        // Fallback: match is still created even if profile formatting fails
      }
    }

    return {
      isMatch: result.isMatch,
      matchId: result.matchId,
      matchedProfile,
      likeType,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Executes a Pass action on candidate profile.
   */
  async passUser(fromUserId: string, dto: PassActionDto): Promise<PassResultDto> {
    if (fromUserId === dto.toUserId) {
      throw new DomainException(
        'You cannot pass on your own profile',
        DomainErrorCode.SELF_ACTION_NOT_ALLOWED,
        400,
      );
    }

    await this.prisma.userPass.upsert({
      where: {
        fromUserId_toUserId: { fromUserId, toUserId: dto.toUserId },
      },
      create: {
        fromUserId,
        toUserId: dto.toUserId,
      },
      update: {
        createdAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Candidate passed successfully',
    };
  }
}
