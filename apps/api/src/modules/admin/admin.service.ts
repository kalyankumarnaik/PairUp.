import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountStatus,
  AdminDashboardMetrics,
  AuditLogItem,
  ModerationActionType,
  ReportItem,
  ReportStatus
} from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class AdminService {
  constructor(private readonly store: MemoryStoreService) {}

  getMetrics(): AdminDashboardMetrics {
    const totalUsers = this.store.users.size;
    const activeMatches = Array.from(this.store.matches.values()).filter(
      (m) => m.status === 'ACTIVE'
    ).length;

    let totalMessages = 0;
    for (const msgs of this.store.messages.values()) {
      totalMessages += msgs.length;
    }

    const pendingReports = Array.from(this.store.reports.values()).filter(
      (r) => r.status === ReportStatus.PENDING
    ).length;

    return {
      totalRegisteredUsers: totalUsers,
      newRegistrationsToday: 8,
      dailyActiveUsers: Math.max(12, totalUsers - 2),
      monthlyActiveUsers: totalUsers,
      activeMatches,
      totalMessagesToday: totalMessages,
      pendingReportsCount: pendingReports,
      pendingVerificationsCount: 3,
      activeVoiceRooms: this.store.rooms.size,
      activeEventsCount: this.store.events.size,
      subscriptionRevenueMonthly: 48900, // INR
      apiHealthPercent: 99.98
    };
  }

  getUsersList(): any[] {
    const list: any[] = [];
    for (const [id, user] of this.store.users.entries()) {
      const profile = this.store.profiles.get(id);
      list.push({
        id: user.id,
        email: user.email,
        phone: user.phone,
        displayName: profile?.displayName || 'Unknown',
        role: user.role,
        status: user.status,
        isAdultVerified: user.isAdultVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      });
    }
    return list;
  }

  updateUserStatus(
    adminId: string,
    targetUserId: string,
    status: AccountStatus,
    reason: string
  ): { updated: boolean } {
    const user = this.store.users.get(targetUserId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = status;
    this.store.users.set(targetUserId, user);

    this.recordAuditLog(
      adminId,
      `STATUS_CHANGE_TO_${status}`,
      'USER',
      targetUserId,
      JSON.stringify({ reason })
    );

    return { updated: true };
  }

  getReports(): ReportItem[] {
    return Array.from(this.store.reports.values());
  }

  resolveReport(
    adminId: string,
    reportId: string,
    action: ModerationActionType,
    moderatorNotes: string
  ): { resolved: boolean } {
    const report = this.store.reports.get(reportId);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = ReportStatus.RESOLVED;
    this.store.reports.set(reportId, report);

    // Apply action on reported user if suspension or ban
    if (
      action === ModerationActionType.PERMANENT_BAN ||
      action === ModerationActionType.TEMPORARY_SUSPENSION
    ) {
      const reportedUser = this.store.users.get(report.reportedUserId);
      if (reportedUser) {
        reportedUser.status = AccountStatus.SUSPENDED;
        this.store.users.set(report.reportedUserId, reportedUser);
      }
    }

    this.recordAuditLog(
      adminId,
      `RESOLVE_REPORT_${action}`,
      'REPORT',
      reportId,
      JSON.stringify({ notes: moderatorNotes, targetUserId: report.reportedUserId })
    );

    return { resolved: true };
  }

  getAuditLogs(): AuditLogItem[] {
    return this.store.auditLogs.slice(-50).reverse();
  }

  private recordAuditLog(
    adminId: string,
    action: string,
    targetEntity: string,
    targetId: string,
    detailsJson: string
  ) {
    const logItem: AuditLogItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminId,
      adminEmail: 'admin@pairup.ai',
      action,
      targetEntity,
      targetId,
      detailsJson,
      createdAt: new Date().toISOString()
    };
    this.store.auditLogs.push(logItem);
  }
}
