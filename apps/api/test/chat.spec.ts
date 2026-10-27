import { describe, expect, it, beforeEach } from 'vitest';
import { ChatService } from '../src/modules/chat/chat.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { MessageType } from '@pairup/domain-types';

describe('ChatService & Persistent Messaging', () => {
  let chatService: ChatService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    chatService = new ChatService(store);
  });

  it('retrieves persistent messages for authorized participants', () => {
    const messages = chatService.getMessages('usr_demo_1', 'conv_demo_1_2');
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].content).toContain('Marine Drive');
  });

  it('rejects message access for non-members', () => {
    expect(() => {
      chatService.getMessages('usr_demo_5', 'conv_demo_1_2');
    }).toThrow(/Access denied/);
  });

  it('sends and persists messages in the conversation', () => {
    const newMsg = chatService.sendMessage(
      'usr_demo_1',
      'conv_demo_1_2',
      'Sounds great, see you at 6 PM! ☕',
      MessageType.TEXT
    );

    expect(newMsg.id).toBeDefined();
    expect(newMsg.content).toBe('Sounds great, see you at 6 PM! ☕');

    const updated = chatService.getMessages('usr_demo_1', 'conv_demo_1_2');
    expect(updated[updated.length - 1].content).toBe('Sounds great, see you at 6 PM! ☕');
  });

  it('adds and toggles emoji reactions on messages', () => {
    const reaction = chatService.addReaction('usr_demo_1', 'conv_demo_1_2', 'msg_init_1', '🔥');
    expect(reaction.emoji).toBe('🔥');
  });
});
