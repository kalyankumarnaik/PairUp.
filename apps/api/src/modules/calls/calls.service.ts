import { Injectable, NotFoundException } from '@nestjs/common';
import { CallSession, CallStatus, CallType } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class CallsService {
  private activeCalls: Map<string, CallSession> = new Map();

  constructor(private readonly store: MemoryStoreService) {}

  initiateCall(callerId: string, receiverId: string, type: CallType = CallType.VOICE): CallSession {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

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
      token: `dev_webrtc_token_${callId}_${callerId}`
    };

    this.activeCalls.set(callId, session);
    return session;
  }

  respondCall(callId: string, userId: string, accept: boolean): CallSession {
    const session = this.activeCalls.get(callId);
    if (!session) {
      throw new NotFoundException('Call session not found');
    }

    if (accept) {
      session.status = CallStatus.CONNECTED;
      session.startedAt = new Date().toISOString();
      session.token = `dev_webrtc_token_${callId}_${userId}`;
    } else {
      session.status = CallStatus.DECLINED;
      session.endedAt = new Date().toISOString();
    }

    this.activeCalls.set(callId, session);
    return session;
  }

  endCall(callId: string): CallSession {
    const session = this.activeCalls.get(callId);
    if (!session) {
      throw new NotFoundException('Call session not found');
    }

    session.status = CallStatus.ENDED;
    session.endedAt = new Date().toISOString();
    if (session.startedAt) {
      const diff = Math.floor(
        (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
      );
      session.durationSeconds = Math.max(0, diff);
    }

    this.activeCalls.set(callId, session);
    return session;
  }
}
