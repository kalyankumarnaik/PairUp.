import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  ConnectionMode,
  Gender,
  InterestTag,
  ProfilePhoto,
  ProfileUpdateRequest,
  RelationshipIntention,
  UserProfile,
  VerificationStatus
} from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { INITIAL_INTERESTS } from '@pairup/database';

@Injectable()
export class ProfilesService {
  constructor(private readonly store: MemoryStoreService) {}

  getMyProfile(userId: string): UserProfile {
    const profile = this.store.profiles.get(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  getPublicProfile(targetUserId: string): Partial<UserProfile> {
    const profile = this.store.profiles.get(targetUserId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Sanitize private account information
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      age: profile.age,
      bio: profile.bio,
      gender: profile.gender,
      pronouns: profile.pronouns,
      relationshipIntention: profile.relationshipIntention,
      connectionMode: profile.connectionMode,
      education: profile.education,
      occupation: profile.occupation,
      city: profile.city,
      languages: profile.languages,
      interests: profile.interests,
      photos: profile.photos.filter((p) => p.isModerated),
      prompts: profile.prompts,
      verificationStatus: profile.verificationStatus,
      createdAt: profile.createdAt
    };
  }

  updateProfile(userId: string, updates: ProfileUpdateRequest): UserProfile {
    const profile = this.getMyProfile(userId);

    if (updates.displayName) profile.displayName = updates.displayName;
    if (updates.bio !== undefined) profile.bio = updates.bio;
    if (updates.gender) profile.gender = updates.gender;
    if (updates.pronouns !== undefined) profile.pronouns = updates.pronouns;
    if (updates.relationshipIntention) profile.relationshipIntention = updates.relationshipIntention;
    if (updates.connectionMode) profile.connectionMode = updates.connectionMode;
    if (updates.education !== undefined) profile.education = updates.education;
    if (updates.occupation !== undefined) profile.occupation = updates.occupation;
    if (updates.city !== undefined) profile.city = updates.city;
    if (updates.state !== undefined) profile.state = updates.state;
    if (updates.languages) profile.languages = updates.languages;
    if (updates.isVisible !== undefined) profile.isVisible = updates.isVisible;
    if (updates.isIncognito !== undefined) profile.isIncognito = updates.isIncognito;

    if (updates.prompts) {
      profile.prompts = updates.prompts.map((p, i) => ({
        id: `prm_${profile.id}_${Date.now()}_${i}`,
        question: p.question,
        answer: p.answer
      }));
    }

    profile.completenessScore = this.calculateCompleteness(profile);
    profile.updatedAt = new Date().toISOString();

    this.store.profiles.set(userId, profile);
    return profile;
  }

  addPhoto(userId: string, photoUrl: string): ProfilePhoto {
    const profile = this.getMyProfile(userId);
    if (profile.photos.length >= 9) {
      throw new BadRequestException('Maximum of 9 profile photos allowed');
    }

    const newPhoto: ProfilePhoto = {
      id: `pht_${profile.id}_${Date.now()}`,
      profileId: profile.id,
      url: photoUrl,
      order: profile.photos.length,
      isPrimary: profile.photos.length === 0,
      isModerated: true,
      createdAt: new Date().toISOString()
    };

    profile.photos.push(newPhoto);
    profile.completenessScore = this.calculateCompleteness(profile);
    this.store.profiles.set(userId, profile);

    return newPhoto;
  }

  deletePhoto(userId: string, photoId: string): { deleted: boolean } {
    const profile = this.getMyProfile(userId);
    const initialLen = profile.photos.length;
    profile.photos = profile.photos.filter((p) => p.id !== photoId);

    if (profile.photos.length === initialLen) {
      throw new NotFoundException('Photo not found');
    }

    // If deleted photo was primary, make next one primary
    if (profile.photos.length > 0 && !profile.photos.some((p) => p.isPrimary)) {
      profile.photos[0].isPrimary = true;
    }

    profile.completenessScore = this.calculateCompleteness(profile);
    this.store.profiles.set(userId, profile);

    return { deleted: true };
  }

  reorderPhotos(userId: string, photoIds: string[]): ProfilePhoto[] {
    const profile = this.getMyProfile(userId);
    const photoMap = new Map(profile.photos.map((p) => [p.id, p]));

    const reordered: ProfilePhoto[] = [];
    photoIds.forEach((id, index) => {
      const p = photoMap.get(id);
      if (p) {
        p.order = index;
        p.isPrimary = index === 0;
        reordered.push(p);
      }
    });

    profile.photos = reordered;
    this.store.profiles.set(userId, profile);
    return reordered;
  }

  getAllInterests(): InterestTag[] {
    return INITIAL_INTERESTS.map((item, idx) => ({
      id: `int_seed_${idx + 1}`,
      name: item.name,
      category: item.category,
      emoji: item.emoji
    }));
  }

  private calculateCompleteness(p: UserProfile): number {
    let score = 20; // Base creation score
    if (p.bio && p.bio.length > 20) score += 15;
    if (p.photos.length >= 1) score += 20;
    if (p.photos.length >= 3) score += 10;
    if (p.interests.length >= 3) score += 15;
    if (p.prompts.length >= 1) score += 10;
    if (p.occupation || p.education) score += 5;
    if (p.verificationStatus === VerificationStatus.VERIFIED) score += 5;
    return Math.min(100, score);
  }
}
