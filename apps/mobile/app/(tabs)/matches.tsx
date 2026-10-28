import React, { useState } from 'react';
import {
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
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface MatchItem {
  id: string;
  name: string;
  age: number;
  city: string;
  photoUrl: string;
  matchedTime: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline: boolean;
  mode: 'DATING' | 'FRIENDSHIP';
}

const MOCK_NEW_MATCHES: MatchItem[] = [
  {
    id: 'm_1',
    name: 'Ananya',
    age: 26,
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    matchedTime: '10m ago',
    isOnline: true,
    mode: 'DATING'
  },
  {
    id: 'm_2',
    name: 'Aarav',
    age: 28,
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    matchedTime: '1h ago',
    isOnline: true,
    mode: 'FRIENDSHIP'
  },
  {
    id: 'm_3',
    name: 'Diya',
    age: 24,
    city: 'Bengaluru',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    matchedTime: '3h ago',
    isOnline: false,
    mode: 'DATING'
  },
  {
    id: 'm_4',
    name: 'Kabir',
    age: 27,
    city: 'Pune',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    matchedTime: 'Yesterday',
    isOnline: false,
    mode: 'FRIENDSHIP'
  }
];

const MOCK_ACTIVE_CONVERSATIONS: MatchItem[] = [
  {
    id: 'c_1',
    name: 'Ananya Verma',
    age: 26,
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    matchedTime: '12m ago',
    lastMessage: '🎙️ Voice Note (14s) • Settle the filter coffee debate!',
    unreadCount: 1,
    isOnline: true,
    mode: 'DATING'
  },
  {
    id: 'c_2',
    name: 'Aarav Sharma',
    age: 28,
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    matchedTime: '2h ago',
    lastMessage: 'Are you joining the Indie Vinyl voice stage tonight?',
    unreadCount: 0,
    isOnline: true,
    mode: 'FRIENDSHIP'
  },
  {
    id: 'c_3',
    name: 'Priya Patel',
    age: 25,
    city: 'Mumbai',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    matchedTime: '1d ago',
    lastMessage: 'Shared a photo: Cafe Vista ☕',
    unreadCount: 0,
    isOnline: false,
    mode: 'DATING'
  }
];

export default function MatchesScreen() {
  const router = useRouter();
  const [filterMode, setFilterMode] = useState<'ALL' | 'DATING' | 'FRIENDSHIP'>('ALL');

  const filteredMatches = MOCK_NEW_MATCHES.filter((m) =>
    filterMode === 'ALL' ? true : m.mode === filterMode
  );

  const filteredConversations = MOCK_ACTIVE_CONVERSATIONS.filter((c) =>
    filterMode === 'ALL' ? true : c.mode === filterMode
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Matches & Sparks</Text>
          <Text style={styles.headerSubtitle}>
            {MOCK_NEW_MATCHES.length} new sparks • {MOCK_ACTIVE_CONVERSATIONS.length} active chats
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'DATING', 'FRIENDSHIP'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.filterChip, filterMode === m && styles.filterChipActive]}
              onPress={() => setFilterMode(m)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterMode === m && styles.filterChipTextActive
                ]}
              >
                {m === 'ALL' ? 'All ✨' : m === 'DATING' ? 'Dating 💖' : 'Friends 🫶'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Likes Received Gold Teaser */}
        <View style={styles.goldBanner}>
          <View style={styles.goldBadge}>
            <Text style={{ fontSize: 18 }}>⭐</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.goldTitle}>14 People Liked Your Profile!</Text>
            <Text style={styles.goldSubtitle}>
              Unlock PairUp Gold to see who liked you and match instantly without waiting.
            </Text>
          </View>
          <TouchableOpacity style={styles.goldButton}>
            <Text style={styles.goldButtonText}>See Likes</Text>
          </TouchableOpacity>
        </View>

        {/* New Matches Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Mutual Matches</Text>
          <Text style={styles.sectionBadge}>{filteredMatches.length} New</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newMatchesList}>
          {filteredMatches.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newMatchCard}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <View style={styles.matchAvatarRing}>
                <Image source={{ uri: item.photoUrl }} style={styles.matchAvatar} />
                {item.isOnline && <View style={styles.onlineDot} />}
                <View style={styles.modeIconBadge}>
                  <Text style={{ fontSize: 10 }}>{item.mode === 'DATING' ? '💖' : '🫶'}</Text>
                </View>
              </View>
              <Text style={styles.matchName}>{item.name}</Text>
              <Text style={styles.matchTime}>{item.matchedTime}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversations Stream */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Messages & Audio Streams</Text>
          <Text style={styles.sectionBadge}>Encrypted</Text>
        </View>

        <View style={styles.conversationsList}>
          {filteredConversations.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.convCard}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <View style={styles.convAvatarContainer}>
                <Image source={{ uri: item.photoUrl }} style={styles.convAvatar} />
                {item.isOnline && <View style={styles.onlineDotConv} />}
              </View>

              <View style={styles.convContent}>
                <View style={styles.convTopRow}>
                  <Text style={styles.convName}>
                    {item.name}, {item.age}
                  </Text>
                  <Text style={styles.convTime}>{item.matchedTime}</Text>
                </View>

                <Text
                  style={[
                    styles.convLastMessage,
                    item.unreadCount ? styles.convLastMessageUnread : null
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
              </View>

              {item.unreadCount ? (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E7EF'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#242039'
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F8F7FF',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  filterChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED'
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6684'
  },
  filterChipTextActive: {
    color: '#FFFFFF'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  goldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE58F',
    padding: 14,
    borderRadius: 20,
    marginBottom: 20
  },
  goldBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD54F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  goldTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9E6A00'
  },
  goldSubtitle: {
    fontSize: 10,
    color: '#8C733E',
    marginTop: 2,
    lineHeight: 14
  },
  goldButton: {
    backgroundColor: '#FFA000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 6
  },
  goldButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#242039'
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#F0EAFD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  newMatchesList: {
    marginBottom: 10
  },
  newMatchCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 72
  },
  matchAvatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#FF4F81',
    padding: 2,
    position: 'relative'
  },
  matchAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16845B',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  modeIconBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 1,
    elevation: 2
  },
  matchName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#242039',
    marginTop: 6
  },
  matchTime: {
    fontSize: 10,
    color: '#6B6684',
    marginTop: 1
  },
  conversationsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8E7EF',
    overflow: 'hidden'
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6'
  },
  convAvatarContainer: {
    position: 'relative',
    marginRight: 12
  },
  convAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  onlineDotConv: {
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
  convContent: {
    flex: 1
  },
  convTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  convName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#242039'
  },
  convTime: {
    fontSize: 10,
    color: '#6B6684'
  },
  convLastMessage: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 3
  },
  convLastMessageUnread: {
    fontWeight: '800',
    color: '#242039'
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4F81',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900'
  }
});
