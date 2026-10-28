import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/context/AuthContext';

export default function MobileLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('demo@pairup.internal');
  const [password, setPassword] = useState('Password123!');
  const [phone, setPhone] = useState('+919876543210');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your email or phone number and password');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = () => {
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    router.push({
      pathname: '/auth/otp',
      params: { phone }
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>💖</Text>
          </View>
          <Text style={styles.brandTitle}>PairUp</Text>
          <Text style={styles.brandSubtitle}>
            Connect, chat, and meet authentic adults near you.
          </Text>
        </View>

        {/* Auth Mode Tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.tabButton, authMode === 'password' && styles.tabButtonActive]}
            onPress={() => setAuthMode('password')}
          >
            <Text
              style={[styles.tabButtonText, authMode === 'password' && styles.tabButtonTextActive]}
            >
              Password Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, authMode === 'otp' && styles.tabButtonActive]}
            onPress={() => setAuthMode('otp')}
          >
            <Text
              style={[styles.tabButtonText, authMode === 'otp' && styles.tabButtonTextActive]}
            >
              One-Tap OTP
            </Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        {authMode === 'password' ? (
          <View style={styles.formContainer}>
            <Input
              label="Email or Phone Number"
              placeholder="e.g. kalyan@example.com or +919876543210"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Log In to PairUp"
              onPress={handlePasswordLogin}
              loading={isLoading}
              variant="primary"
              size="lg"
            />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              hint="We will send a 6-digit SMS verification code to verify your account."
            />

            <Button
              title="Send Verification Code"
              onPress={handleRequestOtp}
              variant="coral"
              size="lg"
            />
          </View>
        )}

        {/* 18+ Adult Safety Notice */}
        <View style={styles.ageDisclaimer}>
          <Text style={styles.ageIcon}>🔞</Text>
          <Text style={styles.ageText}>
            PairUp is strictly restricted to adults aged 18 and older. Location masking is enabled
            by default to preserve your privacy.
          </Text>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to PairUp?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/adult-verify')}>
            <Text style={styles.signupLink}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.passionCoral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  logoEmoji: {
    fontSize: 32
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.midnightInk,
    letterSpacing: -0.5
  },
  brandSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.lg
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.md
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary
  },
  tabButtonTextActive: {
    color: Colors.electricViolet,
    fontWeight: '700'
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600'
  },
  formContainer: {
    marginBottom: Spacing.lg
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -4
  },
  forgotPasswordText: {
    color: Colors.electricViolet,
    fontSize: 13,
    fontWeight: '600'
  },
  ageDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: Spacing.xl
  },
  ageIcon: {
    fontSize: 20,
    marginRight: 10
  },
  ageText: {
    flex: 1,
    fontSize: 11,
    color: '#9A3412',
    lineHeight: 16
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.electricViolet
  }
});
