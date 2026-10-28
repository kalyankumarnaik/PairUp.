import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { NearbyPage } from './pages/NearbyPage';
import { MatchesPage } from './pages/MatchesPage';
import { MessagesPage } from './pages/MessagesPage';
import { RoomsPage } from './pages/RoomsPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SafetyPage } from './pages/SafetyPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({
  children,
  requireAdmin
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud">
        <div className="w-10 h-10 rounded-full border-4 border-violet/20 border-t-violet animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'MODERATOR') {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
};

const SafetyRoute: React.FC = () => {
  const { user } = useAuth();
  if (user) {
    return (
      <ProtectedLayout>
        <SafetyPage />
      </ProtectedLayout>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-cloud">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 w-full">
        <SafetyPage />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <LandingPage />
              </div>
            }
          />
          <Route
            path="/auth"
            element={
              <div>
                <Navbar />
                <AuthPage />
              </div>
            }
          />
          <Route path="/safety" element={<SafetyRoute />} />

          {/* Protected Application Routes */}
          <Route
            path="/home"
            element={
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/discover"
            element={
              <ProtectedLayout>
                <DiscoverPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/nearby"
            element={
              <ProtectedLayout>
                <NearbyPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedLayout>
                <MatchesPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedLayout>
                <MessagesPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedLayout>
                <RoomsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedLayout>
                <EventsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayout>
                <ProfilePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedLayout requireAdmin>
                <AdminPage />
              </ProtectedLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
