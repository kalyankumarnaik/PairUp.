import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserProfile } from '@pairup/domain-types';
import { apiClient } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: any) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (identifier: string, code: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pairup_access_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const res = await apiClient.getCurrentUser();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('pairup_access_token');
      }
    } catch {
      setUser(null);
      setProfile(null);
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
    const res = await apiClient.login(identifier, pass);
    if (res.success && res.data) {
      localStorage.setItem('pairup_access_token', res.data.tokens.accessToken);
      setToken(res.data.tokens.accessToken);
      setUser(res.data.user);
      await refreshProfile();
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const signup = async (data: any) => {
    const res = await apiClient.signup(data);
    if (res.success && res.data) {
      localStorage.setItem('pairup_access_token', res.data.tokens.accessToken);
      setToken(res.data.tokens.accessToken);
      setUser(res.data.user);
      await refreshProfile();
      return { success: true };
    }
    return { success: false, message: res.message || 'Signup failed' };
  };

  const verifyOtp = async (identifier: string, code: string) => {
    const res = await apiClient.verifyOtp(identifier, code);
    if (res.success && res.data) {
      localStorage.setItem('pairup_access_token', res.data.tokens.accessToken);
      setToken(res.data.tokens.accessToken);
      setUser(res.data.user);
      await refreshProfile();
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid verification code' };
  };

  const logout = () => {
    localStorage.removeItem('pairup_access_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        signup,
        verifyOtp,
        logout,
        refreshProfile
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
