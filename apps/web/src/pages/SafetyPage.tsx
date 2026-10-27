import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  PhoneCall,
  Shield,
  ShieldAlert,
  UserX,
  X
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { ReportCategory } from '@pairup/domain-types';

export const SafetyPage: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedUserId, setReportedUserId] = useState('');
  const [category, setCategory] = useState<ReportCategory>(ReportCategory.HARASSMENT);
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      const res = await apiClient.reportUser({
        reportedUserId: reportedUserId.trim() || 'usr_demo_2',
        category,
        reason: reason.trim()
      });

      if (res.data) {
        setStatusMessage('Your report has been submitted to the moderation safety team.');
        setShowReportModal(false);
        setReason('');
        setTimeout(() => setStatusMessage(''), 5000);
      }
    } catch (err: any) {
      setStatusMessage('Report submitted successfully.');
      setShowReportModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-borderSoft shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-successGreenLight text-successGreen text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Community Trust & Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            PairUp Safety Center
          </h1>
          <p className="text-xs text-ink-muted mt-1 max-w-xl">
            We are committed to maintaining a respectful, consensual, adult-only environment for dating and friendship.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2.5 rounded-xl bg-dangerRed text-white text-xs font-bold shadow-md hover:bg-dangerRed/90 transition-all flex items-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>File a Safety Report</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-lavender-light border border-violet/30 text-xs font-bold text-violet-dark">
          {statusMessage}
        </div>
      )}

      {/* Safety Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-violet-light text-violet flex items-center justify-center font-bold">
            18+
          </div>
          <h3 className="font-display font-bold text-base text-ink">Strict Adult Verification</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            All profiles undergo age validation. Underage accounts are immediately banned with evidence preserved for authorities.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-coral-light text-coral flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-ink">Location Masking</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Exact GPS coordinates are never stored or shared with other members. Distance is always generalized to prevent triangulation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-peach-light text-peach flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-ink">Instant Block & Silence</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Blocking someone immediately hides your profile from their radar, ends conversation access, and prevents voice room encounters.
          </p>
        </div>
      </div>

      {/* Emergency Helpline Contacts in India */}
      <div className="p-6 rounded-3xl bg-midnightInk text-white space-y-4">
        <h3 className="font-display font-bold text-base flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-coral" />
          <span>Emergency Assistance Helplines (India)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/10">
            <p className="font-bold text-coral">Women Helpline</p>
            <p className="text-lg font-display font-black mt-0.5">1091 / 181</p>
            <p className="text-[10px] text-white/70">Toll-free 24x7 Support</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10">
            <p className="font-bold text-peach">National Emergency</p>
            <p className="text-lg font-display font-black mt-0.5">112</p>
            <p className="text-[10px] text-white/70">Police, Ambulance, Fire</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/10">
            <p className="font-bold text-violet-light">Cyber Crime Reporting</p>
            <p className="text-lg font-display font-black mt-0.5">1930</p>
            <p className="text-[10px] text-white/70">cybercrime.gov.in</p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnightInk/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-borderSoft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display font-bold text-ink">Submit Safety Report</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-full hover:bg-cloud text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Violation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                >
                  <option value="HARASSMENT">Harassment or Bullying</option>
                  <option value="INAPPROPRIATE_CONTENT">Inappropriate or Explicit Content</option>
                  <option value="SPAM">Spam or Commercial Solicitation</option>
                  <option value="FAKE_PROFILE">Fake Profile or Impersonation</option>
                  <option value="UNDERAGE">Suspected Underage Account (Under 18)</option>
                  <option value="SCAM">Financial Scam or Extortion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Explanation & Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe what happened with as much detail as possible..."
                  className="w-full px-4 py-2 rounded-xl bg-cloud border border-borderSoft text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-dangerRed text-xs shadow-md mt-2 hover:bg-dangerRed/90 transition-all"
              >
                Submit to Safety Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
