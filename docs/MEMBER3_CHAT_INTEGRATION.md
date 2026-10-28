# Member 3 Integration Guide — Real-Time Messaging, WebSockets & Calls

**Author:** Member 1 (Platform Technical Lead)  
**Target:** Member 3 (Messaging & WebSockets Lead)  
**Scope:** WebSocket Gateway Auth, Match Permission Verifications, Shared Conversation Schema Standards.

---

## 1. Architectural Responsibility & Boundaries

- **Member 1 (Core Backend):** Owns user identity, authentication tokens, match state (`ACTIVE`, `UNMATCHED`, `BLOCKED`), and block lists.
- **Member 3 (You):** Owns WebSocket connections, message persistence, real-time message delivery, typing indicators, read receipts, and WebRTC signaling.

---

## 2. WebSocket Connection Authorization Handshake

Clients connecting to your WebSocket Gateway (e.g. `wss://api.pairup.com/chat`) will pass their JWT access token in the query parameter or headers:
```typescript
const socket = io('wss://api.pairup.com/chat', {
  auth: {
    token: accessToken, // Issued by POST /api/v1/auth/login
  },
});
```

To validate the token in NestJS, use the `JwtService` with the shared secret `JWT_ACCESS_SECRET` or inject `MatchesService`:

```typescript
import { IMatchPermissionService, MATCH_PERMISSION_SERVICE_TOKEN } from '../matches/contracts/match-permission.interface';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    @Inject(MATCH_PERMISSION_SERVICE_TOKEN)
    private readonly matchPermissionService: IMatchPermissionService,
  ) {}
}
```

---

## 3. Communication Authorization Check (`canUsersCommunicate`)

Before allowing User A to send a message or start an audio/video call with User B, call:

```typescript
const permission = await this.matchPermissionService.canUsersCommunicate(userAId, userBId);

if (!permission.canCommunicate) {
  // Reject socket emission:
  // permission.reason can be: 'USER_BLOCKED' | 'USER_INACTIVE' | 'NO_MATCH' | 'MATCH_UNMATCHED'
  socket.emit('error', { code: permission.reason, message: 'Cannot message this user.' });
  return;
}

// Proceed: permission.matchId contains the verified active Match UUID
```

### Safety Guarantees Provided by Member 1
1. **Instant Block Enforcement:** If User A blocks User B via `POST /api/v1/users/:id/block`, the match status is immediately set to `BLOCKED`. Subsequent calls to `canUsersCommunicate` return `{ canCommunicate: false, reason: 'USER_BLOCKED' }`.
2. **Instant Unmatch Enforcement:** If User A unmatches User B via `DELETE /api/v1/matches/:id`, the match status is immediately set to `UNMATCHED`. Subsequent calls return `{ canCommunicate: false, reason: 'MATCH_UNMATCHED' }`.

---

## 4. Shared Database Schema & Migration Guidelines

To avoid schema collisions with Member 1's migrations, follow these conventions:

### Reserved Table Names for Member 3
- `conversations`: Join table between `matchId` and conversation metadata.
- `messages`: Message payloads (`id`, `conversationId`, `senderId`, `content`, `type`, `readAt`, `createdAt`).
- `call_sessions`: Audio/video signaling records.

### Reference Rules
- Link `conversations.matchId` to `matches.id` with `ON DELETE CASCADE`.
- Link `messages.senderId` to `users.id` with `ON DELETE CASCADE`.
- Keep migration files in `prisma/migrations/` prefixed with timestamps or coordinated via PRs.
