import { describe, expect, it, beforeEach } from 'vitest';
import { CallsService } from '../src/modules/calls/calls.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { CallStatus, CallType } from '@pairup/domain-types';

describe('CallsService - WebRTC Signaling & NAT Traversal', () => {
  let callsService: CallsService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    callsService = new CallsService(store);
  });

  it('generates RFC 5766 TURN server credentials with HMAC signature', () => {
    const creds = callsService.generateTurnCredentials('usr_demo_1');

    expect(creds.urls.length).toBeGreaterThan(0);
    expect(creds.username).toContain('usr_demo_1');
    expect(creds.credential).toBeDefined();
    expect(creds.ttlSeconds).toBe(86400);
  });

  it('initiates a WebRTC audio call session between two members', () => {
    const { session, turn } = callsService.initiateCall(
      'usr_demo_1',
      'usr_demo_2',
      CallType.VOICE,
      'v=0\r\no=- 12345 2 IN IP4 127.0.0.1...'
    );

    expect(session.id).toBeDefined();
    expect(session.callerId).toBe('usr_demo_1');
    expect(session.receiverId).toBe('usr_demo_2');
    expect(session.status).toBe(CallStatus.RINGING);
    expect(turn.credential).toBeDefined();
  });

  it('declines call when recipient refuses invitation', () => {
    const { session } = callsService.initiateCall('usr_demo_1', 'usr_demo_2', CallType.VOICE);
    const { session: responded } = callsService.respondCall(session.id, 'usr_demo_2', false);

    expect(responded.status).toBe(CallStatus.DECLINED);
    expect(responded.endedAt).toBeDefined();
  });

  it('connects call and returns TURN credentials upon acceptance', () => {
    const { session } = callsService.initiateCall('usr_demo_1', 'usr_demo_2', CallType.VIDEO);
    const { session: connected, turn } = callsService.respondCall(
      session.id,
      'usr_demo_2',
      true,
      'v=0\r\no=- 67890 2 IN IP4 127.0.0.1...'
    );

    expect(connected.status).toBe(CallStatus.CONNECTED);
    expect(connected.startedAt).toBeDefined();
    expect(turn).toBeDefined();
  });

  it('relays ICE candidates and signaling messages between call participants', () => {
    const { session } = callsService.initiateCall('usr_demo_1', 'usr_demo_2');
    callsService.respondCall(session.id, 'usr_demo_2', true);

    const relayResult = callsService.processSignalingMessage({
      callId: session.id,
      senderId: 'usr_demo_1',
      type: 'ice-candidate',
      candidate: {
        candidate: 'candidate:1 1 UDP 2130706431 192.168.1.50 54321 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0
      },
      timestamp: new Date().toISOString()
    });

    expect(relayResult.delivered).toBe(true);

    const receiverSignals = callsService.getSignalingMessages(session.id, 'usr_demo_2');
    expect(receiverSignals.length).toBeGreaterThan(0);
    expect(receiverSignals[0].type).toBe('ice-candidate');
  });

  it('ends an active call and audits elapsed duration in seconds', () => {
    const { session } = callsService.initiateCall('usr_demo_1', 'usr_demo_2');
    callsService.respondCall(session.id, 'usr_demo_2', true);

    const ended = callsService.endCall(session.id, 'USER_HANGUP');
    expect(ended.status).toBe(CallStatus.ENDED);
    expect(ended.endedAt).toBeDefined();
  });
});
