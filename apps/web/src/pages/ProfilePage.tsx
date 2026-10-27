import React, { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Camera,
  Heart,
  Plus,
  Save,
  Trash2,
  UserCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { ConnectionMode, Gender, RelationshipIntention } from '@pairup/domain-types';

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();

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

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio || '');
      setGender(profile.gender);
      setPronouns(profile.pronouns || '');
      setIntention(profile.relationshipIntention);
      setMode(profile.connectionMode);
      setCity(profile.city || 'Mumbai');
      setOccupation(profile.occupation || '');
      setEducation(profile.education || '');
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage('');

    try {
      await apiClient.updateProfile({
        displayName,
        bio,
        gender,
        pronouns,
        relationshipIntention: intention,
        connectionMode: mode,
        city,
        occupation,
        education
      });
      await refreshProfile();
      setSavedMessage('Profile updated successfully! ✨');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (err: any) {
      setSavedMessage('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    try {
      // In local dev, send url to photo endpoint
      await apiClient.uploadPhoto(new Blob()); // fallback
      setShowAddPhoto(false);
      setNewPhotoUrl('');
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink flex items-center gap-2">
            <span>My Profile & Photos</span>
            {profile?.verificationStatus === 'VERIFIED' && (
              <BadgeCheck className="w-5 h-5 text-sky-500 fill-sky-500/20" />
            )}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage your public presentation and discovery settings
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-violet">
            {profile?.completenessScore || 40}% Complete
          </span>
          <div className="w-24 h-2 rounded-full bg-cloud overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-coral to-violet"
              style={{ width: `${profile?.completenessScore || 40}%` }}
            />
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-successGreenLight border border-successGreen/30 text-successGreen text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Photo Gallery Grid */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-bold text-ink uppercase tracking-wider">
            Profile Photos ({profile?.photos?.length || 0} / 9)
          </h2>
          <button
            onClick={() => setShowAddPhoto(true)}
            className="px-3 py-1.5 rounded-xl bg-violet-light text-violet text-xs font-bold hover:bg-violet hover:text-white transition-all flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {profile?.photos?.map((photo, i) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-2xl overflow-hidden bg-cloud border border-borderSoft group"
            >
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
              {photo.isPrimary && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-coral text-white text-[10px] font-extrabold shadow-sm">
                  PRIMARY
                </span>
              )}
            </div>
          ))}

          {(!profile?.photos || profile.photos.length < 9) && (
            <button
              onClick={() => setShowAddPhoto(true)}
              className="aspect-square rounded-2xl border-2 border-dashed border-borderSoft hover:border-violet flex flex-col items-center justify-center text-ink-muted hover:text-violet transition-colors bg-cloud/50"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-bold">Upload</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
        <h2 className="text-sm font-display font-bold text-ink uppercase tracking-wider mb-2">
          Profile Details
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
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell potential matches about your passions, weekend hobbies, favourite food..."
            className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Relationship Intention
            </label>
            <select
              value={intention}
              onChange={(e) => setIntention(e.target.value as RelationshipIntention)}
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            >
              <option value="LONG_TERM">Long-term Relationship</option>
              <option value="DATING_TO_MARRY">Dating with intention to Marry</option>
              <option value="NEW_FRIENDS">New Friends</option>
              <option value="CASUAL">Casual Dating</option>
              <option value="ACTIVITY_PARTNER">Activity / Travel Partner</option>
              <option value="NOT_SURE_YET">Open to possibilities</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Discovery Connection Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as ConnectionMode)}
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            >
              <option value="BOTH">Both Dating & Friendship 💖🫶</option>
              <option value="DATING">Romantic Dating Only 💖</option>
              <option value="FRIENDSHIP">Friendship Only 🫶</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Occupation
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Architect"
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
              Education
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. CEPT University"
              className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium focus:border-violet focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-coral to-violet text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
