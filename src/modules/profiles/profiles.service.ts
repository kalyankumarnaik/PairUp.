import { Injectable, Logger } from '@nestjs/common';
import { AccountStatus, PhotoStatus, VisibilityLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { SYSTEM_CONSTANTS } from '../../common/constants/system.constant';
import { calculateAge, calculateHaversineDistanceKm } from '../../common/utils/distance.util';
import { CreateProfileDto, UpdateProfileDto } from './dto/create-profile.dto';
import { AddPhotoDto, ReorderPhotosDto, SetPromptsDto, SetInterestsDto } from './dto/profile-photo.dto';
import {
  ProfileResponseDto,
  PublicProfileResponseDto,
  ProfileCompletionDto,
  InterestResponseDto,
} from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves current user's full private profile with completion score and checklist.
   */
  async getOwnProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        interests: { include: { interest: true } },
        prompts: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!profile) {
      throw new DomainException(
        'Profile not found. Please complete initial profile setup.',
        DomainErrorCode.PROFILE_NOT_FOUND,
        404,
      );
    }

    const age = calculateAge(profile.birthDate);
    const completion = this.computeCompletion(profile);

    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      birthDate: profile.birthDate,
      age,
      gender: profile.gender,
      sexualOrientation: profile.sexualOrientation,
      bio: profile.bio,
      occupation: profile.occupation,
      education: profile.education,
      heightCm: profile.heightCm,
      drinkingHabit: profile.drinkingHabit,
      smokingHabit: profile.smokingHabit,
      workoutHabit: profile.workoutHabit,
      relationshipIntent: profile.relationshipIntent,
      latitude: profile.latitude,
      longitude: profile.longitude,
      city: profile.city,
      country: profile.country,
      photos: profile.photos.map((p) => ({
        id: p.id,
        url: p.url,
        thumbnailUrl: p.thumbnailUrl,
        displayOrder: p.displayOrder,
        isPrimary: p.isPrimary,
      })),
      interests: profile.interests.map((pi) => ({
        id: pi.interest.id,
        name: pi.interest.name,
        category: pi.interest.category,
        icon: pi.interest.icon,
      })),
      prompts: profile.prompts.map((pr) => ({
        id: pr.id,
        promptQuestion: pr.promptQuestion,
        promptAnswer: pr.promptAnswer,
        displayOrder: pr.displayOrder,
      })),
      completion,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  /**
   * Creates initial profile for user. Enforces 18+ age requirement.
   */
  async createProfile(userId: string, dto: CreateProfileDto): Promise<ProfileResponseDto> {
    const existing = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new DomainException(
        'Profile already exists for this account. Use PATCH to update.',
        DomainErrorCode.PROFILE_ALREADY_EXISTS,
        409,
      );
    }

    const age = calculateAge(dto.birthDate);
    if (age < SYSTEM_CONSTANTS.MINIMUM_DATING_AGE) {
      throw new DomainException(
        `You must be at least ${SYSTEM_CONSTANTS.MINIMUM_DATING_AGE} years old to use PairUp.`,
        DomainErrorCode.UNDERAGE_RESTRICTION,
        403,
      );
    }

    const newProfile = await this.prisma.profile.create({
      data: {
        userId,
        displayName: dto.displayName.trim(),
        birthDate: dto.birthDate,
        gender: dto.gender,
        sexualOrientation: dto.sexualOrientation,
        bio: dto.bio?.trim() || null,
        occupation: dto.occupation?.trim() || null,
        education: dto.education?.trim() || null,
        heightCm: dto.heightCm || null,
        drinkingHabit: dto.drinkingHabit || null,
        smokingHabit: dto.smokingHabit || null,
        workoutHabit: dto.workoutHabit || null,
        relationshipIntent: dto.relationshipIntent || 'LONG_TERM',
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        city: dto.city?.trim() || null,
        country: dto.country?.trim() || null,
      },
      include: {
        photos: true,
        interests: { include: { interest: true } },
        prompts: true,
      },
    });

    // Update completion score in DB
    const completion = this.computeCompletion(newProfile);
    await this.prisma.profile.update({
      where: { id: newProfile.id },
      data: {
        completionScore: completion.score,
        isProfileComplete: completion.isComplete,
      },
    });

    return this.getOwnProfile(userId);
  }

  /**
   * Updates profile fields and recalculates completion metrics.
   */
  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...(dto.displayName && { displayName: dto.displayName.trim() }),
        ...(dto.sexualOrientation && { sexualOrientation: dto.sexualOrientation }),
        ...(dto.bio !== undefined && { bio: dto.bio?.trim() || null }),
        ...(dto.occupation !== undefined && { occupation: dto.occupation?.trim() || null }),
        ...(dto.education !== undefined && { education: dto.education?.trim() || null }),
        ...(dto.heightCm !== undefined && { heightCm: dto.heightCm }),
        ...(dto.drinkingHabit !== undefined && { drinkingHabit: dto.drinkingHabit }),
        ...(dto.smokingHabit !== undefined && { smokingHabit: dto.smokingHabit }),
        ...(dto.workoutHabit !== undefined && { workoutHabit: dto.workoutHabit }),
        ...(dto.relationshipIntent && { relationshipIntent: dto.relationshipIntent }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
        ...(dto.city !== undefined && { city: dto.city?.trim() || null }),
        ...(dto.country !== undefined && { country: dto.country?.trim() || null }),
        lastActiveAt: new Date(),
      },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        interests: { include: { interest: true } },
        prompts: { orderBy: { displayOrder: 'asc' } },
      },
    });

    const completion = this.computeCompletion(updated);
    await this.prisma.profile.update({
      where: { id: updated.id },
      data: {
        completionScore: completion.score,
        isProfileComplete: completion.isComplete,
      },
    });

    return this.getOwnProfile(userId);
  }

  /**
   * Retrieves public profile for discovery/viewing with privacy and block enforcement.
   */
  async getPublicProfile(targetUserId: string, requesterUserId: string): Promise<PublicProfileResponseDto> {
    // 1. Check if either user has blocked the other
    const block = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: requesterUserId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: requesterUserId },
        ],
      },
    });

    if (block) {
      throw new DomainException('Profile is unavailable', DomainErrorCode.USER_IS_BLOCKED, 404);
    }

    // 2. Fetch target profile, privacy settings, and active user status
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
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
      },
    });

    if (
      !targetUser ||
      !targetUser.profile ||
      targetUser.status !== AccountStatus.ACTIVE
    ) {
      throw new DomainException('Profile is unavailable or inactive', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    const { profile, privacySetting } = targetUser;

    // 3. Privacy Visibility checks
    if (privacySetting?.visibility === VisibilityLevel.MATCHES_ONLY) {
      // Check if active match exists between requester and target
      const [u1, u2] = [requesterUserId, targetUserId].sort();
      const match = await this.prisma.match.findUnique({
        where: { userOneId_userTwoId: { userOneId: u1, userTwoId: u2 } },
      });
      if (!match || match.status !== 'ACTIVE') {
        throw new DomainException('This profile is only visible to active matches', DomainErrorCode.FORBIDDEN_RESOURCE, 403);
      }
    }

    // 4. Calculate Distance
    let distanceKm: number | null = null;
    if (privacySetting?.showDistance !== false) {
      const requesterProfile = await this.prisma.profile.findUnique({
        where: { userId: requesterUserId },
        select: { latitude: true, longitude: true },
      });

      if (
        requesterProfile?.latitude &&
        requesterProfile?.longitude &&
        profile.latitude &&
        profile.longitude
      ) {
        distanceKm = calculateHaversineDistanceKm(
          requesterProfile.latitude,
          requesterProfile.longitude,
          profile.latitude,
          profile.longitude,
        );
      }
    }

    const age = privacySetting?.showAge !== false ? calculateAge(profile.birthDate) : null;

    return {
      userId: targetUser.id,
      displayName: profile.displayName,
      age: age ?? undefined,
      gender: profile.gender,
      sexualOrientation: profile.sexualOrientation,
      bio: profile.bio,
      occupation: profile.occupation,
      education: profile.education,
      heightCm: profile.heightCm,
      drinkingHabit: profile.drinkingHabit,
      smokingHabit: profile.smokingHabit,
      workoutHabit: profile.workoutHabit,
      relationshipIntent: profile.relationshipIntent,
      city: profile.city,
      distanceKm: distanceKm ?? undefined,
      photos: profile.photos.map((p) => ({
        id: p.id,
        url: p.url,
        thumbnailUrl: p.thumbnailUrl,
        displayOrder: p.displayOrder,
        isPrimary: p.isPrimary,
      })),
      interests: profile.interests.map((pi) => ({
        id: pi.interest.id,
        name: pi.interest.name,
        category: pi.interest.category,
        icon: pi.interest.icon,
      })),
      prompts: profile.prompts.map((pr) => ({
        id: pr.id,
        promptQuestion: pr.promptQuestion,
        promptAnswer: pr.promptAnswer,
        displayOrder: pr.displayOrder,
      })),
    };
  }

  // --------------------------------------------------------------------------
  // Photos Management
  // --------------------------------------------------------------------------

  async addPhoto(userId: string, dto: AddPhotoDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    if (profile.photos.length >= SYSTEM_CONSTANTS.MAX_ACTIVE_PHOTOS) {
      throw new DomainException(
        `Maximum photo limit reached (${SYSTEM_CONSTANTS.MAX_ACTIVE_PHOTOS})`,
        DomainErrorCode.PHOTO_LIMIT_EXCEEDED,
        400,
      );
    }

    const isFirstPhoto = profile.photos.length === 0;
    const shouldBePrimary = dto.isPrimary || isFirstPhoto;

    await this.prisma.$transaction(async (tx) => {
      if (shouldBePrimary) {
        await tx.profilePhoto.updateMany({
          where: { profileId: profile.id },
          data: { isPrimary: false },
        });
      }

      await tx.profilePhoto.create({
        data: {
          profileId: profile.id,
          url: dto.url,
          thumbnailUrl: dto.thumbnailUrl || null,
          displayOrder: profile.photos.length,
          isPrimary: shouldBePrimary,
          status: PhotoStatus.APPROVED,
        },
      });
    });

    return this.getOwnProfile(userId);
  }

  async deletePhoto(userId: string, photoId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: { orderBy: { displayOrder: 'asc' } } },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    const photoToDelete = profile.photos.find((p) => p.id === photoId);
    if (!photoToDelete) {
      throw new DomainException('Photo not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.profilePhoto.delete({
        where: { id: photoId },
      });

      const remainingPhotos = profile.photos.filter((p) => p.id !== photoId);

      // Re-normalize order
      for (let i = 0; i < remainingPhotos.length; i++) {
        const isPrimary = photoToDelete.isPrimary && i === 0 ? true : remainingPhotos[i].isPrimary;
        await tx.profilePhoto.update({
          where: { id: remainingPhotos[i].id },
          data: { displayOrder: i, isPrimary },
        });
      }
    });

    return this.getOwnProfile(userId);
  }

  async reorderPhotos(userId: string, dto: ReorderPhotosDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    await this.prisma.$transaction(
      dto.orders.map((o) =>
        this.prisma.profilePhoto.updateMany({
          where: { id: o.photoId, profileId: profile.id },
          data: { displayOrder: o.displayOrder },
        }),
      ),
    );

    return this.getOwnProfile(userId);
  }

  async setPrimaryPhoto(userId: string, photoId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    const targetPhoto = profile.photos.find((p) => p.id === photoId);
    if (!targetPhoto) {
      throw new DomainException('Photo not found', DomainErrorCode.RESOURCE_NOT_FOUND, 404);
    }

    await this.prisma.$transaction([
      this.prisma.profilePhoto.updateMany({
        where: { profileId: profile.id },
        data: { isPrimary: false },
      }),
      this.prisma.profilePhoto.update({
        where: { id: photoId },
        data: { isPrimary: true },
      }),
    ]);

    return this.getOwnProfile(userId);
  }

  // --------------------------------------------------------------------------
  // Prompts & Interests Management
  // --------------------------------------------------------------------------

  async setPrompts(userId: string, dto: SetPromptsDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    if (dto.prompts.length > SYSTEM_CONSTANTS.MAX_PROFILE_PROMPTS) {
      throw new DomainException(
        `Cannot specify more than ${SYSTEM_CONSTANTS.MAX_PROFILE_PROMPTS} profile prompts`,
        DomainErrorCode.PROMPT_LIMIT_EXCEEDED,
        400,
      );
    }

    await this.prisma.$transaction([
      this.prisma.profilePrompt.deleteMany({
        where: { profileId: profile.id },
      }),
      this.prisma.profilePrompt.createMany({
        data: dto.prompts.map((p, idx) => ({
          profileId: profile.id,
          promptQuestion: p.promptQuestion.trim(),
          promptAnswer: p.promptAnswer.trim(),
          displayOrder: idx,
        })),
      }),
    ]);

    return this.getOwnProfile(userId);
  }

  async getAllInterests(): Promise<InterestResponseDto[]> {
    return this.prisma.interest.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async setInterests(userId: string, dto: SetInterestsDto): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new DomainException('Profile not found', DomainErrorCode.PROFILE_NOT_FOUND, 404);
    }

    // Match interest names against taxonomy
    const matchedInterests = await this.prisma.interest.findMany({
      where: {
        OR: [
          { name: { in: dto.interestNames } },
          { id: { in: dto.interestNames } },
        ],
      },
    });

    await this.prisma.$transaction([
      this.prisma.profileInterest.deleteMany({
        where: { profileId: profile.id },
      }),
      this.prisma.profileInterest.createMany({
        data: matchedInterests.map((i) => ({
          profileId: profile.id,
          interestId: i.id,
        })),
      }),
    ]);

    return this.getOwnProfile(userId);
  }

  // --------------------------------------------------------------------------
  // Profile Completion Score Engine
  // --------------------------------------------------------------------------

  private computeCompletion(profile: any): ProfileCompletionDto {
    let score = 0;
    const missingItems: string[] = [];

    // Basic demographic criteria (20 points)
    if (profile.displayName && profile.birthDate && profile.gender) {
      score += 20;
    }

    // Photos criteria (30 points)
    const photosCount = profile.photos ? profile.photos.length : 0;
    const hasPrimary = profile.photos ? profile.photos.some((p: any) => p.isPrimary) : false;

    if (hasPrimary) {
      score += 15;
    } else {
      missingItems.push('Set a primary avatar photo');
    }

    if (photosCount >= 3) {
      score += 15;
    } else {
      score += Math.round((photosCount / 3) * 15);
      missingItems.push(`Upload at least 3 photos (currently ${photosCount})`);
    }

    // Bio criteria (15 points)
    if (profile.bio && profile.bio.trim().length >= 20) {
      score += 15;
    } else {
      missingItems.push('Write a short bio introducing yourself (at least 20 chars)');
    }

    // Interests criteria (15 points)
    const interestsCount = profile.interests ? profile.interests.length : 0;
    if (interestsCount >= 3) {
      score += 15;
    } else {
      score += Math.round((interestsCount / 3) * 15);
      missingItems.push(`Select at least 3 interests (currently ${interestsCount})`);
    }

    // Prompts criteria (10 points)
    const promptsCount = profile.prompts ? profile.prompts.length : 0;
    if (promptsCount >= 1) {
      score += 10;
    } else {
      missingItems.push('Answer at least one profile conversation prompt');
    }

    // Career & Lifestyle criteria (10 points)
    if (profile.occupation || profile.education) {
      score += 10;
    } else {
      missingItems.push('Add your occupation or education');
    }

    const clampedScore = Math.min(100, Math.max(0, score));

    return {
      score: clampedScore,
      isComplete: clampedScore >= 70 && hasPrimary && photosCount >= 1,
      missingItems,
    };
  }
}
