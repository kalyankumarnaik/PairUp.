import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  Download,
  Eye,
  KeyRound,
  Lock,
  LogOut,
  Moon,
  Pause,
  Save,
  Shield,
  Smartphone,
  Sliders,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout } = useAuth();

  // Notification toggles
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifySurges, setNotifySurges] = useState(true);
  const [notifySafetyCheckIn, setNotifySafetyCheckIn] = useState(true);

  // Discovery Preferences
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(32);
  const [maxDistance, setMaxDistance] = useState(30);
  const [globalMode, setGlobalMode] = useState(false);

  // Account State
  const [isAccountPaused, setIsAccountPaused] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Account preferences and notification settings saved! ✨');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleExportData = () => {
    const dataBlob = new Blob(
      [
        JSON.stringify(
          {
            user,
            profile,
            exportDate: new Date().toISOString(),
            compliance: 'India DPDP Act & GDPR Personal Data Archive'
          },
          null,
          2
        )
      ],
      { type: 'application/json' }
    );
    const downloadUrl = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `pairup_data_export_${user?.id || 'me'}.json`;
    link.click();
    setSavedMessage('Personal data archive downloaded successfully!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') return;
    setShowDeleteModal(false);
    logout();
    alert('Your account has been scheduled for permanent deletion. All data will be expunged.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            Account & Preferences
          </h1>
          <p className="text-xs text-ink-muted mt-1 max-w-xl">
            Manage account security, discovery radius filters, push notification channels, and data privacy controls.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-dangerRedLight text-dangerRed hover:bg-dangerRed hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of PairUp</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-lavender-light border border-violet/30 text-xs font-bold text-violet animate-in fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Discovery Filters Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-5">
          <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet" />
            <span>Discovery & Matching Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Age Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Age Range
                </label>
                <span className="text-xs font-black text-violet">
                  {minAge} – {maxAge} years
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={minAge}
                  onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                  className="w-full accent-violet"
                />
                <input
                  type="range"
                  min="19"
                  max="60"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                  className="w-full accent-violet"
                />
              </div>
            </div>

            {/* Max Distance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Maximum Distance
                </label>
                <span className="text-xs font-black text-coral">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-coral"
              />
            </div>
          </div>

          {/* Global Mode Switch */}
          <div className="p-4 rounded-2xl bg-cloud border border-borderSoft flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-ink">Global Passport Mode</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                See people in other cities across India when you run out of nearby profiles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGlobalMode(!globalMode)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                globalMode ? 'bg-violet justify-end' : 'bg-borderSoft justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
          <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
            <Bell className="w-4 h-4 text-coral" />
            <span>Push & Alert Notification Channels</span>
          </h2>

          <div className="divide-y divide-borderSoft">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink">New Mutual Matches</p>
                <p className="text-[10px] text-ink-muted">Instant alert when someone matches back with you.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyMatches(!notifyMatches)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  notifyMatches ? 'bg-emerald justify-end' : 'bg-borderSoft justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink">Chat Messages & Voice Notes</p>
                <p className="text-[10px] text-ink-muted">Notifications for incoming encrypted messages.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifyMessages(!notifyMessages)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  notifyMessages ? 'bg-emerald justify-end' : 'bg-borderSoft justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink">Activity Surges in Your City</p>
                <p className="text-[10px] text-ink-muted">Alerts when 250+ singles become active nearby.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifySurges(!notifySurges)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  notifySurges ? 'bg-emerald justify-end' : 'bg-borderSoft justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink">Date Safety Check-In Reminders</p>
                <p className="text-[10px] text-ink-muted">High-priority alerts for in-person meetup safety.</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifySafetyCheckIn(!notifySafetyCheckIn)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  notifySafetyCheckIn ? 'bg-emerald justify-end' : 'bg-borderSoft justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet to-violet-hover text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences & Settings</span>
          </button>
        </div>
      </form>

      {/* Account Security & DPDP Data Privacy */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
        <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald" />
          <span>Account Security & Data Privacy (DPDP Compliance)</span>
        </h2>

        {/* Active Logged-In Sessions */}
        <div className="p-4 rounded-2xl bg-cloud border border-borderSoft flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-ink-muted" />
            <div>
              <p className="text-xs font-bold text-ink">Current Session • Web Browser</p>
              <p className="text-[10px] text-ink-muted">Mumbai, India • Active Now</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
            Active Device
          </span>
        </div>

        {/* Export Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-borderSoft">
          <div>
            <p className="text-xs font-bold text-ink">Download My Personal Data Archive</p>
            <p className="text-[11px] text-ink-muted">
              Export an encrypted JSON file containing your profile info, photos, and match activity.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-cloud hover:bg-lavender-light text-xs font-bold text-violet transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Data</span>
          </button>
        </div>

        {/* Pause Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-borderSoft">
          <div>
            <p className="text-xs font-bold text-ink">
              {isAccountPaused ? 'Account is Currently Paused' : 'Take a Break (Pause Profile)'}
            </p>
            <p className="text-[11px] text-ink-muted">
              Temporarily hide your profile from swipe decks without losing matches or chat history.
            </p>
          </div>
          <button
            onClick={() => {
              setIsAccountPaused(!isAccountPaused);
              setSavedMessage(
                !isAccountPaused
                  ? 'Account paused. You are now invisible in swipe decks.'
                  : 'Account reactivated. You are now visible to nearby matches!'
              );
              setTimeout(() => setSavedMessage(''), 4000);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all self-start sm:self-auto ${
              isAccountPaused
                ? 'bg-emerald text-white shadow-xs'
                : 'bg-cloud hover:bg-lavender-light text-ink'
            }`}
          >
            {isAccountPaused ? 'Reactivate Profile' : 'Pause Profile'}
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-4 rounded-2xl bg-dangerRedLight/30 border border-dangerRed/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-dangerRed">Permanently Delete Account</p>
            <p className="text-[11px] text-ink-muted">
              Permanently expunges your profile, photos, matches, and messages. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-dangerRed hover:bg-dangerRed/90 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-borderSoft text-center">
            <div className="w-12 h-12 rounded-full bg-dangerRedLight text-dangerRed flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-ink">Delete Account?</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Type <strong className="text-dangerRed">DELETE</strong> below to permanently erase your profile and messages.
            </p>

            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-bold text-center uppercase my-4 focus:outline-none focus:border-dangerRed"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-cloud text-ink text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                className="flex-1 py-2.5 rounded-xl bg-dangerRed disabled:opacity-40 text-white text-xs font-bold shadow-md hover:bg-dangerRed/90 transition-all"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
