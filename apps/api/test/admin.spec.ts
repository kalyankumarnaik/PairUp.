import { describe, expect, it, beforeEach } from 'vitest';
import { AdminService } from '../src/modules/admin/admin.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { AccountStatus, ModerationActionType, ReportCategory, UserRole } from '@pairup/domain-types';

describe('AdminService & Safety Moderation', () => {
  let adminService: AdminService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    adminService = new AdminService(store);
  });

  it('aggregates dashboard telemetry metrics', () => {
    const metrics = adminService.getMetrics();
    expect(metrics.totalRegisteredUsers).toBeGreaterThan(0);
    expect(metrics.apiHealthPercent).toBe(99.98);
  });

  it('suspends a user account and records an audit log', () => {
    const res = adminService.updateUserStatus(
      'usr_admin_master',
      'usr_demo_3',
      AccountStatus.SUSPENDED,
      'Violation of community safety guidelines'
    );
    expect(res.updated).toBe(true);

    const user = store.users.get('usr_demo_3');
    expect(user?.status).toBe(AccountStatus.SUSPENDED);

    const logs = adminService.getAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toContain('SUSPENDED');
  });

  it('resolves moderation reports with disciplinary ban', () => {
    // File test report
    const reportId = 'rep_test_1';
    store.reports.set(reportId, {
      id: reportId,
      reporterId: 'usr_demo_1',
      reportedUserId: 'usr_demo_4',
      category: ReportCategory.HARASSMENT,
      reason: 'Unacceptable language in voice room',
      evidenceUrls: [],
      status: 'PENDING' as any,
      createdAt: new Date().toISOString()
    });

    const res = adminService.resolveReport(
      'usr_admin_master',
      reportId,
      ModerationActionType.PERMANENT_BAN,
      'Confirmed violation. Banned account.'
    );

    expect(res.resolved).toBe(true);
    const bannedUser = store.users.get('usr_demo_4');
    expect(bannedUser?.status).toBe(AccountStatus.SUSPENDED);
  });
});
