import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const demoProfiles = [
    {
      id: '1',
      name: 'Ananya Verma',
      age: 26,
      city: 'Mumbai',
      distance: 3.5,
      bio: 'Architect, plant mom & amateur photographer. Let’s talk about design, vinyl records, or the best pasta in Bandra.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      interests: ['☕ Cafes', '🎨 Contemporary Art', '📷 Photography']
    },
    {
      id: '2',
      name: 'Aarav Sharma',
      age: 28,
      city: 'Mumbai',
      distance: 4.2,
      bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      interests: ['🏔️ Trekking', '🏸 Badminton', '💻 Tech']
    }
  ];

  const handleSwipe = (direction: string) => {
    setCurrentIndex((prev) => (prev + 1) % demoProfiles.length);
  };

  const current = demoProfiles[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PairUp AI 💖</Text>
        <Text style={styles.headerSubtitle}>Discover Nearby Matches</Text>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Image source={{ uri: current.image }} style={styles.cardImage} />
          <View style={styles.cardOverlay} />

          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>
              {current.name}, {current.age}
            </Text>
            <Text style={styles.locationText}>
              📍 {current.city} • ~{current.distance} km away
            </Text>
            <Text style={styles.bioText} numberOfLines={2}>
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
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => handleSwipe('left')}
          style={[styles.actionButton, styles.passButton]}
        >
          <Text style={styles.passText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSwipe('super')}
          style={[styles.actionButton, styles.superButton]}
        >
          <Text style={styles.superText}>★</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSwipe('right')}
          style={[styles.actionButton, styles.likeButton]}
        >
          <Text style={styles.likeText}>💖</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C3AED'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B6684',
    marginTop: 2
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
    backgroundColor: 'rgba(36, 32, 57, 0.35)'
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(36, 32, 57, 0.75)'
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  locationText: {
    fontSize: 13,
    color: '#FF8A5B',
    marginTop: 4,
    fontWeight: '600'
  },
  bioText: {
    fontSize: 13,
    color: '#F8F7FF',
    marginTop: 8,
    lineHeight: 18
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  tagText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  passButton: {
    borderWidth: 1,
    borderColor: '#FF4F81'
  },
  passText: {
    fontSize: 24,
    color: '#FF4F81',
    fontWeight: '900'
  },
  superButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#38BDF8',
    borderWidth: 1
  },
  superText: {
    fontSize: 22,
    color: '#38BDF8'
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7C3AED'
  },
  likeText: {
    fontSize: 28
  }
});
