export enum VoiceRoomRole {
  HOST = 'HOST',
  MODERATOR = 'MODERATOR',
  SPEAKER = 'SPEAKER',
  LISTENER = 'LISTENER'
}

export interface VoiceRoomMember {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: VoiceRoomRole;
  isMuted: boolean;
  hasRaisedHand: boolean;
  joinedAt: Date | string;
}

export interface VoiceRoom {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  emoji: string;
  hostId: string;
  hostName: string;
  isPrivate: boolean;
  capacity: number;
  activeCount: number;
  speakers: VoiceRoomMember[];
  listeners: VoiceRoomMember[];
  createdAt: Date | string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  memberCount: number;
  isJoined?: boolean;
  coverImageUrl?: string | null;
  rules: string[];
  createdAt: Date | string;
}
