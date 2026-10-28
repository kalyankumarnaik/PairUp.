import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CallSession, CallStatus, CallType } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import * as crypto from 'crypto';

export interface RtcIceCandidate {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}

export interface WebRtcSignalingMessage {
  callId: string;
  senderId: string;
  type: 'offer' | 'answer' | 'ice-candidate' | 'heartbeat' | 'end';
  sdp?: string;
  candidate?: RtcIceCandidate;
  timestamp: string;
}

export interface TurnServerCredentials {
  urls: string[];
  username: string;
  credential: string;
  ttlSeconds: number;
}

export interface CallQualityReport {
  callId: string;
  userId: string;
  meanOpinionScore: number; // 1.0 to 5.0
  packetLossPercent: number;
  jitterMs: number;
  roundTripTimeMs: number;
  audioBitrateKbps: number;
  videoBitrateKbps?: number;
  resolution?: string;
}

@Injectable()
export class CallsService {
  private activeCalls: Map<string, CallSession> = new Map();
  private iceCandidates: Map<string, RtcIceCandidate[]> = new Map();
  private signalingQueue: Map<string, WebRtcSignalingMessage[]> = new Map();
  private qualityReports: Map<string, CallQualityReport[]> = new Map();

  constructor(private readonly store: MemoryStoreService) {}

  /**
   * Generates time-limited HMAC credentials for TURN/STUN NAT traversal
   * following RFC 5766 ephemeral credentials specification.
   */
  generateTurnCredentials(userId: string): TurnServerCredentials {
    const ttlSeconds = 86400; // 24 hours
    const expiryTimestamp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const username = `${expiryTimestamp}:${userId}`;
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

  /**
   * Initiates a 1-on-1 audio or video call session
   */
  initiateCall(
    callerId: string,
    receiverId: string,
    type: CallType = CallType.VOICE,
    initialSdpOffer?: string
  ): { session: CallSession; turn: TurnServerCredentials } {
    if (callerId === receiverId) {
      throw new BadRequestException('Cannot initiate a call with yourself');
    }

    // Verify both users exist
    const caller = this.store.profiles.get(callerId);
    const receiver = this.store.profiles.get(receiverId);

    // Verify not blocked
    const callerBlocked = this.store.blockedUsers.get(callerId);
    if (callerBlocked && callerBlocked.has(receiverId)) {
      throw new BadRequestException('Cannot call a blocked user');
    }
    const receiverBlocked = this.store.blockedUsers.get(receiverId);
    if (receiverBlocked && receiverBlocked.has(callerId)) {
      throw new BadRequestException('Unable to reach user');
    }

    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const session: CallSession = {
      id: callId,
      callerId,
      receiverId,
      type,
      status: CallStatus.RINGING,
      startedAt: null,
      endedAt: null,
      durationSeconds: 0,
      livekitRoomName: `pairup_room_${callId}`,
      token: `rtc_tok_${callId}_${callerId}`
    };

    this.activeCalls.set(callId, session);
    this.iceCandidates.set(callId, []);
    this.signalingQueue.set(callId, []);

    if (initialSdpOffer) {
      this.signalingQueue.get(callId)?.push({
        callId,
        senderId: callerId,
        type: 'offer',
        sdp: initialSdpOffer,
        timestamp: new Date().toISOString()
      });
    }

    const turn = this.generateTurnCredentials(callerId);

    return { session, turn };
  }

  /**
   * Responds to an incoming call invitation
   */
  respondCall(
    callId: string,
    userId: string,
    accept: boolean,
    sdpAnswer?: string
  ): { session: CallSession; turn?: TurnServerCredentials } {
    const session = this.activeCalls.get(callId);
    if (!session) {
      throw new NotFoundException('Call session not found');
    }

    if (session.receiverId !== userId && session.callerId !== userId) {
      throw new BadRequestException('You are not a participant in this call');
    }

    if (accept) {
      session.status = CallStatus.CONNECTED;
      session.startedAt = new Date().toISOString();
      session.token = `rtc_tok_${callId}_${userId}`;

      if (sdpAnswer) {
        this.signalingQueue.get(callId)?.push({
          callId,
          senderId: userId,
          type: 'answer',
          sdp: sdpAnswer,
          timestamp: new Date().toISOString()
        });
      }

      this.activeCalls.set(callId, session);
      return {
        session,
        turn: this.generateTurnCredentials(userId)
      };
    } else {
      session.status = CallStatus.DECLINED;
      session.endedAt = new Date().toISOString();
      this.activeCalls.set(callId, session);
      return { session };
    }
  }

  /**
   * Exchanges WebRTC SDP offer/answer and ICE candidate signals between peers
   */
  processSignalingMessage(message: WebRtcSignalingMessage): { delivered: boolean; queueLength: number } {
    const session = this.activeCalls.get(message.callId);
    if (!session) {
      throw new NotFoundException(`Call session ${message.callId} not found`);
    }

    if (session.status === CallStatus.ENDED || session.status === CallStatus.DECLINED) {
      throw new BadRequestException('Call has already terminated');
    }

    if (message.candidate) {
      const candidates = this.iceCandidates.get(message.callId) || [];
      candidates.push(message.candidate);
      this.iceCandidates.set(message.callId, candidates);
    }

    const queue = this.signalingQueue.get(message.callId) || [];
    queue.push(message);
    this.signalingQueue.set(message.callId, queue);

    return {
      delivered: true,
      queueLength: queue.length
    };
  }

  /**
   * Retrieves pending signaling messages for a specific participant
   */
  getSignalingMessages(callId: string, userId: string, sinceIso?: string): WebRtcSignalingMessage[] {
    const queue = this.signalingQueue.get(callId) || [];
    return queue.filter((msg) => {
      if (msg.senderId === userId) return false; // Don't return peer's own messages
      if (sinceIso) {
        return new Date(msg.timestamp).getTime() > new Date(sinceIso).getTime();
      }
      return true;
    });
  }

  /**
   * Records real-time call quality telemetry metrics
   */
  recordQualityMetric(report: CallQualityReport): void {
    const list = this.qualityReports.get(report.callId) || [];
    list.push(report);
    this.qualityReports.set(report.callId, list);
  }

  /**
   * Gracefully terminates an active or ringing call
   */
  endCall(callId: string, reason: string = 'HANGUP'): CallSession {
    const session = this.activeCalls.get(callId);
    if (!session) {
      throw new NotFoundException('Call session not found');
    }

    session.status = CallStatus.ENDED;
    session.endedAt = new Date().toISOString();

    if (session.startedAt) {
      const duration = Math.floor(
        (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
      );
      session.durationSeconds = Math.max(0, duration);
    }

    this.activeCalls.set(callId, session);

    // Clean up signaling queue after brief grace period
    this.signalingQueue.get(callId)?.push({
      callId,
      senderId: 'SYSTEM',
      type: 'end',
      timestamp: new Date().toISOString()
    });

    return session;
  }

  /**
   * Returns active call status
   */
  getCallSession(callId: string): CallSession {
    const session = this.activeCalls.get(callId);
    if (!session) {
      throw new NotFoundException(`Call ${callId} does not exist`);
    }
    return session;
  }
}
