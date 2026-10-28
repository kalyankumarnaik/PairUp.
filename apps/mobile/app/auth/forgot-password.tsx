import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';

export default function MobileForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email address or phone number.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Text style={styles.icon}>🔑</Text>
        </View>

        <Text style={styles.title}>Account Recovery</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address or mobile number. We will send a secure password reset link or SMS code.
        </Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        {submitted ? (
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>📬</Text>
            <Text style={styles.successTitle}>Recovery Instructions Sent!</Text>
            <Text style={styles.successDesc}>
              If an account exists for <Text style={{ fontWeight: '700' }}>{identifier}</Text>, you will receive instructions within 2 minutes.
            </Text>
            <Button
              title="Return to Login"
              onPress={() => router.replace('/auth/login')}
              variant="primary"
              size="lg"
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Email or Mobile Number"
              placeholder="e.g. kalyan@example.com"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Button
              title="Send Recovery Link"
              onPress={handleSubmit}
              loading={isLoading}
              variant="primary"
              size="lg"
              style={{ marginTop: Spacing.md }}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    alignItems: 'center'
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  icon: {
    fontSize: 32
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.midnightInk,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
    paddingHorizontal: 16
  },
  errorBox: {
    width: '100%',
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
    width: '100%'
  },
  successCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center'
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 12
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.midnightInk,
    marginBottom: 8
  },
  successDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19
  },
  backButton: {
    alignSelf: 'center',
    marginTop: Spacing.xl
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600'
  }
});
