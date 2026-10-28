import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/context/AuthContext';
import { Gender, RelationshipIntention, ConnectionMode } from '@pairup/domain-types';

export default function MobileSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ birthDate?: string }>();
  const { signup } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [password, setPassword] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender>(Gender.WOMAN);
  const [selectedIntention, setSelectedIntention] = useState<RelationshipIntention>(
    RelationshipIntention.LONG_TERM
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const birthDate = params.birthDate || '2000-01-01';

  const handleRegister = async () => {
    if (!displayName.trim()) {
      setErrorMessage('Please enter your display name');
      return;
    }
    if (!email.trim() && phone.length < 10) {
      setErrorMessage('Please enter an email or phone number');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await signup({
        displayName: displayName.trim(),
        email: email.trim() || undefined,
        phone: phone.trim().length >= 10 ? phone.trim() : undefined,
        password,
        birthDate
      });

      if (res.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(res.error || 'Failed to register account');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Your PairUp Account 💖</Text>
          <Text style={styles.subtitle}>
            Find romance, build friendships, and discover your local circle.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="First Name or Nickname"
            placeholder="e.g. Priya or Rahul"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Input
            label="Email Address"
            placeholder="priya@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number (India +91)"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Create Secure Password"
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Gender Selection */}
          <Text style={styles.sectionLabel}>I IDENTIFY AS</Text>
          <View style={styles.pillRow}>
            {[
              { id: Gender.WOMAN, label: 'Woman 👩' },
              { id: Gender.MAN, label: 'Man 👨' },
              { id: Gender.NON_BINARY, label: 'Non-Binary 🧑' },
              { id: Gender.OTHER, label: 'Other ✨' }
            ].map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.pill, selectedGender === g.id && styles.pillActive]}
                onPress={() => setSelectedGender(g.id)}
              >
                <Text
                  style={[styles.pillText, selectedGender === g.id && styles.pillTextActive]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Relationship Intention */}
          <Text style={styles.sectionLabel}>LOOKING FOR</Text>
          <View style={styles.pillRow}>
            {[
              { id: RelationshipIntention.LONG_TERM, label: 'Long-term Partner 💍' },
              { id: RelationshipIntention.SHORT_TERM, label: 'Casual Dating 🥂' },
              { id: RelationshipIntention.NEW_FRIENDS, label: 'New Friends 🫶' },
              { id: RelationshipIntention.OPEN_TO_DISCUSS, label: 'Open to Anything 🌈' }
            ].map((intent) => (
              <TouchableOpacity
                key={intent.id}
                style={[styles.pill, selectedIntention === intent.id && styles.pillActive]}
                onPress={() => setSelectedIntention(intent.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedIntention === intent.id && styles.pillTextActive
                  ]}
                >
                  {intent.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Complete Registration & Explore"
            onPress={handleRegister}
            loading={isLoading}
            variant="coral"
            size="lg"
            style={{ marginTop: Spacing.lg }}
          />

          <TouchableOpacity
            style={styles.loginBackLink}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.loginBackText}>Already have an account? Log In</Text>
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
    paddingTop: 50,
    paddingBottom: 40
  },
  header: {
    marginBottom: Spacing.xl
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.midnightInk,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20
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
  form: {
    gap: 4
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.electricViolet,
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 8
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border
  },
  pillActive: {
    backgroundColor: '#EDE9FE',
    borderColor: Colors.electricViolet
  },
  pillText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500'
  },
  pillTextActive: {
    color: Colors.electricViolet,
    fontWeight: '700'
  },
  loginBackLink: {
    alignSelf: 'center',
    marginTop: Spacing.lg
  },
  loginBackText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600'
  }
});
