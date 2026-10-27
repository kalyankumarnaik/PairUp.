export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
  SUPPORT = 'SUPPORT',
  VERIFIER = 'VERIFIER',
  ANALYST = 'ANALYST'
}

export enum AdminPermission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_MODERATION = 'MANAGE_MODERATION',
  MANAGE_VERIFICATION = 'MANAGE_VERIFICATION',
  MANAGE_CATEGORIES = 'MANAGE_CATEGORIES',
  MANAGE_SUBSCRIPTIONS = 'MANAGE_SUBSCRIPTIONS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG'
}

export interface AdminDashboardMetrics {
  totalRegisteredUsers: number;
  newRegistrationsToday: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  activeMatches: number;
  totalMessagesToday: number;
  pendingReportsCount: number;
  pendingVerificationsCount: number;
  activeVoiceRooms: number;
  activeEventsCount: number;
  subscriptionRevenueMonthly: number;
  apiHealthPercent: number;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetEntity: string;
  targetId: string;
  detailsJson?: string | null;
  ipAddress?: string | null;
  createdAt: Date | string;
}
