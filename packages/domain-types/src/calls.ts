export enum CallType {
  VOICE = 'VOICE',
  VIDEO = 'VIDEO'
}

export enum CallStatus {
  INITIATED = 'INITIATED',
  RINGING = 'RINGING',
  CONNECTED = 'CONNECTED',
  DECLINED = 'DECLINED',
  MISSED = 'MISSED',
  ENDED = 'ENDED',
  FAILED = 'FAILED'
}

export interface CallParticipant {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  hasAudio: boolean;
  hasVideo: boolean;
  isMuted: boolean;
}

export interface CallSession {
  id: string;
  callerId: string;
  receiverId: string;
  type: CallType;
  status: CallStatus;
  startedAt?: Date | string | null;
  endedAt?: Date | string | null;
  durationSeconds: number;
  livekitRoomName?: string;
  token?: string;
}

export interface CallInviteEvent {
  callId: string;
  caller: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  type: CallType;
}
