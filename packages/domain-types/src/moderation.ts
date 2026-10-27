export enum ReportCategory {
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  FAKE_PROFILE = 'FAKE_PROFILE',
  UNDERAGE = 'UNDERAGE',
  OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE',
  SCAM = 'SCAM'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export enum ModerationActionType {
  WARNING = 'WARNING',
  CONTENT_REMOVED = 'CONTENT_REMOVED',
  SHADOWBAN = 'SHADOWBAN',
  TEMPORARY_SUSPENSION = 'TEMPORARY_SUSPENSION',
  PERMANENT_BAN = 'PERMANENT_BAN'
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedUserId: string;
  reportedUserName?: string;
  category: ReportCategory;
  reason: string;
  evidenceUrls: string[];
  status: ReportStatus;
  createdAt: Date | string;
}

export interface ModerationCase {
  id: string;
  reportId: string;
  assignedModeratorId?: string | null;
  assignedModeratorName?: string | null;
  actionTaken?: ModerationActionType | null;
  moderatorNotes?: string | null;
  resolvedAt?: Date | string | null;
  createdAt: Date | string;
}

export interface BlockUserRecord {
  id: string;
  blockerId: string;
  blockedUserId: string;
  blockedUserName?: string;
  createdAt: Date | string;
}
