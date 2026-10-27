import React, { useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { ChatMessage, Conversation, MessageStatus, MessageType } from '@pairup/domain-types';
import { MOCK_CONVERSATIONS } from '../lib/mockData';

export const MessagesPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    MOCK_CONVERSATIONS[0].lastMessage as any
  ]);
  const [inputContent, setInputContent] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceTimerRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await apiClient.getConversations();
      if (res.data && res.data.length > 0) {
        setConversations(res.data);
        if (!activeConvId) {
          setActiveConvId(res.data[0].id);
        }
      }
    } catch {
      // Keep MOCK_CONVERSATIONS
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await apiClient.getMessages(convId);
      if (res.data && res.data.length > 0) {
        setMessages(res.data);
        return;
      }
    } catch {
      // Fallback
    }

    const conv = conversations.find((c) => c.id === convId);
    if (conv?.lastMessage) {
      setMessages([conv.lastMessage as any]);
    } else {
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConvId) return;

    const content = inputContent.trim();
    setInputContent('');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: activeConvId,
      senderId: user?.id || 'usr_current',
      type: MessageType.TEXT,
      content: content,
      status: MessageStatus.SENT,
      attachments: [],
      reactions: [],
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await apiClient.sendMessage(activeConvId, content, 'TEXT');
      if (res.data) {
        // update message id if returned from backend
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? res.data! : m))
        );
      }
    } catch {
      // Offline fallback: message already in state
    }
  };

  const handleSendVoiceNote = async () => {
    if (!activeConvId) return;
    setIsRecordingVoice(false);
    clearInterval(voiceTimerRef.current);

    const seconds = Math.max(2, voiceSeconds);
    setVoiceSeconds(0);

    try {
      const res = await apiClient.sendMessage(
        activeConvId,
        '🎙️ Voice message (' + seconds + 's)',
        'VOICE_NOTE'
      );
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    voiceTimerRef.current = setInterval(() => {
      setVoiceSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    if (!activeConvId) return;
    try {
      // Toggle reaction locally
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const has = m.reactions.some((r) => r.emoji === emoji && r.userId === user?.id);
            if (has) {
              return {
                ...m,
                reactions: m.reactions.filter((r) => !(r.emoji === emoji && r.userId === user?.id))
              };
            } else {
              return {
                ...m,
                reactions: [
                  ...m.reactions,
                  { id: 'rc_' + Date.now(), messageId, userId: user?.id || 'usr_me', emoji, createdAt: new Date() }
                ]
              };
            }
          }
          return m;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherMember = activeConv?.participants.find((p) => p.userId !== user?.id) || activeConv?.participants[0];

  return (
    <div className="h-[calc(100vh-100px)] bg-white rounded-3xl border border-borderSoft shadow-sm flex overflow-hidden">
      {/* Sidebar Conversations List */}
      <div className="w-80 border-r border-borderSoft flex flex-col hidden sm:flex">
        <div className="p-4 border-b border-borderSoft">
          <h2 className="text-lg font-display font-bold text-ink">Conversations</h2>
          <p className="text-xs text-ink-muted">Encrypted, authenticated messages</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-borderSoft">
          {conversations.map((conv) => {
            const other = conv.participants.find((p) => p.userId !== user?.id) || conv.participants[0];
            const isSelected = conv.id === activeConvId;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                  isSelected ? 'bg-lavender-light border-r-4 border-violet' : 'hover:bg-cloud'
                }`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={other?.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {other?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-ink truncate">{other?.displayName || 'Chat'}</p>
                    <span className="text-[10px] text-ink-muted">
                      {conv.lastMessage ? 'Active' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted truncate mt-0.5">
                    {conv.lastMessage?.content || 'Say hello ✨'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Main Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <div className="p-4 border-b border-borderSoft flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet/20">
                <img
                  src={otherMember?.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{otherMember?.displayName}</p>
                <p className="text-[11px] text-success font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span>Online now</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-ink-muted">
              <button
                onClick={() => alert(`Initiating voice call with ${otherMember?.displayName}...`)}
                title="Voice Call"
                className="p-2 rounded-xl hover:bg-cloud text-ink hover:text-violet transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Starting video call with ${otherMember?.displayName}...`)}
                title="Video Call"
                className="p-2 rounded-xl hover:bg-cloud text-ink hover:text-coral transition-colors"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert('Options: Mute conversation, Report user, Block profile')}
                className="p-2 rounded-xl hover:bg-cloud transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-cloud">
            {messages.map((m) => {
              const isMe = m.senderId === user?.id;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm relative group ${
                      isMe
                        ? 'bg-gradient-to-r from-violet to-violet-hover text-white rounded-br-xs'
                        : 'bg-white text-ink border border-borderSoft rounded-bl-xs'
                    }`}
                  >
                    {m.type === 'VOICE_NOTE' ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert('Playing voice message 🎙️')}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isMe ? 'bg-white/20 text-white' : 'bg-violet text-white'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div>
                          <p className="font-bold text-xs">{m.content}</p>
                          <div className="w-24 h-1.5 bg-white/40 rounded-full mt-1 overflow-hidden">
                            <div className="w-1/2 h-full bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>{m.content}</p>
                    )}

                    {/* Reactions Bar overlay */}
                    <div
                      className={`absolute -top-7 ${
                        isMe ? 'right-0' : 'left-0'
                      } hidden group-hover:flex items-center gap-1 bg-white p-1 rounded-full shadow-md border border-borderSoft text-xs z-10`}
                    >
                      {['❤️', '😂', '🔥', '👏', '😍'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(m.id, emoji)}
                          className="hover:scale-125 transition-transform px-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reaction pills below bubble */}
                  {m.reactions && m.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {m.reactions.map((r) => (
                        <span
                          key={r.id}
                          className="px-2 py-0.5 rounded-full bg-white border border-borderSoft text-[10px] shadow-2xs font-semibold"
                        >
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-ink-muted/70 mt-1 px-1">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Footer */}
          <div className="p-3 sm:p-4 bg-white border-t border-borderSoft">
            {isRecordingVoice ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-coral-light border border-coral/30">
                <div className="flex items-center gap-2 text-coral font-bold text-xs">
                  <span className="w-3 h-3 rounded-full bg-coral animate-ping" />
                  <span>Recording voice note: {voiceSeconds}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsRecordingVoice(false);
                      clearInterval(voiceTimerRef.current);
                    }}
                    className="px-3 py-1 text-xs text-ink-muted hover:text-ink font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-4 py-1.5 rounded-xl bg-coral text-white text-xs font-bold shadow-sm"
                  >
                    Send Voice Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Select photo to upload')}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink-muted hover:text-ink transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink-muted hover:text-coral transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Message ${otherMember?.displayName || ''}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-xs sm:text-sm font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="p-2.5 rounded-2xl bg-violet text-white hover:bg-violet-hover disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-ink-muted">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm font-bold text-ink">Select a match to start chatting</p>
        </div>
      )}
    </div>
  );
};
