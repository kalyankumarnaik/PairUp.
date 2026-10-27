/**
 * Inter-Module Interface for Member 3 (Real-time Messaging & WebSockets)
 * Provided by Member 1 (Platform Architecture & Core Backend Lead)
 */

import { UUID } from './shared-types';

export interface ChatAuthorizationTokenPayload {
  userId: UUID;
  sessionId: UUID;
  role: string;
}

export interface IChatSecurityProvider {
  /**
   * Called by Member 3's WebSocket gateway before establishing or routing a chat connection.
   * Verifies that userA and userB have an ACTIVE match, neither is blocked,
   * and neither account is suspended or deactivated.
   */
  canUsersCommunicate(
    userAId: UUID,
    userBId: UUID,
  ): Promise<{
    canCommunicate: boolean;
    matchId?: UUID;
    reason?: 'ACTIVE_MATCH' | 'NO_MATCH' | 'MATCH_UNMATCHED' | 'USER_BLOCKED' | 'USER_INACTIVE';
  }>;

  /**
   * Validates JWT token from WebSocket handshake headers or query.
   */
  validateSocketToken(token: string): Promise<ChatAuthorizationTokenPayload | null>;
}
