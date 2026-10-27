import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReportCategory, ReportItem, ReportStatus } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class SafetyService {
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
}
