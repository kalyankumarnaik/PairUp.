export enum ReportReason {
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM_OR_SCAM = 'SPAM_OR_SCAM',
  IMPERSONATION = 'IMPERSONATION',
  UNDERAGE = 'UNDERAGE',
  OTHER = 'OTHER',
}

export interface ReportUserInput {
  reporterUserId: string;
  reportedUserId: string;
  reason: ReportReason;
  description?: string;
  evidencePhotoUrls?: string[];
}

export interface ReportResult {
  reportId: string;
  status: 'PENDING_REVIEW' | 'AUTO_RESOLVED' | 'ESCALATED';
  autoActionTaken?: string;
}

export interface IModerationService {
  /**
   * Used by Member 4 (AI Content Moderation & Safety) to ingest user safety reports,
   * run automated NLP/Vision screening, and take proactive actions.
   */
  processReport(input: ReportUserInput): Promise<ReportResult>;
}

export const MODERATION_SERVICE_TOKEN = 'IModerationService';
