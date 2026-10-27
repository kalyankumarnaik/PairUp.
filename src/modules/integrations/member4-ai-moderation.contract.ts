/**
 * Inter-Module Interface for Member 4 (AI Recommendations & Content Moderation)
 * Provided by Member 1 (Platform Architecture & Core Backend Lead)
 */

import { UUID } from './shared-types';

export interface CandidateScoringRequest {
  requesterUserId: UUID;
  candidateUserIds: UUID[];
  context?: {
    location?: { latitude: number; longitude: number };
    currentIntent?: string;
  };
}

export interface CandidateScoringResult {
  userId: UUID;
  compatibilityScore: number; // 0.0 to 1.0
  reasons: string[];
}

export interface ModerationInspectionPayload {
  contentType: 'PROFILE_TEXT' | 'PHOTO' | 'CHAT_MESSAGE';
  contentUrlOrText: string;
  authorUserId: UUID;
  contextMetadata?: Record<string, unknown>;
}

export interface ModerationInspectionResult {
  isFlagged: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categories: string[]; // e.g. ['HARASSMENT', 'NUDITY', 'SCAM']
  recommendedAction: 'ALLOW' | 'FLAG_FOR_REVIEW' | 'AUTO_BLUR' | 'SUSPEND_ACCOUNT';
}

export interface IAIRecommendationAndModerationPlugin {
  /**
   * Member 4 implements this method to re-rank discovery candidates
   * using embedding similarity and preference vectors.
   */
  rankCandidates(request: CandidateScoringRequest): Promise<CandidateScoringResult[]>;

  /**
   * Member 4 implements this method to inspect user-generated media and text.
   */
  inspectContent(payload: ModerationInspectionPayload): Promise<ModerationInspectionResult>;
}
