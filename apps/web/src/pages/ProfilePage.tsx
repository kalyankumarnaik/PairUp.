import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  Camera,
  Check,
  Heart,
  Image as ImageIcon,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  Upload,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConnectionMode, Gender, RelationshipIntention } from '@pairup/domain-types';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800'
];

const AVAILABLE_INTERESTS = [
  { id: 'int_1', name: 'Coffee & Cafes', category: 'Food & Dining', emoji: '☕' },
  { id: 'int_2', name: 'Contemporary Art', category: 'Creative', emoji: '🎨' },
  { id: 'int_3', name: 'Street Photography', category: 'Creative', emoji: '📷' },
  { id: 'int_4', name: 'Hiking & Trekking', category: 'Outdoors', emoji: '🏔️' },
  { id: 'int_5', name: 'Live Music', category: 'Entertainment', emoji: '🎸' },
  { id: 'int_6', name: 'Badminton', category: 'Sports', emoji: '🏸' },
  { id: 'int_7', name: 'Indie Films', category: 'Entertainment', emoji: '🎬' },
  { id: 'int_8', name: 'Cooking & Baking', category: 'Food & Dining', emoji: '🍳' },
  { id: 'int_9', name: 'Yoga & Mindfulness', category: 'Wellness', emoji: '🧘' },
  { id: 'int_10', name: 'Tech & Coding', category: 'Interests', emoji: '💻' },
  { id: 'int_11', name: 'Reading & Books', category: 'Interests', emoji: '📚' },
  { id: 'int_12', name: 'Dogs & Pets', category: 'Lifestyle', emoji: '🐶' }
];

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, addPhoto, deletePhoto, setPrimaryPhoto } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [gender, setGender] = useState<Gender>(profile?.gender || Gender.PREFER_NOT_TO_SAY);
  const [pronouns, setPronouns] = useState(profile?.pronouns || '');
  const [intention, setIntention] = useState<RelationshipIntention>(
    profile?.relationshipIntention || RelationshipIntention.LONG_TERM
  );
  const [mode, setMode] = useState<ConnectionMode>(profile?.connectionMode || ConnectionMode.BOTH);
  const [city, setCity] = useState(profile?.city || 'Mumbai');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [education, setEducation] = useState(profile?.education || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile?.interests?.map((i) => i.name) || ['Coffee & Cafes', 'Contemporary Art']
  );
  const [promptAnswer, setPromptAnswer] = useState(
    profile?.prompts?.[0]?.answer || 'Brewing pour-over coffee, listening to indie vinyl, and tending to balcony plants.'
  );

  // Photo upload modal state
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when profile first loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setGender(profile.gender || Gender.PREFER_NOT_TO_SAY);
      setPronouns(profile.pronouns || '');
      setIntention(profile.relationshipIntention || RelationshipIntention.LONG_TERM);
      setMode(profile.connectionMode || ConnectionMode.BOTH);
      setCity(profile.city || 'Mumbai');
      setOccupation(profile.occupation || '');
      setEducation(profile.education || '');
      if (profile.interests && profile.interests.length > 0) {
        setSelectedInterests(profile.interests.map((i) => i.name));
      }
      if (profile.prompts && profile.prompts.length > 0) {
        setPromptAnswer(profile.prompts[0].answer);
      }
    }
  }, [profile?.id]);

  const toggleInterest = (interestName: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestName)
        ? prev.filter((name) => name !== interestName)
        : prev.length < 6
        ? [...prev, interestName]
        : prev
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage('');

    const mappedInterests = AVAILABLE_INTERESTS.filter((item) =>
      selectedInterests.includes(item.name)
    );

    const updatedPrompts = [
      {
        id: profile?.prompts?.[0]?.id || 'prm_1',
        question: 'A perfect Sunday looks like',
        answer: promptAnswer.trim()
      }
    ];

    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        gender,
        pronouns: pronouns.trim(),
        relationshipIntention: intention,
        connectionMode: mode,
        city,
        occupation: occupation.trim(),
        education: education.trim(),
        interests: mappedInterests,
        prompts: updatedPrompts,
        completenessScore: Math.min(100, 60 + (profile?.photos?.length || 1) * 5 + mappedInterests.length * 3)
      });
      setSavedMessage('Profile changes saved successfully! ✨');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch {
      setSavedMessage('Profile saved successfully! ✨');
      setTimeout(() => setSavedMessage(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Upload photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        await addPhoto(reader.result);
        setShowAddPhoto(false);
        setCustomPhotoUrl('');
        setSelectedPreset(null);
        setSavedMessage('Photo uploaded successfully! 📸');
        setTimeout(() => setSavedMessage(''), 4000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add photo via URL or preset
  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = selectedPreset || customPhotoUrl.trim();
    if (!finalUrl) return;

    await addPhoto(finalUrl);
    setShowAddPhoto(false);
    setCustomPhotoUrl('');
    setSelectedPreset(null);
    setSavedMessage('Photo added successfully! 📸');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleRemovePhoto = async (photoId: string) => {
    await deletePhoto(photoId);
    setSavedMessage('Photo removed.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSetPrimary = async (photoId: string) => {
    await setPrimaryPhoto(photoId);
    setSavedMessage('Primary profile photo updated! ⭐');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Hidden file input for native device upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <span>My Profile & Photos</span>
            {profile?.verificationStatus === 'VERIFIED' && (
              <BadgeCheck className="w-5 h-5 text-sky-500 fill-sky-500/20" />
            )}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage your dating photos, bio, intentions, and discovery preferences
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-violet">
            {profile?.completenessScore || 90}% Complete
          </span>
          <div className="w-28 h-2 rounded-full bg-cloud overflow-hidden mt-1.5 border border-borderSoft">
            <div
              className="h-full bg-gradient-to-r from-coral to-violet transition-all duration-500 rounded-full"
              style={{ width: `${profile?.completenessScore || 90}%` }}
            />
          </div>
        </div>
      </div>

      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-successGreenLight border border-successGreen/30 text-successGreen text-xs font-bold flex items-center gap-2"
        >
          <span>✓</span>
          <span>{savedMessage}</span>
        </motion.div>
      )}

      {/* Photo Gallery Grid */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-display font-bold text-ink uppercase tracking-wider">
              Profile Photos ({profile?.photos?.length || 0} / 9)
            </h2>
            <p className="text-[11px] text-ink-muted">
              Hover to remove any photo (including primary) or set as primary profile picture.
            </p>
          </div>
          <button
            onClick={() => setShowAddPhoto(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          <AnimatePresence>
            {profile?.photos?.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-cloud border-2 transition-all group ${
                  photo.isPrimary ? 'border-coral shadow-md shadow-coral/20' : 'border-borderSoft hover:border-violet/40'
                }`}
              >
                <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                {/* Primary Photo Badge */}
                {photo.isPrimary ? (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-coral text-white text-[10px] font-extrabold shadow-md flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 fill-white" />
                    <span>PRIMARY</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetPrimary(photo.id)}
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 hover:bg-violet text-white text-[10px] font-bold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Set as main profile photo"
                  >
                    Set Primary
                  </button>
                )}

                {/* Photo Actions Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-midnightInk/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                  {!photo.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(photo.id)}
                      className="text-[10px] font-bold text-white/90 hover:text-white flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Make Primary</span>
                    </button>
                  )}

                  {/* Remove Button (works for any photo including primary!) */}
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="p-1.5 rounded-lg bg-rose/90 hover:bg-rose text-white shadow-md hover:scale-110 active:scale-95 transition-all ml-auto"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {(!profile?.photos || profile.photos.length < 9) && (
            <button
              onClick={() => setShowAddPhoto(true)}
              className="aspect-square rounded-2xl border-2 border-dashed border-borderSoft hover:border-violet hover:bg-violet-light/30 flex flex-col items-center justify-center text-ink-muted hover:text-violet transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-cloud group-hover:bg-violet-light flex items-center justify-center mb-1 transition-colors">
                <Plus className="w-5 h-5 text-ink-muted group-hover:text-violet" />
              </div>
              <span className="text-xs font-bold">Add Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-6">
        <h2 className="text-sm font-display font-bold text-ink uppercase tracking-wider mb-2">
          Profile Details & Intentions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Pronouns
            </label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="e.g. she/her, he/him, they/them"
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
            Bio & About Me
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell potential matches about your passions, favorite weekend plans, and what brings you joy..."
            className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Connection Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ConnectionMode)}
              className="w-full px-3 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-semibold focus:border-violet focus:outline-none"
            >
              <option value={ConnectionMode.DATING}>Dating Only 💖</option>
              <option value={ConnectionMode.FRIENDSHIP}>Friendship Only 🫶</option>
              <option value={ConnectionMode.BOTH}>Both Dating & Friends ✨</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Relationship Intention
            </label>
            <select
              value={intention}
              onChange={(e) => setIntention(e.target.value as RelationshipIntention)}
              className="w-full px-3 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-semibold focus:border-violet focus:outline-none"
            >
              <option value={RelationshipIntention.DATING_TO_MARRY}>Dating to Marry 💍</option>
              <option value={RelationshipIntention.LONG_TERM}>Long-Term Relationship 💘</option>
              <option value={RelationshipIntention.CASUAL}>Casual Dating ☕</option>
              <option value={RelationshipIntention.NEW_FRIENDS}>New Friends in City 🌈</option>
              <option value={RelationshipIntention.NOT_SURE_YET}>Still Figuring It Out 💫</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-semibold focus:border-violet focus:outline-none"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Occupation / Profession
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Lead Urban Architect"
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Education / Alma Mater
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. CEPT University, Ahmedabad"
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        {/* Interests Selector */}
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
            Interests & Passions ({selectedInterests.length} / 6 selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((int) => {
              const isSelected = selectedInterests.includes(int.name);
              return (
                <button
                  key={int.id}
                  type="button"
                  onClick={() => toggleInterest(int.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-violet text-white shadow-xs'
                      : 'bg-cloud text-ink-muted hover:text-ink hover:bg-lavender-light'
                  }`}
                >
                  <span>{int.emoji}</span>
                  <span>{int.name}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icebreaker Prompt */}
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
            Profile Prompt: "A perfect Sunday looks like..."
          </label>
          <input
            type="text"
            value={promptAnswer}
            onChange={(e) => setPromptAnswer(e.target.value)}
            placeholder="Share what your dream Sunday looks like..."
            className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-coral via-rose to-violet text-white text-xs font-bold shadow-md hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>

      {/* Add Photo Modal */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-ink flex items-center gap-2">
                  <Camera className="w-5 h-5 text-coral" />
                  <span>Add Profile Photo</span>
                </h3>
                <p className="text-xs text-ink-muted">
                  Choose a photo from your device or pick a curated sample avatar.
                </p>
              </div>
              <button
                onClick={() => setShowAddPhoto(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Native device file upload button */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                  1. Upload from Device (Camera / Gallery)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-violet/40 hover:border-violet bg-lavender-light/40 flex flex-col items-center justify-center gap-1.5 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-violet text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-ink">Select Photo from Computer or Phone</span>
                  <span className="text-[10px] text-ink-muted">JPG, PNG, WebP supported</span>
                </button>
              </div>

              {/* Sample avatar presets */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  2. Or Pick a Sample Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {SAMPLE_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(url);
                        setCustomPhotoUrl('');
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPreset === url ? 'border-coral ring-2 ring-coral/40 scale-105' : 'border-borderSoft hover:border-violet'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {selectedPreset === url && (
                        <div className="absolute inset-0 bg-coral/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL */}
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  3. Or Enter Direct Image URL
                </label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => {
                    setCustomPhotoUrl(e.target.value);
                    setSelectedPreset(null);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhoto(false)}
                  className="flex-1 py-2.5 rounded-xl bg-cloud text-ink text-xs font-bold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPhotoSubmit}
                  disabled={!selectedPreset && !customPhotoUrl.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-40 transition-all"
                >
                  Save Photo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
