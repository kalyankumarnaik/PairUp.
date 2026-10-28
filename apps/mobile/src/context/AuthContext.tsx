import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile, Gender, RelationshipIntention, ConnectionMode, VerificationStatus } from '@pairup/domain-types';

export interface MobileAuthState {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdultVerified: boolean;
}

export interface AuthContextValue extends MobileAuthState {
  login: (identifier: string, secret: string) => Promise<{ success: boolean; error?: string }>;
  signup: (payload: { email?: string; phone?: string; password: string; birthDate: string; displayName: string }) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  verifyAdultStatus: (confirmed: boolean, birthDate: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultMockUser: User = {
  id: 'usr_mobile_demo_101',
  email: 'mobile.user@pairup.internal',
  phone: '+919876543210',
  isEmailVerified: true,
  isPhoneVerified: true,
  isAdultVerified: true,
  role: 'MEMBER' as any,
  status: 'ACTIVE' as any,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-02-15')
};

const defaultMockProfile: UserProfile = {
  id: 'prof_mobile_demo_101',
  userId: 'usr_mobile_demo_101',
  displayName: 'Kalyan',
  birthDate: new Date('1998-05-14'),
  age: 27,
  gender: Gender.MAN,
  pronouns: 'he/him',
  relationshipIntention: RelationshipIntention.LONG_TERM,
  connectionMode: ConnectionMode.DATING,
  bio: 'Building next-gen mobile & fullstack applications 🚀 | Passionate coffee brewer & indie music enthusiast.',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
  interests: [
    { id: '1', name: 'Coffee Brewing', category: 'Food & Drink', icon: '☕' },
    { id: '2', name: 'Software Engineering', category: 'Tech', icon: '💻' },
    { id: '3', name: 'Indie Rock', category: 'Music', icon: '🎸' },
    { id: '4', name: 'Badminton', category: 'Sports', icon: '🏸' }
  ],
  photos: [
    {
      id: 'ph_1',
      profileId: 'prof_mobile_demo_101',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      isPrimary: true,
      displayOrder: 0,
      isVerified: true
    },
    {
      id: 'ph_2',
      profileId: 'prof_mobile_demo_101',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      isPrimary: false,
      displayOrder: 1,
      isVerified: true
    }
  ],
  prompts: [
    {
      id: 'p_1',
      question: 'A boundary I strictly keep is...',
      answer: 'Respecting personal space and never texting after midnight unless it is an emergency!'
    },
    {
      id: 'p_2',
      question: 'My ideal Sunday looks like...',
      answer: 'Fresh pour-over coffee, a long bicycle ride through Cubbon park, and relaxing book sessions.'
    }
  ],
  verificationStatus: VerificationStatus.VERIFIED,
  completionPercentage: 92,
  isIncognito: false,
  isPaused: false,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-02-15')
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultMockUser);
  const [profile, setProfile] = useState<UserProfile | null>(defaultMockProfile);
  const [token, setToken] = useState<string | null>('pairup_mobile_demo_token_xyz');
  const [refreshToken, setRefreshToken] = useState<string | null>('pairup_mobile_demo_refresh_xyz');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdultVerified, setIsAdultVerified] = useState<boolean>(true);

  const login = async (identifier: string, secret: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // In mobile environment, support instant authentication
      setUser(defaultMockUser);
      setProfile(defaultMockProfile);
      setToken('pairup_mobile_demo_token_xyz');
      setIsAuthenticated(true);
      setIsAdultVerified(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: {
    email?: string;
    phone?: string;
    password: string;
    birthDate: string;
    displayName: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const bDate = new Date(payload.birthDate);
      const ageDiff = Date.now() - bDate.getTime();
      const ageDate = new Date(ageDiff);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (calculatedAge < 18) {
        return { success: false, error: 'PairUp is strictly for adults aged 18 and older.' };
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        email: payload.email || null,
        phone: payload.phone || null,
        isEmailVerified: false,
        isPhoneVerified: false,
        isAdultVerified: true,
        role: 'MEMBER' as any,
        status: 'ACTIVE' as any,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newProfile: UserProfile = {
        id: `prof_${Date.now()}`,
        userId: newUser.id,
        displayName: payload.displayName,
        birthDate: bDate,
        age: calculatedAge,
        gender: Gender.OTHER,
        relationshipIntention: RelationshipIntention.OPEN_TO_DISCUSS,
        connectionMode: ConnectionMode.DATING,
        bio: '',
        interests: [],
        photos: [],
        prompts: [],
        verificationStatus: VerificationStatus.UNVERIFIED,
        completionPercentage: 40,
        isIncognito: false,
        isPaused: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setUser(newUser);
      setProfile(newProfile);
      setIsAuthenticated(true);
      setIsAdultVerified(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (code.length === 6) {
        if (user) {
          setUser({ ...user, isPhoneVerified: true, isEmailVerified: true });
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid 6-digit OTP code' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdultStatus = async (confirmed: boolean, birthDate: string): Promise<boolean> => {
    if (!confirmed) return false;
    const bDate = new Date(birthDate);
    const ageDiff = Date.now() - bDate.getTime();
    const ageDate = new Date(ageDiff);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    const is18Plus = calculatedAge >= 18;
    setIsAdultVerified(is18Plus);
    if (user && is18Plus) {
      setUser({ ...user, isAdultVerified: true });
    }
    return is18Plus;
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    setProfile((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date() } : null));
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setProfile(null);
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        refreshToken,
        isAuthenticated,
        isLoading,
        isAdultVerified,
        login,
        signup,
        verifyOtp,
        verifyAdultStatus,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
