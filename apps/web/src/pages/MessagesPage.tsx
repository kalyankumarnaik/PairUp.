import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCheck,
  ChevronRight,
  Flag,
  Image as ImageIcon,
  Mic,
  MicOff,
  MoreVertical,
  Paperclip,
  Pause,
  Phone,
  PhoneOff,
  Play,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  UserX,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { ChatMessage, Conversation, MessageStatus, MessageType, ReportCategory } from '@pairup/domain-types';
import { MOCK_CONVERSATIONS } from '../lib/mockData';

const SAMPLE_CHAT_PHOTOS = [
  { label: '☕ Cafe Date', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800' },
  { label: '🌇 Sunset Vista', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800' },
  { label: '🍕 Foodie Time', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' },
  { label: '🏞️ Weekend Trek', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800' },
  { label: '🎸 Live Music', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800' },
];

const ICEBREAKER_PROMPTS = [
  '☕ Filter coffee vs. cutting chai — settle this debate once and for all?',
  '✈️ If you could teleport to any music festival or concert right now, where are we heading?',
  '🍕 What is the single best hidden food joint in your city that tourists always miss?',
  '🏔️ Weekend mountains or sunset beach: which reset is non-negotiable for you?',
  '🎭 Two truths and a lie: what is your most chaotic travel story so far?'
];

interface CallSession {
  active: boolean;
  type: 'AUDIO' | 'VIDEO';
  status: 'calling' | 'connected';
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoMuted: boolean;
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    MOCK_CONVERSATIONS[0].lastMessage as any
  ]);
  const [inputContent, setInputContent] = useState('');
  
  // Voice Recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const voiceTimerRef = useRef<any>(null);

  // Audio Playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState(0);
  const playbackTimerRef = useRef<any>(null);

  // Real-time Voice / Video Call state
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const callDurationRef = useRef<any>(null);

  // Rich Media Sharing modal & Lightbox
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // AI Icebreakers
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  // Header Dropdown Menu & Safety Tools (Report / Block)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory>(ReportCategory.HARASSMENT);
  const [reportReason, setReportReason] = useState('');
  const [safetyToast, setSafetyToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Voice note playback simulation
  useEffect(() => {
    if (playingVoiceId) {
      setVoicePlaybackProgress(0);
      playbackTimerRef.current = setInterval(() => {
        setVoicePlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(playbackTimerRef.current);
            setPlayingVoiceId(null);
            return 0;
          }
          return prev + 10;
        });
      }, 300);
    } else {
      clearInterval(playbackTimerRef.current);
      setVoicePlaybackProgress(0);
    }
    return () => clearInterval(playbackTimerRef.current);
  }, [playingVoiceId]);

  // Call timer simulation
  useEffect(() => {
    if (callSession && callSession.status === 'connected') {
      callDurationRef.current = setInterval(() => {
        setCallSession((prev) => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    } else {
      clearInterval(callDurationRef.current);
    }
    return () => clearInterval(callDurationRef.current);
  }, [callSession?.status]);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() || !activeConvId) return;

    const content = inputContent.trim();
    setInputContent('');
    setShowIcebreakers(false);

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
        setMessages((prev) =>
          prev.map((m) => (m.id === newMsg.id ? res.data! : m))
        );
      }
    } catch {
      // Offline fallback: message stays in state
    }
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedImageUrl || !activeConvId) return;

    const imageMsg: ChatMessage = {
      id: `msg_img_${Date.now()}`,
      conversationId: activeConvId,
      senderId: user?.id || 'usr_current',
      type: MessageType.IMAGE,
      content: imageCaption.trim() || 'Shared a photo',
      status: MessageStatus.SENT,
      attachments: [
        {
          id: `att_${Date.now()}`,
          messageId: `msg_img_${Date.now()}`,
          url: selectedImageUrl,
          mimeType: 'image/jpeg',
          fileSizeBytes: 102400
        }
      ],
      reactions: [],
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, imageMsg]);
    setShowImageModal(false);
    setSelectedImageUrl('');
    setImageCaption('');

    try {
      await apiClient.sendMessage(activeConvId, imageMsg.content, 'IMAGE');
    } catch {
      // Offline fallback
    }
  };

  // Voice Recording handlers
  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    voiceTimerRef.current = setInterval(() => {
      setVoiceSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleSendVoiceNote = async () => {
    if (!activeConvId) return;
    setIsRecordingVoice(false);
    clearInterval(voiceTimerRef.current);

    const seconds = Math.max(2, voiceSeconds);
    setVoiceSeconds(0);

    const voiceMsg: ChatMessage = {
      id: `msg_voice_${Date.now()}`,
      conversationId: activeConvId,
      senderId: user?.id || 'usr_current',
      type: MessageType.VOICE_NOTE,
      content: `🎙️ Voice Note (${seconds}s)`,
      status: MessageStatus.SENT,
      attachments: [
        {
          id: `att_v_${Date.now()}`,
          messageId: `msg_voice_${Date.now()}`,
          url: 'mock_audio_stream',
          mimeType: 'audio/m4a',
          durationSeconds: seconds,
          fileSizeBytes: 24500,
          waveformJson: JSON.stringify([40, 75, 30, 95, 60, 85, 45, 100, 70, 50, 80, 65])
        }
      ],
      reactions: [],
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, voiceMsg]);

    try {
      await apiClient.sendMessage(activeConvId, `Voice message (${seconds}s)`, 'VOICE_NOTE');
    } catch {
      // Offline fallback
    }
  };

  // Real-time Voice / Video Call handlers
  const startCall = (type: 'AUDIO' | 'VIDEO') => {
    setCallSession({
      active: true,
      type,
      status: 'calling',
      duration: 0,
      isMuted: false,
      isSpeakerOn: true,
      isVideoMuted: false
    });

    // Simulate other participant picking up after 2.5 seconds
    setTimeout(() => {
      setCallSession((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2500);
  };

  const endCall = () => {
    if (!callSession || !activeConvId) {
      setCallSession(null);
      return;
    }

    const durationStr = formatDuration(callSession.duration);
    const callLogMsg: ChatMessage = {
      id: `msg_call_${Date.now()}`,
      conversationId: activeConvId,
      senderId: user?.id || 'usr_current',
      type: MessageType.TEXT,
      content: `${callSession.type === 'AUDIO' ? '📞 Voice Call' : '📹 Video Call'} ended • ${durationStr}`,
      status: MessageStatus.READ,
      attachments: [],
      reactions: [],
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, callLogMsg]);
    setCallSession(null);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Reactions
  const handleToggleReaction = async (messageId: string, emoji: string) => {
    if (!activeConvId) return;
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
  };

  // Reporting and Blocking handlers
  const handleFileReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId) return;
    setShowReportModal(false);

    try {
      await apiClient.reportUser({
        reportedUserId: otherMember?.userId || 'usr_target',
        category: reportCategory,
        reason: reportReason.trim() || 'Inappropriate interaction during chat'
      });
      setSafetyToast('Report submitted. Our 24/7 safety team is reviewing this profile.');
    } catch {
      setSafetyToast('Report recorded. Thank you for keeping PairUp safe.');
    }

    setReportReason('');
    setTimeout(() => setSafetyToast(null), 5000);
  };

  const handleBlockUser = async () => {
    if (!activeConvId) return;
    const targetName = otherMember?.displayName || 'User';

    try {
      await apiClient.blockUser(otherMember?.userId || 'usr_target');
    } catch {
      // Fallback
    }

    setShowBlockModal(false);
    setShowOptionsMenu(false);
    // Remove this conversation from active list
    setConversations((prev) => prev.filter((c) => c.id !== activeConvId));
    setActiveConvId(conversations[1]?.id || null);
    setSafetyToast(`${targetName} has been blocked and removed from your radar.`);
    setTimeout(() => setSafetyToast(null), 5000);
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherMember = activeConv?.participants.find((p) => p.userId !== user?.id) || activeConv?.participants[0];

  return (
    <div className="h-[calc(100vh-100px)] bg-white rounded-3xl border border-borderSoft shadow-sm flex overflow-hidden relative">
      {/* Safety Toast Notification */}
      {safetyToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-midnightInk text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-white/10 animate-bounce">
          <Shield className="w-4 h-4 text-emerald" />
          <span>{safetyToast}</span>
        </div>
      )}

      {/* Sidebar Conversations List */}
      <div className="w-80 border-r border-borderSoft flex flex-col hidden sm:flex bg-white">
        <div className="p-4 border-b border-borderSoft flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-ink">Conversations</h2>
            <p className="text-xs text-ink-muted">Encrypted • Real-Time Chat</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-violet-light text-violet text-[10px] font-extrabold">
            {conversations.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-borderSoft">
          {conversations.map((conv) => {
            const other = conv.participants.find((p) => p.userId !== user?.id) || conv.participants[0];
            const isSelected = conv.id === activeConvId;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full p-4 flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'bg-lavender-light border-r-4 border-violet shadow-2xs' : 'hover:bg-cloud'
                }`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-violet/10">
                  <img
                    src={other?.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {other?.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald ring-2 ring-white animate-pulse" />
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
        <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
          {/* Header */}
          <div className="p-4 border-b border-borderSoft flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-violet/20 shadow-xs">
                <img
                  src={otherMember?.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <span>{otherMember?.displayName}</span>
                  <span className="text-xs">✨</span>
                </p>
                <p className="text-[11px] text-emerald font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
                  <span>Online now</span>
                </p>
              </div>
            </div>

            {/* Calling & Menu Action Buttons */}
            <div className="flex items-center gap-1.5 text-ink-muted relative">
              <button
                onClick={() => startCall('AUDIO')}
                title="Start Voice Call"
                className="p-2.5 rounded-xl bg-cloud hover:bg-violet-light text-ink hover:text-violet transition-all hover:scale-105 active:scale-95 shadow-2xs"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => startCall('VIDEO')}
                title="Start Video Call"
                className="p-2.5 rounded-xl bg-cloud hover:bg-coral-light text-ink hover:text-coral transition-all hover:scale-105 active:scale-95 shadow-2xs"
              >
                <Video className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-borderSoft shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowReportModal(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-dangerRed hover:bg-dangerRedLight/40 flex items-center gap-2 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report User</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowBlockModal(true);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-ink-muted hover:text-ink hover:bg-cloud flex items-center gap-2 transition-colors"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Block & Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-cloud/60">
            {/* Conversation Introduction */}
            <div className="text-center py-4">
              <div className="inline-flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-borderSoft shadow-2xs">
                <span className="text-2xl">💫</span>
                <p className="text-xs font-bold text-ink">You and {otherMember?.displayName} matched!</p>
                <p className="text-[10px] text-ink-muted">Encrypted end-to-end. Keep personal phone numbers private initially.</p>
              </div>
            </div>

            {messages.map((m) => {
              const isMe = m.senderId === user?.id;
              const isVoice = m.type === 'VOICE_NOTE' || m.content.includes('Voice Note') || m.content.includes('🎙️');
              const isImage = m.type === 'IMAGE' || m.attachments?.some((a) => a.mimeType?.startsWith('image/'));
              const imgAttachment = m.attachments?.find((a) => a.mimeType?.startsWith('image/'));

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm relative group transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-violet to-violet-hover text-white rounded-br-xs'
                        : 'bg-white text-ink border border-borderSoft rounded-bl-xs'
                    } ${isImage ? 'p-2' : 'px-4 py-3'}`}
                  >
                    {/* Image Message Bubble */}
                    {isImage ? (
                      <div className="space-y-2">
                        <div
                          onClick={() => setLightboxUrl(imgAttachment?.url || m.attachments?.[0]?.url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800')}
                          className="rounded-xl overflow-hidden cursor-zoom-in max-h-60 bg-midnightInk relative group/img"
                        >
                          <img
                            src={imgAttachment?.url || m.attachments?.[0]?.url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'}
                            alt="Attachment"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-midnightInk/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                            Click to Expand 🔍
                          </div>
                        </div>
                        {m.content && m.content !== 'Shared a photo' && (
                          <p className="px-2 pb-1 text-xs">{m.content}</p>
                        )}
                      </div>
                    ) : isVoice ? (
                      /* Playable Voice Note Bubble */
                      <div className="flex items-center gap-3.5 py-1 min-w-[200px]">
                        <button
                          onClick={() => setPlayingVoiceId(playingVoiceId === m.id ? null : m.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all ${
                            isMe ? 'bg-white text-violet' : 'bg-gradient-to-tr from-coral to-violet text-white'
                          }`}
                        >
                          {playingVoiceId === m.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span>{m.content}</span>
                            <span>{playingVoiceId === m.id ? `${voicePlaybackProgress}%` : '0:18'}</span>
                          </div>
                          {/* Animated Voice Equalizer Waveform Bars */}
                          <div className="flex items-center gap-1 h-5">
                            {[40, 75, 30, 95, 60, 85, 45, 100, 70, 50, 80, 65].map((height, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-150 ${
                                  isMe ? 'bg-white/80' : 'bg-violet'
                                }`}
                                style={{
                                  height:
                                    playingVoiceId === m.id
                                      ? `${Math.max(20, Math.sin((voicePlaybackProgress + i * 15) * 0.1) * 100)}%`
                                      : `${height}%`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Regular Text Message */
                      <p>{m.content}</p>
                    )}

                    {/* Reactions Bar overlay on hover */}
                    <div
                      className={`absolute -top-7 ${
                        isMe ? 'right-0' : 'left-0'
                      } hidden group-hover:flex items-center gap-1 bg-white p-1 rounded-full shadow-md border border-borderSoft text-xs z-10 animate-in fade-in`}
                    >
                      {['💖', '😂', '🔥', '👏', '😍', '☕'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(m.id, emoji)}
                          className="hover:scale-125 transition-transform px-1 py-0.5"
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
                          className="px-2 py-0.5 rounded-full bg-white border border-borderSoft text-[10px] shadow-2xs font-semibold flex items-center gap-1"
                        >
                          <span>{r.emoji}</span>
                          <span className="text-ink-muted text-[9px]">1</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timestamp & Read Receipt */}
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-ink-muted/70">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-cyan" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Icebreaker Drawer / Suggestions */}
          {showIcebreakers && (
            <div className="p-3 bg-lavender-light border-t border-violet/20 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet">
                  <Sparkles className="w-3.5 h-3.5 text-coral animate-spin" style={{ animationDuration: '6s' }} />
                  <span>AI Conversation Starters</span>
                </div>
                <button
                  onClick={() => setShowIcebreakers(false)}
                  className="text-[11px] text-ink-muted hover:text-ink font-semibold"
                >
                  Close
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {ICEBREAKER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputContent(prompt);
                    }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white border border-violet/30 hover:border-violet text-[11px] font-medium text-ink hover:text-violet shadow-2xs text-left max-w-xs transition-all hover:scale-102"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Footer */}
          <div className="p-3 sm:p-4 bg-white border-t border-borderSoft">
            {isRecordingVoice ? (
              /* Live Voice Recording Bar */
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-coral/10 via-rose/10 to-peach/10 border border-coral/30 animate-pulse">
                <div className="flex items-center gap-3 text-coral font-bold text-xs">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-coral"></span>
                  </span>
                  <span>Recording voice note: {voiceSeconds}s</span>
                  {/* Wave effect bars */}
                  <div className="flex items-center gap-0.5 h-4">
                    {[10, 24, 14, 30, 20, 12].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-coral rounded-full animate-bounce"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
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
                    className="px-4 py-1.5 rounded-xl bg-coral text-white text-xs font-bold shadow-md hover:bg-coral-hover transition-all"
                  >
                    Send Voice Note 🚀
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Composer Form */
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* AI Icebreaker Toggle */}
                <button
                  type="button"
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    showIcebreakers
                      ? 'bg-violet text-white border-violet shadow-sm'
                      : 'bg-cloud hover:bg-lavender-light border-borderSoft text-violet hover:text-violet-hover'
                  }`}
                  title="AI Icebreakers & Starters"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* Photo Upload Attachment Button */}
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink-muted hover:text-ink transition-colors"
                  title="Share Photo"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                {/* Voice Record Button */}
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="p-2.5 rounded-xl hover:bg-cloud text-ink-muted hover:text-coral transition-colors"
                  title="Record Voice Note"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Message ${otherMember?.displayName || 'match'}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-cloud border border-borderSoft focus:outline-none focus:border-violet text-xs sm:text-sm font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-violet to-violet-hover text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-ink-muted">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-base font-bold text-ink">Select a match to start chatting</p>
          <p className="text-xs text-ink-muted mt-1 max-w-xs">
            Send icebreakers, share photos, leave voice notes, or initiate encrypted voice calls!
          </p>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. REAL-TIME VOICE / VIDEO CALL OVERLAY MODAL */}
      {/* ================================================================= */}
      {callSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-midnightInk text-white p-8 text-center shadow-2xl border border-white/10 flex flex-col items-center relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-violet/30 to-transparent pointer-events-none" />

            {/* Avatar with Pulsing Rings */}
            <div className="relative my-6">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-coral/50 shadow-2xl relative z-10">
                <img
                  src={otherMember?.primaryPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="animate-ping absolute inset-0 rounded-full bg-coral opacity-30"></span>
              <span className="animate-pulse absolute -inset-3 rounded-full bg-violet opacity-20"></span>
            </div>

            <h3 className="text-xl font-display font-black text-white">
              {otherMember?.displayName}
            </h3>
            <p className="text-xs font-bold text-coral mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
              <span>
                {callSession.status === 'calling'
                  ? 'Calling & Ringing...'
                  : `Connected • ${formatDuration(callSession.duration)}`}
              </span>
            </p>
            <p className="text-[11px] text-white/60 mt-1">
              Encrypted {callSession.type === 'AUDIO' ? 'HD Voice' : 'HD Video'} Stream
            </p>

            {/* In-Call Controls */}
            <div className="flex items-center gap-4 mt-8">
              {/* Mic Toggle */}
              <button
                onClick={() => setCallSession({ ...callSession, isMuted: !callSession.isMuted })}
                className={`p-3.5 rounded-full transition-all ${
                  callSession.isMuted ? 'bg-dangerRed text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title="Mute Mic"
              >
                {callSession.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="p-5 rounded-full bg-dangerRed hover:bg-dangerRed/90 text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={() => setCallSession({ ...callSession, isSpeakerOn: !callSession.isSpeakerOn })}
                className={`p-3.5 rounded-full transition-all ${
                  callSession.isSpeakerOn ? 'bg-violet text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                title="Speaker Mode"
              >
                {callSession.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. RICH MEDIA PHOTO ATTACHMENT MODAL */}
      {/* ================================================================= */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-coral" />
                <h3 className="text-base font-display font-bold text-ink">Share a Photo</h3>
              </div>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImageUrl('');
                }}
                className="p-1.5 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Image Preview or File Picker */}
            {selectedImageUrl ? (
              <div className="space-y-3">
                <div className="relative h-52 rounded-2xl overflow-hidden bg-midnightInk border border-borderSoft">
                  <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-midnightInk/70 text-white hover:bg-midnightInk"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Add a nice caption (optional)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:outline-none focus:border-violet"
                />
                <button
                  onClick={handleSendImage}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
                >
                  Send Photo 📸
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File picker button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-violet/40 hover:border-violet bg-lavender-light/40 flex flex-col items-center justify-center gap-2 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-violet text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-ink">Choose Photo from Device</span>
                  <span className="text-[10px] text-ink-muted">Supports JPG, PNG, WEBP</span>
                </button>

                {/* Instant curated photos */}
                <div>
                  <p className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
                    Or select an instant sample
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_CHAT_PHOTOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageUrl(sample.url)}
                        className="rounded-xl overflow-hidden border border-borderSoft hover:ring-2 hover:ring-coral relative group h-20"
                      >
                        <img src={sample.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-1 inset-x-1 text-[9px] font-bold bg-midnightInk/70 text-white rounded px-1 py-0.5 truncate text-center">
                          {sample.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. LIGHTBOX IMAGE ZOOM MODAL */}
      {/* ================================================================= */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/90 backdrop-blur-md cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img src={lightboxUrl} alt="" className="w-full h-full object-contain" />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-midnightInk/80 text-white hover:bg-midnightInk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. REPORT USER SAFETY MODAL */}
      {/* ================================================================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-dangerRed" />
                <h3 className="text-base font-display font-bold text-ink">
                  Report {otherMember?.displayName}
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-ink-muted mb-4">
              Your report is completely confidential. PairUp human moderators review reports within 15 minutes.
            </p>

            <form onSubmit={handleFileReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Reason for Report
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as ReportCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                >
                  <option value="HARASSMENT">Harassment or Abusive Language</option>
                  <option value="INAPPROPRIATE_CONTENT">Inappropriate or Explicit Photos</option>
                  <option value="FAKE_PROFILE">Fake Profile or Impersonation</option>
                  <option value="UNDERAGE">Suspected Underage Account (Under 18)</option>
                  <option value="SPAM">Commercial Spam or Advertising</option>
                  <option value="SCAM">Financial Solicitation or Scam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Details / Evidence
                </label>
                <textarea
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Tell us what occurred during this chat..."
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-cloud text-ink text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-dangerRed text-white text-xs font-bold shadow-md hover:bg-dangerRed/90"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. BLOCK USER CONFIRMATION MODAL */}
      {/* ================================================================= */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft text-center">
            <div className="w-12 h-12 rounded-full bg-dangerRedLight text-dangerRed flex items-center justify-center mx-auto mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">
              Block {otherMember?.displayName}?
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              They will no longer be able to message you, see your profile on the radar, or encounter you in voice rooms.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-cloud text-ink text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                className="flex-1 py-2.5 rounded-xl bg-dangerRed text-white text-xs font-bold shadow-md hover:bg-dangerRed/90"
              >
                Yes, Block User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
