export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE_NOTE = 'VOICE_NOTE',
  ICEBREAKER = 'ICEBREAKER',
  SYSTEM = 'SYSTEM'
}

export enum MessageStatus {
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED'
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  url: string;
  mimeType: string;
  fileSizeBytes: number;
  durationSeconds?: number | null; // For voice notes
  waveformJson?: string | null; // Waveform data array serialized
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date | string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  type: MessageType;
  content: string;
  status: MessageStatus;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  createdAt: Date | string;
  readAt?: Date | string | null;
}

export interface ConversationParticipant {
  userId: string;
  displayName: string;
  primaryPhotoUrl?: string | null;
  isOnline: boolean;
  lastSeenAt?: Date | string | null;
}

export interface Conversation {
  id: string;
  matchId?: string | null;
  participants: ConversationParticipant[];
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  isMuted: boolean;
  updatedAt: Date | string;
}

export interface TypingIndicatorEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  userId: string;
  isOnline: boolean;
  lastSeenAt: Date | string;
}
