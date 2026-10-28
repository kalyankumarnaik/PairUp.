# PairUp Real-Time Messaging & WebSocket Infrastructure

This document outlines the high-concurrency WebSocket architecture, Redis Pub/Sub message broker topology, message delivery semantics, and media pipeline powering **PairUp's** real-time text chat, voice notes, audio rooms, and presence system.

---

## 1. High-Level System Architecture

PairUp utilizes a stateless horizontal gateway layer built on **NestJS WebSocket Gateways** (Socket.IO engine) backed by an enterprise **Redis Pub/Sub & Stream cluster** to broadcast events across distributed server pods.

```
       [ Client A (Web) ]       [ Client B (Mobile) ]     [ Client C (Mobile) ]
               |                         |                         |
               | (WSS / Socket.IO)       | (WSS / Socket.IO)       | (WSS / Socket.IO)
               v                         v                         v
     +-------------------+     +-------------------+     +-------------------+
     |   API Pod 1       |     |   API Pod 2       |     |   API Pod 3       |
     | (Gateway Node)    |     | (Gateway Node)    |     | (Gateway Node)    |
     +---------+---------+     +---------+---------+     +---------+---------+
               |                         |                         |
               +-------------------------+-------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |   Redis Pub/Sub & Streams     |
                         |  (Cluster: Presence & Chat)   |
                         +---------------+---------------+
                                         |
                                         v
                         +-------------------------------+
                         | PostgreSQL / PostGIS Database |
                         | (Persistent Message Archive)  |
                         +-------------------------------+
```

---

## 2. Authentication Handshake & Connection Protocol

All WebSocket connections require cryptographic verification during the initial HTTP upgrade handshake:

1. **Token Transport**: The client passes the JWT access token in the `auth: { token: '...' }` payload or `Authorization: Bearer <token>` header.
2. **Signature Verification**: Gateway verifies token authenticity, claims, and non-expiration using asymmetric RSA or HMAC keys.
3. **Account Status Check**: Suspended, deactivated, or banned accounts are immediately terminated with code `4403 (Forbidden)`.
4. **Room Subscriptions**: Upon connection, the socket automatically joins:
   - `user:{userId}` (Personal notification & presence channel)
   - `active_conversations:{userId}` (Channels for active 1-on-1 chats)

---

## 3. Message Delivery Semantics & Deduplication

To provide a flawless chat experience over mobile cellular connections with frequent handoffs, PairUp implements **at-least-once delivery with client-side deduplication**:

### 3.1 Message Flow & Optimistic UI
1. **Client Dispatches**: Client assigns a temporary UUID `clientMessageId`, optimistically appends the bubble to the UI with state `SENDING`, and emits `chat:send_message`.
2. **Server Ingestion**: Gateway checks for duplicate `clientMessageId` in Redis with a 60-second sliding TTL.
3. **Moderation Check**: Fast regex & AI filter scans text for phone numbers, solicitations, or hate speech.
4. **Database Persistence**: Message committed to PostgreSQL.
5. **Client Acknowledgement (ACK)**: Server returns ACK callback with official `messageId` and timestamp. Client transitions bubble to `SENT`.
6. **Recipient Fan-Out**: Gateway emits `chat:new_message` to recipient's personal room.

### 3.2 Read Receipts & Typing Indicators
- **Typing Cadence**: Emitted via `chat:typing` with a 3-second debounce. The server relays this without persistence to minimize database write load.
- **Read Receipts**: When a user views the active viewport, `chat:mark_read` updates `lastReadMessageId` and emits `chat:messages_read` to the sender, turning checkmarks purple.

---

## 4. Voice Note Audio Processing Pipeline

PairUp supports expressive voice notes with waveform visualization and dynamic playback scrubbing:

```
[ Mobile Mic ]
      |
      | 1. AAC / Opus Recording (16kHz - 44.1kHz)
      v
[ Local Audio Buffer ]
      |
      | 2. Extract 50 normalized amplitude peaks (0.0 to 1.0)
      v
[ Direct Upload ] ---> [ S3 Object Storage / MinIO ]
      |                         |
      | 3. Presigned URL PUT    v
      +------------------------>[ Transcode & CDN Distribution ]
                                        |
                                        v
                               [ Chat Message Payload ]
                               {
                                 type: 'VOICE',
                                 mediaUrl: 'https://cdn.pairup.internal/audio/vn_102.m4a',
                                 durationSeconds: 14,
                                 waveformData: [0.1, 0.4, 0.8, 0.9, 0.6, ...]
                               }
```

---

## 5. Live Voice Communities & Stage Architecture

Voice Rooms (`/rooms`) enable group audio conversations for interest-based bonding:

- **Stage Roles**:
  - **Host**: Room creator, can mute/unmute speakers, promote listeners, terminate room.
  - **Speakers**: Active mic privileges, up to 12 simultaneous speakers on stage.
  - **Listeners**: Passive audio stream subscribers, can click **Raise Hand ✋** to request speaker status.
- **Sound Wave Synchronization**: Active speaker sound ripple rings are animated using real-time volume meter telemetry packets (`room:speaking_meter`) broadcast at 100ms intervals.
