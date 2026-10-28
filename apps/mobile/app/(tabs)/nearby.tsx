import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

interface NearbyProfile {
  id: string;
  displayName: string;
  age: number;
  city: string;
  distanceKm: number;
  bio: string;
  interests: string[];
  photoUrl: string;
  isOnline: boolean;
}

const MOCK_NEARBY_PROFILES: NearbyProfile[] = [
  {
    id: 'nb_1',
    displayName: 'Ananya Verma',
    age: 26,
    city: 'Mumbai',
    distanceKm: 2.4,
    bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee in Bandra.',
    interests: ['☕ Coffee', '🎨 Art', '📷 Photography'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    isOnline: true
  },
  {
    id: 'nb_2',
    displayName: 'Aarav Sharma',
    age: 28,
    city: 'Mumbai',
    distanceKm: 4.1,
    bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food.',
    interests: ['🏔️ Trekking', '☕ Cafes', '🏸 Badminton'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    isOnline: true
  },
  {
    id: 'nb_3',
    displayName: 'Priya Patel',
    age: 25,
    city: 'Mumbai',
    distanceKm: 6.8,
    bio: 'Writer, classical dancer, and indie film enthusiast. Looking for genuine conversation.',
    interests: ['📚 Reading', '🎬 Indie Films', '🧘 Yoga'],
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    isOnline: false
  },
  {
    id: 'nb_4',
    displayName: 'Rohan Mehra',
    age: 29,
    city: 'Mumbai',
    distanceKm: 8.5,
    bio: 'Software engineer by day, acoustic guitarist by night. Exploring quiet spots in the city.',
    interests: ['🎸 Guitar', '💻 Tech', '🐶 Dogs'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    isOnline: true
  }
];

export default function NearbyScreen() {
  const [profiles, setProfiles] = useState<NearbyProfile[]>(MOCK_NEARBY_PROFILES);
  const [radiusKm, setRadiusKm] = useState(25);
  const [locationStatus, setLocationStatus] = useState('Proximity Masking Active 📍');
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [wavedMap, setWavedMap] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'radar'>('radar');
  const [selectedRadarProfile, setSelectedRadarProfile] = useState<NearbyProfile | null>(null);

  const requestLocationSync = async () => {
    setIsLoadingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('GPS access denied. Using approximate city zone.');
        setIsLoadingGps(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocationStatus(`GPS Synchronized • ${loc.coords.latitude.toFixed(2)}, ${loc.coords.longitude.toFixed(2)} (Masked)`);
      Alert.alert(
        'Location Synchronized',
        'Your device location has been updated. Distance is masked by ~3km to preserve your safety and privacy.'
      );
    } catch (err: any) {
      setLocationStatus('Location synced with default city zone.');
    } finally {
      setIsLoadingGps(false);
    }
  };

  const handleWave = (profileId: string, name: string) => {
    setWavedMap((prev) => ({ ...prev, [profileId]: true }));
    Alert.alert('Wave Sent! 👋', `You sent a wave to ${name}. If they wave back, a conversation will unlock.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.badgeText}>LIVE PROXIMITY RADAR</Text>
          </View>
          <Text style={styles.title}>Nearby Discoveries</Text>
        </View>

        <TouchableOpacity
          style={styles.gpsButton}
          onPress={requestLocationSync}
          disabled={isLoadingGps}
        >
          {isLoadingGps ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.gpsButtonText}>📍 Sync GPS</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Activity Surge Alert Banner */}
      <View style={styles.surgeBanner}>
        <Text style={styles.surgeIcon}>⚡</Text>
        <View style={styles.surgeContent}>
          <Text style={styles.surgeTitle}>Activity Surge Active (2.4x Multiplier)</Text>
          <Text style={styles.surgeSubtitle}>
            480+ members nearby in your area right now! Replies are 2x faster.
          </Text>
        </View>
      </View>

      {/* Radius Filter Bar & View Toggle */}
      <View style={styles.filterBar}>
        <View style={styles.radiusRow}>
          <Text style={styles.radiusLabel}>Radius:</Text>
          {[5, 10, 25, 50].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.radiusChip, radiusKm === r && styles.radiusChipActive]}
              onPress={() => setRadiusKm(r)}
            >
              <Text
                style={[
                  styles.radiusChipText,
                  radiusKm === r && styles.radiusChipTextActive
                ]}
              >
                {r} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.viewToggleBtn}
          onPress={() => setViewMode(viewMode === 'radar' ? 'grid' : 'radar')}
        >
          <Text style={styles.viewToggleText}>
            {viewMode === 'radar' ? '🗂️ Grid' : '📡 Radar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* RADAR PULSE VIEW */}
        {viewMode === 'radar' && (
          <View style={styles.radarCard}>
            <Text style={styles.radarHeader}>Proximity Radar ({radiusKm} km scope)</Text>
            <View style={styles.radarScope}>
              {/* Concentric rings */}
              <View style={[styles.radarRing, { width: 280, height: 280 }]} />
              <View style={[styles.radarRing, { width: 210, height: 210 }]} />
              <View style={[styles.radarRing, { width: 140, height: 140 }]} />
              <View style={[styles.radarRing, { width: 70, height: 70 }]} />

              {/* Center user dot */}
              <View style={styles.centerUserDot}>
                <Text style={{ fontSize: 16 }}>📍</Text>
              </View>

              {/* Member Blips plotted on radar */}
              {profiles.map((p, idx) => {
                const angle = (idx * (360 / profiles.length) + 40) * (Math.PI / 180);
                const distRatio = 0.3 + (Math.min(p.distanceKm, radiusKm) / radiusKm) * 0.55;
                const x = Math.cos(angle) * distRatio * 130;
                const y = Math.sin(angle) * distRatio * 130;

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.blipContainer,
                      { transform: [{ translateX: x }, { translateY: y }] }
                    ]}
                    onPress={() => setSelectedRadarProfile(p)}
                  >
                    <Image source={{ uri: p.photoUrl }} style={styles.blipImage} />
                    {wavedMap[p.id] && <Text style={styles.blipWavedBadge}>💖</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Profile Preview Popover */}
            {selectedRadarProfile ? (
              <View style={styles.previewCard}>
                <Image
                  source={{ uri: selectedRadarProfile.photoUrl }}
                  style={styles.previewImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.previewName}>
                    {selectedRadarProfile.displayName}, {selectedRadarProfile.age}
                  </Text>
                  <Text style={styles.previewDistance}>
                    ~{selectedRadarProfile.distanceKm} km away • {selectedRadarProfile.city}
                  </Text>
                  <Text style={styles.previewBio} numberOfLines={1}>
                    {selectedRadarProfile.bio}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.previewWaveBtn,
                    wavedMap[selectedRadarProfile.id] && styles.previewWaveBtnActive
                  ]}
                  onPress={() => handleWave(selectedRadarProfile.id, selectedRadarProfile.displayName)}
                >
                  <Text style={styles.previewWaveText}>
                    {wavedMap[selectedRadarProfile.id] ? 'Waved 💖' : 'Wave 👋'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.radarHint}>
                💡 Tap any nearby member avatar on the radar to view info & send a wave!
              </Text>
            )}
          </View>
        )}

        {/* GRID VIEW */}
        <Text style={styles.sectionTitle}>Verified Nearby Members ({profiles.length})</Text>

        <View style={styles.grid}>
          {profiles.map((p) => {
            const hasWaved = wavedMap[p.id];

            return (
              <View key={p.id} style={styles.card}>
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: p.photoUrl }} style={styles.cardImage} />
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>~{p.distanceKm} km away</Text>
                  </View>
                  {p.isOnline && <View style={styles.onlineBadge} />}
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>
                    {p.displayName}, {p.age}
                  </Text>
                  <Text style={styles.cardCity}>{p.city}</Text>

                  <Text style={styles.cardBio} numberOfLines={2}>
                    {p.bio}
                  </Text>

                  <View style={styles.interestsRow}>
                    {p.interests.map((int, i) => (
                      <View key={i} style={styles.interestPill}>
                        <Text style={styles.interestText}>{int}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.waveButton, hasWaved && styles.waveButtonActive]}
                    onPress={() => handleWave(p.id, p.displayName)}
                  >
                    <Text style={[styles.waveButtonText, hasWaved && styles.waveButtonTextActive]}>
                      {hasWaved ? 'Wave Sent 💖' : 'Send Wave 👋'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Location Security Notice */}
        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>🔒 Location Masking Protected</Text>
          <Text style={styles.securityDesc}>
            PairUp generalizes all GPS coordinates to an approximate ~3–5km zone. Your precise location is never shared with other users.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
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
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16845B'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16845B',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#242039',
    marginTop: 2
  },
  gpsButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14
  },
  gpsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  surgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F5',
    borderWidth: 1,
    borderColor: '#FFD1DF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 18
  },
  surgeIcon: {
    fontSize: 22,
    marginRight: 10
  },
  surgeContent: {
    flex: 1
  },
  surgeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF4F81'
  },
  surgeSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#242039',
    marginRight: 4
  },
  radiusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  radiusChipActive: {
    backgroundColor: '#FF4F81',
    borderColor: '#FF4F81'
  },
  radiusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6684'
  },
  radiusChipTextActive: {
    color: '#FFFFFF'
  },
  viewToggleBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  viewToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  radarCard: {
    backgroundColor: '#242039',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20
  },
  radarHeader: {
    color: '#16845B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10
  },
  radarScope: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  centerUserDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  blipContainer: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FF4F81',
    overflow: 'hidden'
  },
  blipImage: {
    width: '100%',
    height: '100%'
  },
  blipWavedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 10
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    borderRadius: 18,
    marginTop: 14,
    width: '100%'
  },
  previewImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FF4F81'
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  previewDistance: {
    color: '#FF8A5B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1
  },
  previewBio: {
    color: '#D8D5E5',
    fontSize: 10,
    marginTop: 2
  },
  previewWaveBtn: {
    backgroundColor: '#FF4F81',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12
  },
  previewWaveBtnActive: {
    backgroundColor: '#16845B'
  },
  previewWaveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  radarHint: {
    color: '#9C96B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#242039',
    marginBottom: 12
  },
  grid: {
    gap: 16
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  cardImageContainer: {
    height: 220,
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%'
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(36, 32, 57, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  onlineBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16845B',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  cardBody: {
    padding: 16
  },
  cardName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#242039'
  },
  cardCity: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 1
  },
  cardBio: {
    fontSize: 12,
    color: '#6B6684',
    marginTop: 8,
    lineHeight: 18
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12
  },
  interestPill: {
    backgroundColor: '#F8F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  interestText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#242039'
  },
  waveButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14
  },
  waveButtonActive: {
    backgroundColor: '#16845B'
  },
  waveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  waveButtonTextActive: {
    color: '#FFFFFF'
  },
  securityBox: {
    backgroundColor: '#F0EAFD',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF'
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED'
  },
  securityDesc: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 4,
    lineHeight: 16
  }
});
