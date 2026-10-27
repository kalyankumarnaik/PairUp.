import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  Shield,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  Users,
  UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api';
import { AdminDashboardMetrics, ReportItem } from '@pairup/domain-types';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [mRes, rRes] = await Promise.all([
        apiClient.getAdminMetrics(),
        apiClient.getAdminReports()
      ]);

      if (mRes.data) setMetrics(mRes.data);
      if (rRes.data) setReports(rRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: string, action: string) => {
    try {
      await apiClient.resolveReport(reportId, action, `Action ${action} executed by Admin`);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setActionMessage(`Report resolved with action: ${action}`);
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-midnightInk text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/20 text-coral text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Staff Administration & Moderation</span>
          </div>
          <h1 className="text-2xl font-display font-extrabold">System Control Dashboard</h1>
          <p className="text-xs text-white/70 mt-0.5">
            Role: {user?.role || 'MODERATOR'} • Authenticated Session
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-success/20 border border-success/30 text-success text-xs font-bold flex items-center gap-1.5">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>API 99.98% Health</span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-successGreenLight border border-successGreen/30 text-xs font-bold text-successGreen">
          ✓ {actionMessage}
        </div>
      )}

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-borderSoft shadow-xs">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">Registered Users</p>
            <p className="text-2xl font-display font-black text-ink mt-1">
              {metrics.totalRegisteredUsers}
            </p>
            <p className="text-[10px] text-success font-semibold mt-0.5">+{metrics.newRegistrationsToday} today</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-borderSoft shadow-xs">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">Active Matches</p>
            <p className="text-2xl font-display font-black text-coral mt-1">
              {metrics.activeMatches}
            </p>
            <p className="text-[10px] text-ink-muted font-semibold mt-0.5">High compatibility</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-borderSoft shadow-xs">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">Pending Reports</p>
            <p className="text-2xl font-display font-black text-dangerRed mt-1">
              {reports.length}
            </p>
            <p className="text-[10px] text-dangerRed font-semibold mt-0.5">Requires moderator action</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-borderSoft shadow-xs">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider">Monthly Revenue</p>
            <p className="text-2xl font-display font-black text-violet mt-1">
              ₹{(metrics.subscriptionRevenueMonthly).toLocaleString()}
            </p>
            <p className="text-[10px] text-success font-semibold mt-0.5">Tier: Plus / Gold</p>
          </div>
        </div>
      )}

      {/* Moderation Queue */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-coral" />
            <span>Moderation Queue ({reports.length})</span>
          </h2>
          <span className="text-xs text-ink-muted font-medium">SLO Target: &lt;15 mins</span>
        </div>

        {reports.length > 0 ? (
          <div className="divide-y divide-borderSoft">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-bold uppercase bg-dangerRedLight text-dangerRed">
                      {rep.category}
                    </span>
                    <span className="text-xs text-ink-muted">Report ID: {rep.id}</span>
                  </div>
                  <p className="text-xs font-bold text-ink">
                    Reported User ID: {rep.reportedUserId}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                    Reason: "{rep.reason}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleResolveReport(rep.id, 'DISMISSED')}
                    className="px-3 py-1.5 rounded-xl border border-borderSoft hover:bg-cloud text-xs font-semibold text-ink-muted transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'WARNING')}
                    className="px-3 py-1.5 rounded-xl bg-warningAmberLight text-warningAmber text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Issue Warning
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'PERMANENT_BAN')}
                    className="px-3.5 py-1.5 rounded-xl bg-dangerRed text-white text-xs font-bold hover:bg-dangerRed/90 transition-opacity shadow-xs"
                  >
                    Ban User
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-ink-muted">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-bold text-ink">Zero pending reports!</p>
            <p className="text-[11px] mt-0.5">Community guidelines are being respected.</p>
          </div>
        )}
      </div>

      {/* Feature Flags & Platform Settings Preview */}
      <div className="p-6 rounded-3xl bg-white border border-borderSoft shadow-sm space-y-4">
        <h2 className="text-base font-display font-bold text-ink flex items-center gap-2">
          <Activity className="w-5 h-5 text-violet" />
          <span>Active Feature Flags</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-cloud flex items-center justify-between">
            <div>
              <p className="font-bold text-ink">AI Match Explanations</p>
              <p className="text-[10px] text-ink-muted">Show compatibility reasons</p>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-success/20 text-success font-bold text-[10px]">
              ENABLED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cloud flex items-center justify-between">
            <div>
              <p className="font-bold text-ink">Voice Rooms SFU</p>
              <p className="text-[10px] text-ink-muted">LiveKit media bridge</p>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-success/20 text-success font-bold text-[10px]">
              ENABLED
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cloud flex items-center justify-between">
            <div>
              <p className="font-bold text-ink">Adult Age Screening</p>
              <p className="text-[10px] text-ink-muted">Strict 18+ enforcement</p>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-success/20 text-success font-bold text-[10px]">
              ENABLED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
