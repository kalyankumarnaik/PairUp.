import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  ChatMessage,
  Conversation,
  MessageReaction,
  MessageStatus,
  MessageType
} from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class ChatService {
  constructor(private readonly store: MemoryStoreService) {}

  getConversations(userId: string): Conversation[] {
    const results: Conversation[] = [];

    for (const [, conv] of this.store.conversations.entries()) {
      const isMember = conv.participants.some((p) => p.userId === userId);
      if (isMember) {
        const msgs = this.store.messages.get(conv.id) || [];
        const lastMsg = msgs[msgs.length - 1] || null;

        results.push({
          ...conv,
          lastMessage: lastMsg
        });
      }
    }

    return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getConversation(userId: string, conversationId: string): Conversation {
    const conv = this.store.conversations.get(conversationId);
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember = conv.participants.some((p) => p.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('Access denied: You are not a participant in this conversation');
    }

    const msgs = this.store.messages.get(conversationId) || [];
    return {
      ...conv,
      lastMessage: msgs[msgs.length - 1] || null
    };
  }

  getMessages(userId: string, conversationId: string, limit: number = 50): ChatMessage[] {
    this.getConversation(userId, conversationId); // Membership verification

    const msgs = this.store.messages.get(conversationId) || [];

    // Mark unread messages from other user as READ
    msgs.forEach((m) => {
      if (m.senderId !== userId && m.status !== MessageStatus.READ) {
        m.status = MessageStatus.READ;
        m.readAt = new Date().toISOString();
      }
    });

    return msgs.slice(-limit);
  }

  sendMessage(
    userId: string,
    conversationId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
    attachmentUrls?: string[],
    voiceDurationSeconds?: number,
    waveform?: number[]
  ): ChatMessage {
    const conv = this.getConversation(userId, conversationId); // Enforce membership

    const senderProfile = this.store.profiles.get(userId);
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const attachments = (attachmentUrls || []).map((url, idx) => ({
      id: `att_${msgId}_${idx}`,
      messageId: msgId,
      url,
      mimeType: type === MessageType.VOICE_NOTE ? 'audio/webm' : 'image/jpeg',
      fileSizeBytes: 1024 * 50,
      durationSeconds: voiceDurationSeconds || null,
      waveformJson: waveform ? JSON.stringify(waveform) : null
    }));

    const message: ChatMessage = {
      id: msgId,
      conversationId,
      senderId: userId,
      senderName: senderProfile?.displayName || 'User',
      type,
      content,
      status: MessageStatus.SENT,
      attachments,
      reactions: [],
      createdAt: new Date().toISOString()
    };

    const msgs = this.store.messages.get(conversationId) || [];
    msgs.push(message);
    this.store.messages.set(conversationId, msgs);

    conv.updatedAt = message.createdAt;
    this.store.conversations.set(conversationId, conv);

    return message;
  }

  addReaction(
    userId: string,
    conversationId: string,
    messageId: string,
    emoji: string
  ): MessageReaction {
    this.getConversation(userId, conversationId);

    const msgs = this.store.messages.get(conversationId) || [];
    const message = msgs.find((m) => m.id === messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Toggle reaction if already exists
    const existingIndex = message.reactions.findIndex(
      (r) => r.userId === userId && r.emoji === emoji
    );

    if (existingIndex >= 0) {
      const removed = message.reactions.splice(existingIndex, 1)[0];
      return removed;
    }

    const reaction: MessageReaction = {
      id: `rc_${Date.now()}`,
      messageId,
      userId,
      emoji,
      createdAt: new Date()
    };

    message.reactions.push(reaction);
    return reaction;
  }
}
