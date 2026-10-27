import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DomainErrorCode, DomainException } from '../../common/exceptions/domain.exception';
import { UpdatePreferencesDto, UpdatePrivacyDto } from './dto/update-preferences.dto';
import { DatingPreferenceResponseDto, PrivacySettingResponseDto } from './dto/profile-response.dto';

@Injectable()
export class PreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves dating search preferences for user.
   */
  async getDatingPreferences(userId: string): Promise<DatingPreferenceResponseDto> {
    let pref = await this.prisma.datingPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await this.prisma.datingPreference.create({
        data: {
          userId,
          minAge: 18,
          maxAge: 99,
          maxDistanceKm: 50,
          genderPreferences: [],
          intentPreferences: [],
        },
      });
    }

    return {
      userId: pref.userId,
      minAge: pref.minAge,
      maxAge: pref.maxAge,
      genderPreferences: pref.genderPreferences,
      maxDistanceKm: pref.maxDistanceKm,
      intentPreferences: pref.intentPreferences,
      globalDiscovery: pref.globalDiscovery,
    };
  }

  /**
   * Updates dating search preferences.
   */
  async updateDatingPreferences(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<DatingPreferenceResponseDto> {
    if (dto.minAge && dto.maxAge && dto.minAge > dto.maxAge) {
      throw new DomainException(
        'Minimum age preference cannot exceed maximum age preference',
        DomainErrorCode.UNDERAGE_RESTRICTION,
        400,
      );
    }

    const updated = await this.prisma.datingPreference.upsert({
      where: { userId },
      create: {
        userId,
        minAge: dto.minAge || 18,
        maxAge: dto.maxAge || 99,
        genderPreferences: dto.genderPreferences || [],
        maxDistanceKm: dto.maxDistanceKm || 50,
        intentPreferences: dto.intentPreferences || [],
        globalDiscovery: dto.globalDiscovery ?? false,
      },
      update: {
        ...(dto.minAge !== undefined && { minAge: dto.minAge }),
        ...(dto.maxAge !== undefined && { maxAge: dto.maxAge }),
        ...(dto.genderPreferences !== undefined && { genderPreferences: dto.genderPreferences }),
        ...(dto.maxDistanceKm !== undefined && { maxDistanceKm: dto.maxDistanceKm }),
        ...(dto.intentPreferences !== undefined && { intentPreferences: dto.intentPreferences }),
        ...(dto.globalDiscovery !== undefined && { globalDiscovery: dto.globalDiscovery }),
      },
    });

    return {
      userId: updated.userId,
      minAge: updated.minAge,
      maxAge: updated.maxAge,
      genderPreferences: updated.genderPreferences,
      maxDistanceKm: updated.maxDistanceKm,
      intentPreferences: updated.intentPreferences,
      globalDiscovery: updated.globalDiscovery,
    };
  }

  /**
   * Retrieves privacy and visibility settings for user.
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettingResponseDto> {
    let privacy = await this.prisma.privacySetting.findUnique({
      where: { userId },
    });

    if (!privacy) {
      privacy = await this.prisma.privacySetting.create({
        data: {
          userId,
          visibility: 'PUBLIC',
          showDistance: true,
          showOnlineStatus: true,
          showReadReceipts: true,
          showAge: true,
        },
      });
    }

    return {
      userId: privacy.userId,
      visibility: privacy.visibility,
      showDistance: privacy.showDistance,
      showOnlineStatus: privacy.showOnlineStatus,
      showReadReceipts: privacy.showReadReceipts,
      showAge: privacy.showAge,
    };
  }

  /**
   * Updates privacy and visibility settings.
   */
  async updatePrivacySettings(
    userId: string,
    dto: UpdatePrivacyDto,
  ): Promise<PrivacySettingResponseDto> {
    const updated = await this.prisma.privacySetting.upsert({
      where: { userId },
      create: {
        userId,
        visibility: dto.visibility || 'PUBLIC',
        showDistance: dto.showDistance ?? true,
        showOnlineStatus: dto.showOnlineStatus ?? true,
        showReadReceipts: dto.showReadReceipts ?? true,
        showAge: dto.showAge ?? true,
      },
      update: {
        ...(dto.visibility !== undefined && { visibility: dto.visibility }),
        ...(dto.showDistance !== undefined && { showDistance: dto.showDistance }),
        ...(dto.showOnlineStatus !== undefined && { showOnlineStatus: dto.showOnlineStatus }),
        ...(dto.showReadReceipts !== undefined && { showReadReceipts: dto.showReadReceipts }),
        ...(dto.showAge !== undefined && { showAge: dto.showAge }),
      },
    });

    return {
      userId: updated.userId,
      visibility: updated.visibility,
      showDistance: updated.showDistance,
      showOnlineStatus: updated.showOnlineStatus,
      showReadReceipts: updated.showReadReceipts,
      showAge: updated.showAge,
    };
  }
}
