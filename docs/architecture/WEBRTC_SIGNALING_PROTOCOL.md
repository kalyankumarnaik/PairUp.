# PairUp Real-Time WebRTC Audio & Video Protocol Specification

This document details the signaling architecture, NAT traversal protocol, media stream constraints, and Quality of Service (QoS) telemetry powering **PairUp's** voice and video calling infrastructure.

---

## 1. Protocol Architecture & Overview

PairUp implements end-to-end peer-to-peer audio and video communication with server-assisted signaling, STUN/TURN NAT traversal, and automatic fallback to media relays for strict symmetric NAT topologies.

```
       +-------------+                     +-------------+
       |   Peer A    |                     |   Peer B    |
       |  (Caller)   |                     |  (Callee)   |
       +------+------+                     +------+------+
              |                                   |
              | 1. POST /calls/initiate (SDP)     |
              |---------------------------------->| (Push / Socket Notification)
              |                                   |
              | 2. Obtain Ephemeral TURN Creds    | 2. Obtain Ephemeral TURN Creds
              |    (RFC 5766 HMAC-SHA1)           |    (RFC 5766 HMAC-SHA1)
              |                                   |
              |                                   | 3. POST /calls/:id/respond (Accept + SDP Answer)
              |<----------------------------------|
              |                                   |
              | 4. Trickle ICE Candidates Exchange|
              |<=================================>|
              |                                   |
              | 5. Direct P2P SRTP Audio/Video    |
              |<=================================>|
              |                                   |
              | (Or via Coturn Media Relay)       |
              |<------+                   +------>|
                      |                   |
                      +--->[ TURN Relay ]<+
```

---

## 2. Signaling State Machine

Calls progress through explicit lifecycle states:

```
[INITIATED] ---> [RINGING] ---> [CONNECTED] ---> [ENDED]
                    |                 |
                    +--> [DECLINED]   +--> [FAILED / DROPPED]
                    |
                    +--> [MISSED] (30s timeout)
```

### 2.1 State Definitions
- **INITIATED**: Call session created in backend database; caller prepares SDP Offer and requests ephemeral TURN credentials.
- **RINGING**: Callee alerted via VoIP push notification (APNs/FCM) and authenticated WebSocket channel.
- **CONNECTED**: Callee accepted invitation; SDP Answer generated and exchanged; ICE connectivity check succeeded; media flowing.
- **DECLINED**: Callee explicitly declined or dismissed the incoming call notification.
- **MISSED**: Ringing timed out after 30 seconds with no answer.
- **ENDED**: Either party hung up; call duration audited and logged.

---

## 3. Ephemeral TURN / STUN Credential Generation (RFC 5766)

To prevent unauthorized relay bandwidth theft while ensuring seamless connection through corporate firewalls and Indian carrier CGNATs (Carrier-Grade NATs), TURN credentials are mathematically derived using HMAC-SHA1 with time-to-live (TTL) expiration:

```typescript
export function generateTurnCredentials(userId: string, ttlSeconds: number = 86400) {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const username = `${expiry}:${userId}`;
  const secret = process.env.TURN_SECRET || 'pairup_turn_production_shared_secret_2026';

  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(username);
  const credential = hmac.digest('base64');

  return {
    urls: [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'turn:turn.pairup.internal:3478?transport=udp',
      'turn:turn.pairup.internal:3478?transport=tcp',
      'turns:turn.pairup.internal:5349?transport=tcp'
    ],
    username,
    credential,
    ttlSeconds
  };
}
```

---

## 4. Media Stream & Codec Specifications

### 4.1 Audio Media Constraints
- **Primary Codec**: Opus (RFC 6716)
- **Sampling Rate**: 48,000 Hz (Fullband)
- **Channels**: 2 (Stereo) with dynamic fallback to mono on cellular networks
- **Bitrate Range**: 24 kbps to 64 kbps (dynamic adaptation based on packet loss)
- **Echo Cancellation (AEC)**: Enabled
- **Noise Suppression (ANS)**: High (suppresses ambient Indian street/traffic noise)
- **Automatic Gain Control (AGC)**: Enabled

### 4.2 Video Media Constraints
- **Codecs**: VP8, H.264 (Constrained Baseline Profile)
- **Standard Quality**: 720p (1280x720) @ 30 fps, target bitrate 1.2 Mbps
- **Low-Bandwidth Fallback**: 360p (640x360) @ 24 fps, target bitrate 400 kbps
- **Simulcast**: Supported on desktop web clients to broadcast high/medium/low quality layers

---

## 5. Quality of Service (QoS) & Telemetry Metrics

PairUp clients collect and report WebRTC `RTCStatsReport` metrics every 15 seconds during active calls via `POST /api/v1/calls/:id/quality`:

| Metric | Target Optimal | Acceptable Threshold | Degradation Action |
|---|---|---|---|
| **Round Trip Time (RTT)** | $< 80\text{ ms}$ | $< 250\text{ ms}$ | Downscale video resolution |
| **Packet Loss Rate** | $< 1\%$ | $< 5\%$ | Reduce audio bitrate, enable FEC |
| **Jitter Buffer Delay** | $< 20\text{ ms}$ | $< 60\text{ ms}$ | Increase jitter buffer depth |
| **Mean Opinion Score (MOS)** | $> 4.2$ | $> 3.5$ | If $< 2.8$, display network toast |

### Formula for R-Factor & Mean Opinion Score (MOS)
Using the simplified ITU-T E-Model:
$$R = 94.2 - 0.024 d - 0.11(d - 177) \cdot \mathcal{H}(d - 177) - 11 - 40 \log(1 + 10 e)$$
where $d$ is one-way delay (ms) and $e$ is total packet loss fraction.
The Mean Opinion Score (MOS) is then:
$$\text{MOS} = 1 + 0.035 R + R(R - 60)(100 - R) \cdot 7 \times 10^{-6}$$
Clamped strictly between $1.0$ (bad) and $5.0$ (excellent).
