import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  senderId: string;
  type: 'TEXT' | 'IMAGE' | 'VOICE_NOTE';
  content: string;
  photoUrl?: string;
  durationSecs?: number;
  time: string;
  isMe: boolean;
  reactions: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'partner',
    type: 'TEXT',
    content: 'Hey! Loved your photo from CEPT. Are you also into urban sketching? 🎨',
    time: '10:14 AM',
    isMe: false,
    reactions: ['💖']
  },
  {
    id: 'm2',
    senderId: 'me',
    type: 'TEXT',
    content: 'Yes! Sunday mornings at Bandra Fort or Asiatic Steps are my sacred ritual. What about you?',
    time: '10:16 AM',
    isMe: true,
    reactions: ['👏']
  },
  {
    id: 'm3',
    senderId: 'partner',
    type: 'VOICE_NOTE',
    content: '🎙️ Voice Note (14s)',
    durationSecs: 14,
    time: '10:20 AM',
    isMe: false,
    reactions: ['🔥']
  }
];

const ICEBREAKER_PROMPTS = [
  '☕ Filter coffee vs. cutting chai — settle the debate once and for all?',
  '✈️ If we could teleport to any music gig tonight, where are we heading?',
  '🍕 Best hidden midnight food street in the city that tourists never find?',
  '🏔️ Mountain sunrise or ocean sunset: which one recharges your soul?'
];

export default function MobileChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  
  // Voice Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const recordTimerRef = useRef<any>(null);

  // Voice Note Playback
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Calling Modal
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState<'AUDIO' | 'VIDEO'>('AUDIO');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const callTimerRef = useRef<any>(null);

  // Photo Attachment Modal & Lightbox
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // AI Icebreaker Sheet
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  // Safety Action Sheet
  const [showSafetySheet, setShowSafetySheet] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordSecs((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordSecs(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecording]);

  // Call duration timer
  useEffect(() => {
    if (callActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } else {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callActive]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      type: 'TEXT',
      content: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      reactions: []
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setShowIcebreakers(false);
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const secs = Math.max(2, recordSecs);

    const voiceMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      type: 'VOICE_NOTE',
      content: `🎙️ Voice Note (${secs}s)`,
      durationSecs: secs,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      reactions: []
    };

    setMessages((prev) => [...prev, voiceMsg]);
  };

  const handleSendSampleImage = (url: string) => {
    setShowPhotoModal(false);
    const imgMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      type: 'IMAGE',
      content: 'Shared a photo 📸',
      photoUrl: url,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      reactions: []
    };
    setMessages((prev) => [...prev, imgMsg]);
  };

  const startCall = (type: 'AUDIO' | 'VIDEO') => {
    setCallType(type);
    setCallActive(true);
  };

  const endCall = () => {
    const mins = Math.floor(callDuration / 60);
    const secs = callDuration % 60;
    const durStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    const callMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      type: 'TEXT',
      content: `${callType === 'AUDIO' ? '📞 Voice Call' : '📹 Video Call'} ended • ${durStr}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      reactions: []
    };

    setMessages((prev) => [...prev, callMsg]);
    setCallActive(false);
  };

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.partnerName}>Ananya Verma ✨</Text>
            <Text style={styles.partnerStatus}>Active now • Encrypted</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => startCall('AUDIO')}
          >
            <Text style={{ fontSize: 16 }}>📞</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => startCall('VIDEO')}
          >
            <Text style={{ fontSize: 16 }}>📹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setShowSafetySheet(true)}
          >
            <Text style={{ fontSize: 16 }}>🛡️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Messages Stream */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.isMe ? styles.messageRowMe : styles.messageRowPartner
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  item.isMe ? styles.bubbleMe : styles.bubblePartner
                ]}
              >
                {/* Voice Note Message */}
                {item.type === 'VOICE_NOTE' ? (
                  <View style={styles.voiceNoteWrap}>
                    <TouchableOpacity
                      style={[
                        styles.playBtn,
                        item.isMe ? styles.playBtnMe : styles.playBtnPartner
                      ]}
                      onPress={() =>
                        setPlayingVoiceId(playingVoiceId === item.id ? null : item.id)
                      }
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                        {playingVoiceId === item.id ? '⏸' : '▶'}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.msgText, item.isMe && styles.msgTextMe]}>
                        {item.content}
                      </Text>
                      {/* Animated Soundwave bar simulation */}
                      <View style={styles.waveformRow}>
                        {[4, 12, 8, 16, 10, 14, 6, 18, 11, 7].map((h, i) => (
                          <View
                            key={i}
                            style={[
                              styles.waveBar,
                              { height: playingVoiceId === item.id ? (i % 2 === 0 ? 16 : 8) : h },
                              item.isMe ? { backgroundColor: 'rgba(255,255,255,0.8)' } : { backgroundColor: '#7C3AED' }
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                ) : item.type === 'IMAGE' ? (
                  /* Image Message */
                  <TouchableOpacity onPress={() => setLightboxUrl(item.photoUrl || null)}>
                    <Image source={{ uri: item.photoUrl }} style={styles.bubbleImage} />
                    <Text style={[styles.msgText, item.isMe && styles.msgTextMe, { marginTop: 6 }]}>
                      {item.content}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  /* Text Message */
                  <Text style={[styles.msgText, item.isMe && styles.msgTextMe]}>
                    {item.content}
                  </Text>
                )}
              </View>

              <Text style={styles.msgTime}>{item.time}</Text>
            </View>
          )}
        />

        {/* AI Icebreaker Drawer */}
        {showIcebreakers && (
          <View style={styles.icebreakerDrawer}>
            <View style={styles.icebreakerHeader}>
              <Text style={styles.icebreakerTitle}>✨ AI Conversation Starters</Text>
              <TouchableOpacity onPress={() => setShowIcebreakers(false)}>
                <Text style={styles.closeText}>Close ✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ICEBREAKER_PROMPTS.map((prompt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.promptCard}
                  onPress={() => {
                    setInputText(prompt);
                    setShowIcebreakers(false);
                  }}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          {isRecording ? (
            <View style={styles.recordingBar}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>Recording Voice Note: {recordSecs}s</Text>
              <TouchableOpacity
                style={styles.cancelRecBtn}
                onPress={() => setIsRecording(false)}
              >
                <Text style={styles.cancelRecText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendRecBtn}
                onPress={handleSendVoiceNote}
              >
                <Text style={styles.sendRecText}>Send 🚀</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => setShowIcebreakers(!showIcebreakers)}
              >
                <Text style={{ fontSize: 18 }}>✨</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => setShowPhotoModal(true)}
              >
                <Text style={{ fontSize: 18 }}>📷</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => setIsRecording(true)}
              >
                <Text style={{ fontSize: 18 }}>🎙️</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#A39EB8"
              />

              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '900' }}>➔</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* ================================================================= */}
      {/* REAL-TIME VOICE / VIDEO CALL MODAL */}
      {/* ================================================================= */}
      <Modal visible={callActive} animationType="slide" transparent>
        <View style={styles.callModalContainer}>
          <View style={styles.callCard}>
            <View style={styles.callAvatarWrap}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }}
                style={styles.callAvatar}
              />
            </View>

            <Text style={styles.callPartnerName}>Ananya Verma</Text>
            <Text style={styles.callStatus}>
              {callType === 'AUDIO' ? '📞 HD Voice Call' : '📹 HD Video Call'} • {formatSecs(callDuration)}
            </Text>
            <Text style={styles.callEncrypted}>Encrypted End-to-End</Text>

            {/* In-Call Action Buttons */}
            <View style={styles.callActionsRow}>
              <TouchableOpacity
                style={[styles.callControlBtn, isMuted && styles.callControlBtnActive]}
                onPress={() => setIsMuted(!isMuted)}
              >
                <Text style={{ fontSize: 20 }}>{isMuted ? '🔇' : '🎙️'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.endCallBtn} onPress={endCall}>
                <Text style={{ fontSize: 24, color: '#FFFFFF' }}>📴</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.callControlBtn, isSpeaker && styles.callControlBtnActive]}
                onPress={() => setIsSpeaker(!isSpeaker)}
              >
                <Text style={{ fontSize: 20 }}>{isSpeaker ? '🔊' : '🔈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PHOTO ATTACHMENT MODAL */}
      <Modal visible={showPhotoModal} animationType="fade" transparent>
        <View style={styles.photoModalBackdrop}>
          <View style={styles.photoModalCard}>
            <Text style={styles.photoModalTitle}>Share a Photo 📸</Text>
            <Text style={styles.photoModalSubtitle}>Pick a sample photo to send in chat:</Text>

            <View style={styles.samplePhotosGrid}>
              {[
                { label: '☕ Cafe Date', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600' },
                { label: '🌇 Sunset Vista', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600' },
                { label: '🍕 Food Trail', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600' },
                { label: '🏔️ Trekking', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600' }
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.samplePhotoItem}
                  onPress={() => handleSendSampleImage(item.url)}
                >
                  <Image source={{ uri: item.url }} style={styles.sampleImg} />
                  <Text style={styles.sampleLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.photoModalCancel}
              onPress={() => setShowPhotoModal(false)}
            >
              <Text style={styles.photoModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SAFETY & MODERATION ACTION SHEET */}
      <Modal visible={showSafetySheet} animationType="fade" transparent>
        <View style={styles.safetySheetBackdrop}>
          <View style={styles.safetySheetCard}>
            <Text style={styles.safetySheetTitle}>Trust & Safety Tools 🛡️</Text>
            <Text style={styles.safetySheetSubtitle}>
              Protect your boundaries. Reports are reviewed by human safety officers 24/7.
            </Text>

            <TouchableOpacity
              style={styles.safetyOptionBtn}
              onPress={() => {
                setShowSafetySheet(false);
                Alert.alert('Report Filed', 'Thank you. Our moderation team will review this conversation within 15 minutes.');
              }}
            >
              <Text style={styles.safetyOptionText}>🚩 Report User (Harassment / Inappropriate)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.safetyOptionBtn, { backgroundColor: '#FFEBEF' }]}
              onPress={() => {
                setShowSafetySheet(false);
                Alert.alert('User Blocked', 'Ananya has been blocked and removed from your radar.');
              }}
            >
              <Text style={[styles.safetyOptionText, { color: '#E11D48' }]}>
                🚫 Block & Remove Member
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.safetyOptionCancel}
              onPress={() => setShowSafetySheet(false)}
            >
              <Text style={styles.safetyOptionCancelText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E7EF'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrap: {
    position: 'relative'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16845B',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#242039'
  },
  partnerStatus: {
    fontSize: 11,
    color: '#16845B',
    fontWeight: '700'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: '80%'
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  messageRowPartner: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start'
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  bubbleMe: {
    backgroundColor: '#7C3AED',
    borderBottomRightRadius: 4
  },
  bubblePartner: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  msgText: {
    fontSize: 13,
    color: '#242039',
    lineHeight: 18
  },
  msgTextMe: {
    color: '#FFFFFF'
  },
  msgTime: {
    fontSize: 10,
    color: '#A39EB8',
    marginTop: 4
  },
  voiceNoteWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 180
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playBtnMe: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  playBtnPartner: {
    backgroundColor: '#7C3AED'
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 18,
    marginTop: 4
  },
  waveBar: {
    width: 3,
    borderRadius: 2
  },
  bubbleImage: {
    width: 200,
    height: 140,
    borderRadius: 14
  },
  icebreakerDrawer: {
    backgroundColor: '#F0EAFD',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF'
  },
  icebreakerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  icebreakerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED'
  },
  closeText: {
    fontSize: 11,
    color: '#6B6684',
    fontWeight: '700'
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    maxWidth: 240
  },
  promptText: {
    fontSize: 11,
    color: '#242039',
    fontWeight: '600'
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E7EF',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionIconBtn: {
    padding: 6
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F7FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#242039',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    opacity: 0.4
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F5',
    padding: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD1DF'
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4F81'
  },
  recordingTime: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF4F81'
  },
  cancelRecBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  cancelRecText: {
    fontSize: 11,
    color: '#6B6684',
    fontWeight: '700'
  },
  sendRecBtn: {
    backgroundColor: '#FF4F81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  sendRecText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  callModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(36, 32, 57, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  callCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#242039',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  callAvatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FF4F81',
    overflow: 'hidden',
    marginBottom: 16
  },
  callAvatar: {
    width: '100%',
    height: '100%'
  },
  callPartnerName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  callStatus: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF4F81',
    marginTop: 4
  },
  callEncrypted: {
    fontSize: 10,
    color: '#A39EB8',
    marginTop: 2
  },
  callActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 28
  },
  callControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  callControlBtnActive: {
    backgroundColor: '#7C3AED'
  },
  endCallBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  photoModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  photoModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20
  },
  photoModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#242039'
  },
  photoModalSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2,
    marginBottom: 14
  },
  samplePhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  samplePhotoItem: {
    width: (300 - 10) / 2,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  sampleImg: {
    width: '100%',
    height: 90
  },
  sampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#242039',
    textAlign: 'center',
    paddingVertical: 4
  },
  photoModalCancel: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center'
  },
  photoModalCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6684'
  },
  safetySheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  safetySheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36
  },
  safetySheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#242039'
  },
  safetySheetSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2,
    marginBottom: 16
  },
  safetyOptionBtn: {
    backgroundColor: '#F8F7FF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  safetyOptionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#242039'
  },
  safetyOptionCancel: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4
  },
  safetyOptionCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B6684'
  }
});
