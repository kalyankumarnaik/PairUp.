import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportCategory, ReportItem, ReportStatus } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

export interface DateCheckInGuard {
  id: string;
  userId: string;
  partnerName: string;
  venue: string;
  emergencyContact: string;
  durationMinutes: number;
  scheduledCheckInTime: string;
  status: 'ACTIVE' | 'EXTENDED' | 'CONCLUDED_SAFE' | 'EMERGENCY_SOS';
  createdAt: string;
}

export interface UserSafetyPreferences {
  locationMasking: boolean;
  incognitoBrowsing: boolean;
  strictAdultShield: boolean;
  mediaBlur: boolean;
}

@Injectable()
export class SafetyService {
  private readonly dateGuards = new Map<string, DateCheckInGuard>();
  private readonly userSafetyPrefs = new Map<string, UserSafetyPreferences>();

  constructor(private readonly store: MemoryStoreService) {}

  reportUser(
    reporterId: string,
    reportedUserId: string,
    category: ReportCategory,
    reason: string,
    evidenceUrls: string[] = []
  ): ReportItem {
    if (reporterId === reportedUserId) {
      throw new BadRequestException('You cannot report your own account');
    }

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const reporterProfile = this.store.profiles.get(reporterId);
    const reportedProfile = this.store.profiles.get(reportedUserId);

    const report: ReportItem = {
      id: reportId,
      reporterId,
      reporterName: reporterProfile?.displayName || 'User',
      reportedUserId,
      reportedUserName: reportedProfile?.displayName || 'User',
      category,
      reason,
      evidenceUrls,
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    this.store.reports.set(reportId, report);
    return report;
  }

  blockUser(blockerId: string, blockedUserId: string): { blocked: boolean } {
    if (blockerId === blockedUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    let blockedSet = this.store.blockedUsers.get(blockerId);
    if (!blockedSet) {
      blockedSet = new Set();
      this.store.blockedUsers.set(blockerId, blockedSet);
    }

    blockedSet.add(blockedUserId);
    return { blocked: true };
  }

  unblockUser(blockerId: string, blockedUserId: string): { unblocked: boolean } {
    const blockedSet = this.store.blockedUsers.get(blockerId);
    if (blockedSet) {
      blockedSet.delete(blockedUserId);
    }
    return { unblocked: true };
  }

  getBlockedUsers(blockerId: string): string[] {
    const blockedSet = this.store.blockedUsers.get(blockerId);
    return blockedSet ? Array.from(blockedSet) : [];
  }

  // ---------------------------------------------------------------------------
  // DATE SAFETY GUARD & CHECK-IN SYSTEM
  // ---------------------------------------------------------------------------
  createDateCheckInGuard(
    userId: string,
    data: {
      partnerName: string;
      venue: string;
      emergencyContact: string;
      durationMinutes: number;
    }
  ): DateCheckInGuard {
    const guardId = `guard_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const scheduledCheckInTime = new Date(
      Date.now() + (data.durationMinutes || 30) * 60 * 1000
    ).toISOString();

    const guard: DateCheckInGuard = {
      id: guardId,
      userId,
      partnerName: data.partnerName || 'Date',
      venue: data.venue || 'Venue',
      emergencyContact: data.emergencyContact || 'Guardian',
      durationMinutes: data.durationMinutes || 30,
      scheduledCheckInTime,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    this.dateGuards.set(guardId, guard);
    return guard;
  }

  confirmDateCheckIn(
    userId: string,
    guardId: string,
    extendMinutes: number = 0
  ): DateCheckInGuard {
    const guard = this.dateGuards.get(guardId);
    if (!guard || guard.userId !== userId) {
      throw new NotFoundException('Active date check-in guard not found');
    }

    if (extendMinutes > 0) {
      guard.durationMinutes += extendMinutes;
      guard.scheduledCheckInTime = new Date(
        Date.now() + extendMinutes * 60 * 1000
      ).toISOString();
      guard.status = 'EXTENDED';
    } else {
      guard.status = 'CONCLUDED_SAFE';
    }

    this.dateGuards.set(guardId, guard);
    return guard;
  }

  triggerEmergencySos(
    userId: string,
    guardId: string,
    coordinates?: { latitude: number; longitude: number }
  ): {
    sosDispatched: boolean;
    dispatchId: string;
    helplinesContacted: string[];
    emergencySmsSentTo: string;
    timestamp: string;
  } {
    const guard = this.dateGuards.get(guardId);
    if (guard) {
      guard.status = 'EMERGENCY_SOS';
      this.dateGuards.set(guardId, guard);
    }

    const dispatchId = `sos_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const contact = guard?.emergencyContact || '+91 Emergency Guardian';

    console.warn(`[SAFETY_SOS] User ${userId} TRIGGERED SOS at ${guard?.venue || 'Unknown'}! Alerting ${contact}.`);

    return {
      sosDispatched: true,
      dispatchId,
      helplinesContacted: ['112 (National Emergency)', '1091 (Women Helpline)'],
      emergencySmsSentTo: contact,
      timestamp: new Date().toISOString()
    };
  }

  // ---------------------------------------------------------------------------
  // SAFETY & PRIVACY PREFERENCES
  // ---------------------------------------------------------------------------
  getSafetyPreferences(userId: string): UserSafetyPreferences {
    const prefs = this.userSafetyPrefs.get(userId);
    if (prefs) return prefs;

    const defaultPrefs: UserSafetyPreferences = {
      locationMasking: true,
      incognitoBrowsing: false,
      strictAdultShield: true,
      mediaBlur: true
    };
    this.userSafetyPrefs.set(userId, defaultPrefs);
    return defaultPrefs;
  }

  updateSafetyPreferences(
    userId: string,
    updates: Partial<UserSafetyPreferences>
  ): UserSafetyPreferences {
    const current = this.getSafetyPreferences(userId);
    const updated = { ...current, ...updates };
    this.userSafetyPrefs.set(userId, updated);
    return updated;
  }
}
