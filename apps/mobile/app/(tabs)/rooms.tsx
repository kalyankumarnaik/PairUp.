import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface RoomSpeaker {
  id: string;
  name: string;
  photoUrl: string;
  isHost: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
}

interface AudioRoom {
  id: string;
  title: string;
  topic: string;
  emoji: string;
  listenerCount: number;
  speakers: RoomSpeaker[];
}

const MOCK_ROOMS: AudioRoom[] = [
  {
    id: 'room_1',
    title: 'Filter Coffee vs. Cutting Chai: The Ultimate Debate',
    topic: 'Food & Culture',
    emoji: '☕',
    listenerCount: 42,
    speakers: [
      {
        id: 's1',
        name: 'Ananya (Host)',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        isHost: true,
        isSpeaking: true,
        isMuted: false
      },
      {
        id: 's2',
        name: 'Aarav',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        isHost: false,
        isSpeaking: false,
        isMuted: true
      },
      {
        id: 's3',
        name: 'Priya',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        isHost: false,
        isSpeaking: true,
        isMuted: false
      }
    ]
  },
  {
    id: 'room_2',
    title: 'Indie Vinyl & Late Night Lo-Fi Jams',
    topic: 'Music & Vibes',
    emoji: '🎧',
    listenerCount: 88,
    speakers: [
      {
        id: 's4',
        name: 'Rohan',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        isHost: true,
        isSpeaking: true,
        isMuted: false
      }
    ]
  }
];

export default function MobileRoomsScreen() {
  const [activeRoom, setActiveRoom] = useState<AudioRoom | null>(MOCK_ROOMS[0]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [reactionBurst, setReactionBurst] = useState<string[]>([]);

  const triggerReaction = (emoji: string) => {
    setReactionBurst((prev) => [...prev.slice(-4), emoji]);
    setTimeout(() => {
      setReactionBurst((prev) => prev.slice(1));
    }, 1500);
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    Alert.alert(
      !isHandRaised ? 'Hand Raised ✋' : 'Hand Lowered',
      !isHandRaised
        ? 'The host has been notified that you would like to speak on stage.'
        : 'You are now listening from the floor.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.liveDot} />
            <Text style={styles.badgeText}>LIVE AUDIO COMMUNITIES</Text>
          </View>
          <Text style={styles.headerTitle}>Voice Stages</Text>
        </View>

        <TouchableOpacity
          style={styles.createRoomBtn}
          onPress={() => Alert.alert('Start a Room', 'Select a room topic and invite friends to join your live audio stage.')}
        >
          <Text style={styles.createRoomText}>+ Start Stage</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active Stage Player Card */}
        {activeRoom && (
          <View style={styles.activeStageCard}>
            <View style={styles.stageTopRow}>
              <View style={styles.stageTopicPill}>
                <Text style={{ fontSize: 12 }}>{activeRoom.emoji}</Text>
                <Text style={styles.stageTopicText}>{activeRoom.topic}</Text>
              </View>
              <Text style={styles.listenerBadge}>👥 {activeRoom.listenerCount} in stage</Text>
            </View>

            <Text style={styles.stageTitle}>{activeRoom.title}</Text>

            {/* Reaction Burst Overlay */}
            {reactionBurst.length > 0 && (
              <View style={styles.reactionBurstContainer}>
                {reactionBurst.map((emoji, idx) => (
                  <Text key={idx} style={styles.burstEmoji}>
                    {emoji}
                  </Text>
                ))}
              </View>
            )}

            {/* Speaker Grid Floor */}
            <Text style={styles.speakersHeader}>On Stage (Speakers)</Text>
            <View style={styles.speakersGrid}>
              {activeRoom.speakers.map((spk) => (
                <View key={spk.id} style={styles.speakerItem}>
                  <View
                    style={[
                      styles.speakerAvatarWrap,
                      spk.isSpeaking && styles.speakerAvatarSpeaking
                    ]}
                  >
                    <Image source={{ uri: spk.photoUrl }} style={styles.speakerAvatar} />
                    <View style={styles.speakerMicBadge}>
                      <Text style={{ fontSize: 10 }}>{spk.isMuted ? '🔇' : '🎙️'}</Text>
                    </View>
                  </View>

                  <Text style={styles.speakerName} numberOfLines={1}>
                    {spk.name}
                  </Text>

                  {/* Audio Equalizer wave for active speakers */}
                  {spk.isSpeaking && (
                    <View style={styles.equalizerBars}>
                      {[8, 14, 6, 12].map((h, i) => (
                        <View key={i} style={[styles.eqBar, { height: h }]} />
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Stage Controls */}
            <View style={styles.stageControls}>
              <TouchableOpacity
                style={[styles.controlBtn, isHandRaised && styles.controlBtnActive]}
                onPress={toggleHandRaise}
              >
                <Text style={{ fontSize: 18 }}>✋</Text>
                <Text style={[styles.controlBtnText, isHandRaised && { color: '#7C3AED' }]}>
                  {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlBtn, !isMicMuted && styles.controlBtnActive]}
                onPress={() => setIsMicMuted(!isMicMuted)}
              >
                <Text style={{ fontSize: 18 }}>{isMicMuted ? '🔇' : '🎙️'}</Text>
                <Text style={[styles.controlBtnText, !isMicMuted && { color: '#16845B' }]}>
                  {isMicMuted ? 'Muted' : 'Unmuted'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: '#FFEBEF' }]}
                onPress={() => setActiveRoom(null)}
              >
                <Text style={{ fontSize: 18 }}>✌️</Text>
                <Text style={[styles.controlBtnText, { color: '#E11D48' }]}>Leave Quietly</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Emoji Reaction Row */}
            <View style={styles.emojiReactionRow}>
              {['💖', '🔥', '👏', '😂', '☕', '🎉'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiBtn}
                  onPress={() => triggerReaction(emoji)}
                >
                  <Text style={{ fontSize: 20 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Other Active Rooms List */}
        <Text style={styles.sectionHeader}>Explore Other Live Stages</Text>

        {MOCK_ROOMS.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.roomCard}
            onPress={() => setActiveRoom(r)}
          >
            <View style={styles.roomCardHeader}>
              <Text style={{ fontSize: 24, marginRight: 8 }}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.roomCardTitle}>{r.title}</Text>
                <Text style={styles.roomCardTopic}>{r.topic} • 👥 {r.listenerCount} listeners</Text>
              </View>
            </View>

            <View style={styles.roomSpeakersRow}>
              {r.speakers.map((s) => (
                <View key={s.id} style={styles.speakerMiniPill}>
                  <Image source={{ uri: s.photoUrl }} style={styles.speakerMiniAvatar} />
                  <Text style={styles.speakerMiniName}>{s.name.split(' ')[0]}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E11D48',
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#242039',
    marginTop: 2
  },
  createRoomBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14
  },
  createRoomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  activeStageCard: {
    backgroundColor: '#242039',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    position: 'relative'
  },
  stageTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stageTopicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  stageTopicText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  listenerBadge: {
    color: '#FF8A5B',
    fontSize: 11,
    fontWeight: '800'
  },
  stageTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
    lineHeight: 24
  },
  reactionBurstContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'center',
    gap: 4
  },
  burstEmoji: {
    fontSize: 26
  },
  speakersHeader: {
    color: '#A39EB8',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 12
  },
  speakersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  speakerItem: {
    alignItems: 'center',
    width: 72
  },
  speakerAvatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    padding: 2
  },
  speakerAvatarSpeaking: {
    borderColor: '#FF4F81',
    borderWidth: 2.5
  },
  speakerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28
  },
  speakerMicBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2
  },
  speakerName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center'
  },
  equalizerBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4
  },
  eqBar: {
    width: 2,
    backgroundColor: '#FF4F81',
    borderRadius: 1
  },
  stageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  controlBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4
  },
  controlBtnActive: {
    backgroundColor: '#FFFFFF'
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2
  },
  emojiReactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    borderRadius: 16
  },
  emojiBtn: {
    padding: 4
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#242039',
    marginBottom: 12
  },
  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  roomCardHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roomCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#242039'
  },
  roomCardTopic: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2
  },
  roomSpeakersRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF6'
  },
  speakerMiniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6
  },
  speakerMiniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9
  },
  speakerMiniName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#242039'
  }
});
