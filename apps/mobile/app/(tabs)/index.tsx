import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  distance: number;
  bio: string;
  image: string;
  interests: string[];
  mode: 'DATING' | 'FRIENDSHIP';
}

const DEMO_PROFILES: DiscoveryProfile[] = [
  {
    id: '1',
    name: 'Ananya Verma',
    age: 26,
    city: 'Mumbai',
    distance: 3.5,
    bio: 'Architect, plant mom & amateur photographer. Let’s talk about design, vinyl records, or the best pasta in Bandra.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    interests: ['☕ Cafes', '🎨 Contemporary Art', '📷 Photography'],
    mode: 'DATING'
  },
  {
    id: '2',
    name: 'Aarav Sharma',
    age: 28,
    city: 'Mumbai',
    distance: 4.2,
    bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    interests: ['🏔️ Trekking', '🏸 Badminton', '💻 Tech'],
    mode: 'FRIENDSHIP'
  },
  {
    id: '3',
    name: 'Diya Sen',
    age: 24,
    city: 'Bengaluru',
    distance: 5.1,
    bio: 'Writer, classical dancer, and indie film enthusiast. Seeking genuine conversations over artisanal pour-overs.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    interests: ['📚 Reading', '🎬 Indie Cinema', '🧘 Yoga'],
    mode: 'DATING'
  },
  {
    id: '4',
    name: 'Kabir Roy',
    age: 27,
    city: 'Pune',
    distance: 7.8,
    bio: 'Mechanical engineer and motorcycle tourer. Weekend acoustic jams and finding quiet mountain roads.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
    interests: ['🏍️ Motorcycles', '🎸 Acoustic Jams', '🏕️ Camping'],
    mode: 'FRIENDSHIP'
  }
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>(DEMO_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<DiscoveryProfile | null>(null);
  const [deckMode, setDeckMode] = useState<'ALL' | 'DATING' | 'FRIENDSHIP'>('ALL');

  const filteredProfiles = profiles.filter((p) =>
    deckMode === 'ALL' ? true : p.mode === deckMode
  );

  const current = filteredProfiles[currentIndex % Math.max(1, filteredProfiles.length)];

  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    if (!current) return;
    setHistory((prev) => [...prev, currentIndex]);

    if (direction === 'right' || direction === 'super') {
      // Simulate mutual match
      setMatchedProfile(current);
      setMatchModalVisible(true);
    } else {
      setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
    }
  };

  const handleRewind = () => {
    if (history.length === 0) {
      Alert.alert('No More Undos', 'You are at the start of your swipe history.');
      return;
    }
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(last);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={{ fontSize: 16 }}>💖</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>PairUp ✨</Text>
              <Text style={styles.headerSubtitle}>Discover • Connect • Belong</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.filterBtn} onPress={() => {}}>
            <Text style={{ fontSize: 16 }}>⚡ 480+ Online</Text>
          </TouchableOpacity>
        </View>

        {/* Deck Mode Tabs */}
        <View style={styles.modeTabsRow}>
          {(['ALL', 'DATING', 'FRIENDSHIP'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeTab, deckMode === m && styles.modeTabActive]}
              onPress={() => {
                setDeckMode(m);
                setCurrentIndex(0);
              }}
            >
              <Text style={[styles.modeTabText, deckMode === m && styles.modeTabTextActive]}>
                {m === 'ALL' ? 'Explore All ✨' : m === 'DATING' ? 'Dating Deck 💖' : 'Friendship Deck 🫶'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card Deck View */}
      <View style={styles.cardContainer}>
        {current ? (
          <View style={styles.card}>
            <Image source={{ uri: current.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay} />

            {/* Mode badge */}
            <View style={styles.cardModeBadge}>
              <Text style={styles.cardModeText}>
                {current.mode === 'DATING' ? '💖 Romantic Spark' : '🫶 True Friendship'}
              </Text>
            </View>

            {/* Distance badge */}
            <View style={styles.cardDistanceBadge}>
              <Text style={styles.cardDistanceText}>📍 ~{current.distance} km away</Text>
            </View>

            {/* Profile Info Overlay */}
            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>
                  {current.name}, {current.age}
                </Text>
                <View style={styles.verifiedDot}>
                  <Text style={{ fontSize: 12 }}>✓</Text>
                </View>
              </View>

              <Text style={styles.locationText}>{current.city}</Text>

              <Text style={styles.bioText} numberOfLines={3}>
                {current.bio}
              </Text>

              <View style={styles.tagsContainer}>
                {current.interests.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>💫</Text>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptyDesc}>
              Expand your search radius in Nearby or check out the Live Voice Stages.
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Rewind */}
        <TouchableOpacity
          onPress={handleRewind}
          style={[styles.actionButton, styles.rewindButton]}
        >
          <Text style={styles.rewindText}>↺</Text>
        </TouchableOpacity>

        {/* Pass */}
        <TouchableOpacity
          onPress={() => handleSwipe('left')}
          style={[styles.actionButton, styles.passButton]}
        >
          <Text style={styles.passText}>✕</Text>
        </TouchableOpacity>

        {/* Super Like */}
        <TouchableOpacity
          onPress={() => handleSwipe('super')}
          style={[styles.actionButton, styles.superButton]}
        >
          <Text style={styles.superText}>★</Text>
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity
          onPress={() => handleSwipe('right')}
          style={[styles.actionButton, styles.likeButton]}
        >
          <Text style={styles.likeText}>💖</Text>
        </TouchableOpacity>
      </View>

      {/* ================================================================= */}
      {/* MUTUAL MATCH CELEBRATION MODAL */}
      {/* ================================================================= */}
      <Modal visible={matchModalVisible} animationType="slide" transparent>
        <View style={styles.matchModalBackdrop}>
          <View style={styles.matchModalCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🎉</Text>
            <Text style={styles.matchCelebrationTitle}>IT'S A MUTUAL MATCH!</Text>
            <Text style={styles.matchCelebrationSubtitle}>
              You and {matchedProfile?.name} both expressed interest!
            </Text>

            {/* Profile Avatars Connection */}
            <View style={styles.matchedAvatarsRow}>
              <View style={styles.matchedAvatarWrap}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' }}
                  style={styles.matchedAvatarImg}
                />
              </View>
              <View style={styles.heartConnector}>
                <Text style={{ fontSize: 20 }}>💖</Text>
              </View>
              <View style={styles.matchedAvatarWrap}>
                <Image
                  source={{ uri: matchedProfile?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }}
                  style={styles.matchedAvatarImg}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.sendMessageMatchBtn}
              onPress={() => {
                setMatchModalVisible(false);
                setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
                router.push('/(tabs)/chat');
              }}
            >
              <Text style={styles.sendMessageMatchText}>Send a Message 💬</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keepSwipingBtn}
              onPress={() => {
                setMatchModalVisible(false);
                setCurrentIndex((prev) => (prev + 1) % filteredProfiles.length);
              }}
            >
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E7EF'
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: '#FF4F81',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#7C3AED'
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#6B6684',
    fontWeight: '600'
  },
  filterBtn: {
    backgroundColor: '#FFF1F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1DF'
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  modeTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  modeTabActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED'
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6684'
  },
  modeTabTextActive: {
    color: '#FFFFFF'
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: width - 32,
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#242039',
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36, 32, 57, 0.25)'
  },
  cardModeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(255, 79, 129, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  cardModeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  cardDistanceBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(36, 32, 57, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  cardDistanceText: {
    color: '#FF8A5B',
    fontSize: 11,
    fontWeight: '700'
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: 'rgba(36, 32, 57, 0.82)'
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  nameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  verifiedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationText: {
    fontSize: 12,
    color: '#FF8A5B',
    marginTop: 2,
    fontWeight: '700'
  },
  bioText: {
    fontSize: 12,
    color: '#F8F7FF',
    marginTop: 6,
    lineHeight: 17
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  tagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  emptyCard: {
    width: width - 32,
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#242039'
  },
  emptyDesc: {
    fontSize: 12,
    color: '#6B6684',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12
  },
  actionButton: {
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3
  },
  rewindButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#FF8A5B'
  },
  rewindText: {
    fontSize: 20,
    color: '#FF8A5B',
    fontWeight: '900'
  },
  passButton: {
    width: 58,
    height: 58,
    borderWidth: 1.5,
    borderColor: '#FF4F81'
  },
  passText: {
    fontSize: 24,
    color: '#FF4F81',
    fontWeight: '900'
  },
  superButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#38BDF8'
  },
  superText: {
    fontSize: 20,
    color: '#38BDF8'
  },
  likeButton: {
    width: 68,
    height: 68,
    backgroundColor: '#7C3AED'
  },
  likeText: {
    fontSize: 26
  },
  matchModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(36, 32, 57, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  matchModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#242039',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 79, 129, 0.4)'
  },
  matchCelebrationTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF4F81',
    marginTop: 8
  },
  matchCelebrationSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 6
  },
  matchedAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24
  },
  matchedAvatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF4F81',
    overflow: 'hidden'
  },
  matchedAvatarImg: {
    width: '100%',
    height: '100%'
  },
  heartConnector: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -12,
    zIndex: 10,
    elevation: 3
  },
  sendMessageMatchBtn: {
    backgroundColor: '#FF4F81',
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center'
  },
  sendMessageMatchText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  keepSwipingBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8
  },
  keepSwipingText: {
    color: '#A39EB8',
    fontSize: 12,
    fontWeight: '700'
  }
});
