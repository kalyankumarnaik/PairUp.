import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600'
];

interface MobilePhoto {
  id: string;
  url: string;
  isPrimary: boolean;
}

export default function MobileProfileScreen() {
  const [displayName, setDisplayName] = useState('Ananya Verma');
  const [bio, setBio] = useState(
    'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks in Bandra. Let’s talk about design, vinyl records, or the best pasta in Mumbai.'
  );
  const [pronouns, setPronouns] = useState('she/her');
  const [city, setCity] = useState('Mumbai');
  const [occupation, setOccupation] = useState('Lead Urban Architect');
  const [education, setEducation] = useState('CEPT University, Ahmedabad');
  const [mode, setMode] = useState<'DATING' | 'FRIENDSHIP' | 'BOTH'>('BOTH');
  const [promptAnswer, setPromptAnswer] = useState(
    'Brewing pour-over coffee, listening to indie vinyl, and tending to balcony plants.'
  );

  const [photos, setPhotos] = useState<MobilePhoto[]>([
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
      isPrimary: true
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
      isPrimary: false
    }
  ]);

  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([
    '☕ Coffee & Cafes',
    '🎨 Contemporary Art',
    '📷 Photography',
    '🏔️ Trekking'
  ]);

  const removePhoto = (id: string) => {
    const remaining = photos.filter((p) => p.id !== id);
    if (remaining.length > 0 && !remaining.some((p) => p.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    setPhotos(remaining);
    Alert.alert('Photo Removed', 'Profile gallery updated.');
  };

  const setPrimary = (id: string) => {
    setPhotos(
      photos.map((p) => ({
        ...p,
        isPrimary: p.id === id
      }))
    );
    Alert.alert('Primary Photo Updated ⭐', 'This photo will appear first on the swipe deck.');
  };

  const addPresetPhoto = (url: string) => {
    setShowAddPhotoModal(false);
    const newP: MobilePhoto = {
      id: `p_${Date.now()}`,
      url,
      isPrimary: photos.length === 0
    };
    setPhotos([...photos, newP]);
    Alert.alert('Photo Added 📸', 'Your new photo has been added to your profile gallery.');
  };

  const saveProfile = () => {
    Alert.alert('Profile Saved ✨', 'All profile details, photos, and preferences have been updated.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <Text style={styles.verifiedBadge}>✓ 18+ ADULT VERIFIED</Text>
          </View>
          <Text style={styles.headerTitle}>My Profile & Photos</Text>
        </View>

        <TouchableOpacity style={styles.saveHeaderBtn} onPress={saveProfile}>
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Completeness Bar */}
        <View style={styles.completenessCard}>
          <View style={styles.completenessTop}>
            <Text style={styles.completenessTitle}>Profile Strength</Text>
            <Text style={styles.completenessPct}>92% Complete</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '92%' }]} />
          </View>
          <Text style={styles.completenessTip}>
            Profiles with 4+ photos and 3 interests receive 3.5x more matches.
          </Text>
        </View>

        {/* Photos Gallery */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Profile Photos ({photos.length}/6)</Text>
            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={() => setShowAddPhotoModal(true)}
            >
              <Text style={styles.addPhotoBtnText}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.photosGrid}>
            {photos.map((p) => (
              <View key={p.id} style={styles.photoItem}>
                <Image source={{ uri: p.url }} style={styles.photoImg} />
                {p.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>★ PRIMARY</Text>
                  </View>
                )}

                <View style={styles.photoActionsRow}>
                  {!p.isPrimary && (
                    <TouchableOpacity
                      style={styles.makePrimaryBtn}
                      onPress={() => setPrimary(p.id)}
                    >
                      <Text style={styles.makePrimaryText}>Make Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deletePhotoBtn}
                    onPress={() => removePhoto(p.id)}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 10 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {photos.length < 6 && (
              <TouchableOpacity
                style={styles.emptySlot}
                onPress={() => setShowAddPhotoModal(true)}
              >
                <Text style={{ fontSize: 24 }}>📷</Text>
                <Text style={styles.emptySlotText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Profile Details Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DISPLAY NAME</Text>
            <TextInput
              style={styles.textInput}
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PRONOUNS</Text>
            <TextInput
              style={styles.textInput}
              value={pronouns}
              onChangeText={setPronouns}
              placeholder="e.g. she/her, he/him"
              placeholderTextColor="#A39EB8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>BIO & ABOUT ME</Text>
            <TextInput
              style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONNECTION MODE</Text>
            <View style={styles.modeRow}>
              {(['DATING', 'FRIENDSHIP', 'BOTH'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeChip, mode === m && styles.modeChipActive]}
                  onPress={() => setMode(m)}
                >
                  <Text style={[styles.modeChipText, mode === m && styles.modeChipTextActive]}>
                    {m === 'DATING' ? '💖 Dating' : m === 'FRIENDSHIP' ? '🫶 Friends' : '✨ Both'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CITY</Text>
            <TextInput
              style={styles.textInput}
              value={city}
              onChangeText={setCity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>OCCUPATION</Text>
            <TextInput
              style={styles.textInput}
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EDUCATION</Text>
            <TextInput
              style={styles.textInput}
              value={education}
              onChangeText={setEducation}
            />
          </View>
        </View>

        {/* Profile Prompt */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Profile Prompt</Text>
          <Text style={styles.promptQuestion}>"A perfect Sunday looks like..."</Text>
          <TextInput
            style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
            value={promptAnswer}
            onChangeText={setPromptAnswer}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBigBtn} onPress={saveProfile}>
          <Text style={styles.saveBigBtnText}>Save Profile Details ✨</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ADD PHOTO MODAL */}
      <Modal visible={showAddPhotoModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Profile Photo 📸</Text>
            <Text style={styles.modalSubtitle}>Pick a sample photo for testing:</Text>

            <View style={styles.avatarPickerGrid}>
              {SAMPLE_AVATARS.map((url, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.avatarOption}
                  onPress={() => addPresetPhoto(url)}
                >
                  <Image source={{ uri: url }} style={styles.avatarImg} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowAddPhotoModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  verifiedBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#242039',
    marginTop: 2
  },
  saveHeaderBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  completenessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  completenessTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  completenessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#242039'
  },
  completenessPct: {
    fontSize: 12,
    fontWeight: '900',
    color: '#7C3AED'
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0EFF6',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3
  },
  completenessTip: {
    fontSize: 10,
    color: '#6B6684',
    marginTop: 8
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#242039'
  },
  addPhotoBtn: {
    backgroundColor: '#FF4F81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  addPhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  photoItem: {
    width: (width - 32 - 32 - 10) / 2,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative'
  },
  photoImg: {
    width: '100%',
    height: '100%'
  },
  primaryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4F81',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  primaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  photoActionsRow: {
    position: 'absolute',
    bottom: 8,
    insetHorizontal: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  makePrimaryBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  makePrimaryText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  deletePhotoBtn: {
    backgroundColor: 'rgba(225, 29, 72, 0.85)',
    padding: 6,
    borderRadius: 8
  },
  emptySlot: {
    width: (width - 32 - 32 - 10) / 2,
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E7EF',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7FF'
  },
  emptySlotText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B6684',
    marginTop: 4
  },
  inputGroup: {
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B6684',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  textInput: {
    backgroundColor: '#F8F7FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: '#242039',
    borderWidth: 1,
    borderColor: '#E8E7EF',
    fontWeight: '600'
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8
  },
  modeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8F7FF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  modeChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED'
  },
  modeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B6684'
  },
  modeChipTextActive: {
    color: '#FFFFFF'
  },
  promptQuestion: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 8
  },
  saveBigBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8
  },
  saveBigBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#242039'
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2,
    marginBottom: 14
  },
  avatarPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  avatarOption: {
    width: (280 - 20) / 3,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  avatarImg: {
    width: '100%',
    height: '100%'
  },
  modalCancelBtn: {
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center'
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B6684'
  }
});
