export interface MatchPermissionResult {
  canCommunicate: boolean;
  matchId?: string;
  reason?: 'ACTIVE_MATCH' | 'NO_MATCH' | 'MATCH_UNMATCHED' | 'USER_BLOCKED' | 'USER_INACTIVE';
}

export interface IMatchPermissionService {
  /**
   * Used by Member 3 (Real-time Messaging & WebSockets) to verify
   * that two users are currently authorized to exchange messages or make calls.
   */
  canUsersCommunicate(userAId: string, userBId: string): Promise<MatchPermissionResult>;
}

export const MATCH_PERMISSION_SERVICE_TOKEN = 'IMatchPermissionService';
