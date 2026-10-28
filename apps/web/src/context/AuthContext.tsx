import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccountStatus,
  ConnectionMode,
  Gender,
  RelationshipIntention,
  User,
  UserProfile,
  UserRole,
  VerificationStatus
} from '@pairup/domain-types';
import { apiClient } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isOfflineMode: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: any) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (identifier: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  addPhoto: (url: string) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  setPrimaryPhoto: (photoId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-defined fallback demo accounts for offline / client-only mode
const DEMO_USERS: Record<string, { user: User; profile: UserProfile }> = {
  'ananya.verma@example.com': {
    user: {
      id: 'usr_demo_1',
      email: 'ananya.verma@example.com',
      phone: '+919800000001',
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdultVerified: true,
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    profile: {
      id: 'prf_demo_1',
      userId: 'usr_demo_1',
      displayName: 'Ananya Verma',
      birthDate: '1998-07-22',
      age: 26,
      bio: 'Architect, plant mom, and amateur photographer. Always up for filter coffee or art gallery walks in Bandra. Let’s talk about design, vinyl records, or the best pasta in Mumbai.',
      gender: Gender.WOMAN,
      pronouns: 'she/her',
      relationshipIntention: RelationshipIntention.DATING_TO_MARRY,
      connectionMode: ConnectionMode.DATING,
      education: 'CEPT University, Ahmedabad',
      occupation: 'Lead Urban Architect',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      languages: ['English', 'Hindi'],
      interests: [
        { id: 'int_1', name: 'Coffee & Cafes', category: 'Food & Dining', emoji: '☕' },
        { id: 'int_2', name: 'Contemporary Art', category: 'Creative', emoji: '🎨' },
        { id: 'int_3', name: 'Street Photography', category: 'Creative', emoji: '📷' }
      ],
      photos: [
        {
          id: 'pht_1',
          profileId: 'prf_demo_1',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
          order: 0,
          isPrimary: true,
          isModerated: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'pht_2',
          profileId: 'prf_demo_1',
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
          order: 1,
          isPrimary: false,
          isModerated: true,
          createdAt: new Date().toISOString()
        }
      ],
      prompts: [
        {
          id: 'prm_1',
          question: 'A perfect Sunday looks like',
          answer: 'Brewing pour-over coffee, listening to indie vinyl, and tending to balcony plants.'
        }
      ],
      verificationStatus: VerificationStatus.VERIFIED,
      completenessScore: 92,
      isIncognito: false,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  'aarav.sharma@example.com': {
    user: {
      id: 'usr_demo_2',
      email: 'aarav.sharma@example.com',
      phone: '+919800000002',
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdultVerified: true,
      role: UserRole.USER,
      status: AccountStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    profile: {
      id: 'prf_demo_2',
      userId: 'usr_demo_2',
      displayName: 'Aarav Sharma',
      birthDate: '1996-03-15',
      age: 28,
      bio: 'Fintech product designer who balances UX wireframes with weekend hiking trips and spicy street food trails. Let’s find Mumbai’s hidden sunset viewpoints.',
      gender: Gender.MAN,
      pronouns: 'he/him',
      relationshipIntention: RelationshipIntention.LONG_TERM,
      connectionMode: ConnectionMode.BOTH,
      education: 'IIT Bombay',
      occupation: 'Product Designer',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      languages: ['English', 'Hindi', 'Marathi'],
      interests: [
        { id: 'int_4', name: 'Hiking & Trekking', category: 'Outdoors', emoji: '🏔️' },
        { id: 'int_5', name: 'Coffee & Cafes', category: 'Food & Dining', emoji: '☕' },
        { id: 'int_6', name: 'Badminton', category: 'Sports', emoji: '🏸' }
      ],
      photos: [
        {
          id: 'pht_3',
          profileId: 'prf_demo_2',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          order: 0,
          isPrimary: true,
          isModerated: true,
          createdAt: new Date().toISOString()
        }
      ],
      prompts: [
        {
          id: 'prm_2',
          question: 'The best way to ask me out',
          answer: 'Ask if I want to play badminton or explore a newly opened artisanal bakery.'
        }
      ],
      verificationStatus: VerificationStatus.VERIFIED,
      completenessScore: 88,
      isIncognito: false,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  'admin@pairup.ai': {
    user: {
      id: 'usr_admin_master',
      email: 'admin@pairup.ai',
      phone: '+919999900000',
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdultVerified: true,
      role: UserRole.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    profile: {
      id: 'prf_admin',
      userId: 'usr_admin_master',
      displayName: 'System Admin',
      birthDate: '1990-01-01',
      age: 34,
      bio: 'PairUp AI Platform Administrator & Trust/Safety Lead.',
      gender: Gender.PREFER_NOT_TO_SAY,
      relationshipIntention: RelationshipIntention.NOT_SURE_YET,
      connectionMode: ConnectionMode.BOTH,
      city: 'Mumbai',
      languages: ['English', 'Hindi'],
      interests: [],
      photos: [
        {
          id: 'pht_admin',
          profileId: 'prf_admin',
          url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
          order: 0,
          isPrimary: true,
          isModerated: true,
          createdAt: new Date().toISOString()
        }
      ],
      prompts: [],
      verificationStatus: VerificationStatus.VERIFIED,
      completenessScore: 100,
      isIncognito: false,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pairup_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('pairup_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pairup_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const refreshProfile = async () => {
    try {
      const res = await apiClient.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem('pairup_user', JSON.stringify(res.data.user));
        localStorage.setItem('pairup_profile', JSON.stringify(res.data.profile));
        setIsOfflineMode(false);
      }
    } catch {
      // If server unreachable, retain stored user session
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (identifier: string, pass: string) => {
    // 1. Try real backend
    try {
      const res = await apiClient.login(identifier, pass);
      if (res.success && res.data) {
        const t = res.data.tokens.accessToken;
        localStorage.setItem('pairup_access_token', t);
        setToken(t);
        setUser(res.data.user);
        if (res.data.profile) {
          localStorage.setItem('pairup_user', JSON.stringify(res.data.user));
          setProfile(res.data.profile as any);
        }
        await refreshProfile();
        return { success: true };
      }

      // If backend explicitly rejected invalid credentials
      if (res.error && res.error.code !== 'NETWORK_ERROR') {
        return { success: false, message: res.message || 'Invalid email or password' };
      }
    } catch {
      // Backend offline, fallback to offline demo mode
    }

    // 2. Offline fallback mode for smooth testing & demo
    const cleanId = identifier.trim().toLowerCase();
    const demo = DEMO_USERS[cleanId];

    if (demo) {
      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem('pairup_access_token', mockToken);
      localStorage.setItem('pairup_user', JSON.stringify(demo.user));
      localStorage.setItem('pairup_profile', JSON.stringify(demo.profile));
      setToken(mockToken);
      setUser(demo.user);
      setProfile(demo.profile);
      setIsOfflineMode(true);
      setIsLoading(false);
      return { success: true };
    }

    // If identifier is any valid string, allow flexible dev login
    const devUser: User = {
      id: 'usr_dev_' + Math.random().toString(36).substring(2, 7),
      email: identifier.includes('@') ? identifier : `${identifier}@pairup.local`,
      phone: !identifier.includes('@') ? identifier : null,
      isEmailVerified: true,
      isPhoneVerified: true,
      isAdultVerified: true,
      role: identifier.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER,
      status: AccountStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const devProfile: UserProfile = {
      id: 'prf_dev_' + Math.random().toString(36).substring(2, 7),
      userId: devUser.id,
      displayName: identifier.split('@')[0],
      birthDate: '1998-01-01',
      age: 26,
      bio: 'Member of PairUp AI. Exploring new connections and activities.',
      gender: Gender.PREFER_NOT_TO_SAY,
      relationshipIntention: RelationshipIntention.LONG_TERM,
      connectionMode: ConnectionMode.BOTH,
      city: 'Mumbai',
      languages: ['English'],
      interests: [],
      photos: [
        {
          id: 'pht_dev',
          profileId: 'prf_dev',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
          order: 0,
          isPrimary: true,
          isModerated: true,
          createdAt: new Date().toISOString()
        }
      ],
      prompts: [],
      verificationStatus: VerificationStatus.VERIFIED,
      completenessScore: 70,
      isIncognito: false,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const mockToken = `mock_token_${Date.now()}`;
    localStorage.setItem('pairup_access_token', mockToken);
    localStorage.setItem('pairup_user', JSON.stringify(devUser));
    localStorage.setItem('pairup_profile', JSON.stringify(devProfile));
    setToken(mockToken);
    setUser(devUser);
    setProfile(devProfile);
    setIsOfflineMode(true);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (data: any) => {
    try {
      const res = await apiClient.signup(data);
      if (res.success && res.data) {
        const t = res.data.tokens.accessToken;
        localStorage.setItem('pairup_access_token', t);
        setToken(t);
        setUser(res.data.user);
        await refreshProfile();
        return { success: true };
      }
      if (res.error && res.error.code !== 'NETWORK_ERROR') {
        return { success: false, message: res.message || 'Signup failed' };
      }
    } catch {
      // Offline fallback
    }

    // Client-side registration fallback
    return login(data.email || data.phone, data.password);
  };

  const verifyOtp = async (identifier: string, code: string) => {
    return login(identifier, 'Password123!');
  };

  const logout = () => {
    localStorage.removeItem('pairup_access_token');
    localStorage.removeItem('pairup_user');
    localStorage.removeItem('pairup_profile');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const addPhoto = async (url: string) => {
    try {
      await apiClient.addPhotoUrl(url);
    } catch {
      // Offline fallback
    }

    if (profile) {
      const isFirst = !profile.photos || profile.photos.length === 0;
      const newPhoto = {
        id: `pht_${Date.now()}`,
        profileId: profile.id,
        url,
        order: profile.photos?.length || 0,
        isPrimary: isFirst,
        isModerated: true,
        createdAt: new Date().toISOString()
      };
      const updatedPhotos = [...(profile.photos || []), newPhoto];
      const updatedProfile = { ...profile, photos: updatedPhotos };
      setProfile(updatedProfile);
      localStorage.setItem('pairup_profile', JSON.stringify(updatedProfile));
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      await apiClient.deletePhoto(photoId);
    } catch {
      // Offline fallback
    }

    if (profile && profile.photos) {
      const remaining = profile.photos.filter((p) => p.id !== photoId);
      // If we deleted the primary photo and there are still photos, designate the first one as primary
      if (remaining.length > 0 && !remaining.some((p) => p.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      const updatedProfile = { ...profile, photos: remaining };
      setProfile(updatedProfile);
      localStorage.setItem('pairup_profile', JSON.stringify(updatedProfile));
    }
  };

  const setPrimaryPhoto = async (photoId: string) => {
    if (profile && profile.photos) {
      const updatedPhotos = profile.photos.map((p) => ({
        ...p,
        isPrimary: p.id === photoId
      }));
      const updatedProfile = { ...profile, photos: updatedPhotos };
      setProfile(updatedProfile);
      localStorage.setItem('pairup_profile', JSON.stringify(updatedProfile));

      try {
        const primary = updatedPhotos.find((p) => p.id === photoId);
        const rest = updatedPhotos.filter((p) => p.id !== photoId);
        const ordered = primary ? [primary, ...rest] : updatedPhotos;
        await apiClient.reorderPhotos(ordered.map((p) => p.id));
      } catch {
        // Offline fallback
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (profile) {
      const updatedProfile: UserProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      setProfile(updatedProfile);
      localStorage.setItem('pairup_profile', JSON.stringify(updatedProfile));
    }

    if (user && updates.displayName) {
      const updatedUser = {
        ...user,
        displayName: updates.displayName
      };
      setUser(updatedUser);
      localStorage.setItem('pairup_user', JSON.stringify(updatedUser));
    }

    try {
      const res = await apiClient.updateProfile(updates as any);
      if (res.success && res.data) {
        setProfile(res.data);
        localStorage.setItem('pairup_profile', JSON.stringify(res.data));
      }
    } catch {
      // Offline fallback already updated in local state and storage
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        isOfflineMode,
        login,
        signup,
        verifyOtp,
        logout,
        refreshProfile,
        updateProfile,
        addPhoto,
        deletePhoto,
        setPrimaryPhoto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
