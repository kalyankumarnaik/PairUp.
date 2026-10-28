import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/context/AuthContext';

export default function MobileAdultVerifyScreen() {
  const router = useRouter();
  const { verifyAdultStatus } = useAuth();

  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('08');
  const [dobYear, setDobYear] = useState('1999');
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [agreedConsent, setAgreedConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async () => {
    setErrorMessage(null);
    const day = parseInt(dobDay, 10);
    const month = parseInt(dobMonth, 10);
    const year = parseInt(dobYear, 10);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1920 ||
      year > 2026
    ) {
      setErrorMessage('Please enter a valid date of birth (DD / MM / YYYY).');
      return;
    }

    if (!agreedGuidelines || !agreedConsent) {
      setErrorMessage('You must confirm you are at least 18 years of age and agree to our community standards.');
      return;
    }

    const birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isAdult = await verifyAdultStatus(true, birthDateStr);

    if (!isAdult) {
      setErrorMessage('Access Denied: You must be at least 18 years of age to use PairUp.');
      return;
    }

    // Proceed to sign up with verified DOB
    router.push({
      pathname: '/auth/signup',
      params: { birthDate: birthDateStr }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Top Shield Header */}
      <View style={styles.shieldBadge}>
        <Text style={styles.shieldEmoji}>🛡️</Text>
      </View>

      <Text style={styles.title}>Age Verification & Safety Gate</Text>
      <Text style={styles.subtitle}>
        PairUp is exclusively designed for consenting adults (18+). To keep our community safe and compliant with Indian regulatory statutes, please confirm your date of birth.
      </Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>🚫 {errorMessage}</Text>
        </View>
      ) : null}

      {/* Date of Birth Inputs */}
      <View style={styles.dobCard}>
        <Text style={styles.dobLabel}>ENTER YOUR DATE OF BIRTH</Text>
        <View style={styles.dobRow}>
          <View style={styles.dobCol}>
            <Text style={styles.unitLabel}>Day (DD)</Text>
            <Input
              value={dobDay}
              onChangeText={setDobDay}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="15"
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
          <View style={styles.dobCol}>
            <Text style={styles.unitLabel}>Month (MM)</Text>
            <Input
              value={dobMonth}
              onChangeText={setDobMonth}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="08"
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
          <View style={[styles.dobCol, { flex: 1.3 }]}>
            <Text style={styles.unitLabel}>Year (YYYY)</Text>
            <Input
              value={dobYear}
              onChangeText={setDobYear}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="1999"
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Community Standards & Consent Checkboxes */}
      <View style={styles.checklist}>
        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setAgreedGuidelines(!agreedGuidelines)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreedGuidelines && styles.checkboxActive]}>
            {agreedGuidelines ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.checkText}>
            I solemnly declare that I am 18 years of age or older and eligible to participate under the Laws of India.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setAgreedConsent(!agreedConsent)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreedConsent && styles.checkboxActive]}>
            {agreedConsent ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.checkText}>
            I agree to maintain a respectful space free of harassment, unsolicited explicit content, impersonation, and fraudulent schemes.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <Button
        title="I Am 18+ — Continue to Sign Up"
        onPress={handleVerify}
        variant="primary"
        size="lg"
        style={{ marginBottom: Spacing.md }}
      />

      <Button
        title="Return to Login"
        onPress={() => router.replace('/auth/login')}
        variant="ghost"
        size="md"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center'
  },
  shieldBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  shieldEmoji: {
    fontSize: 36
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.midnightInk,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.xl
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '600'
  },
  dobCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg
  },
  dobLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.electricViolet,
    letterSpacing: 0.8,
    marginBottom: 12
  },
  dobRow: {
    flexDirection: 'row',
    gap: 10
  },
  dobCol: {
    flex: 1
  },
  unitLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500'
  },
  checklist: {
    width: '100%',
    marginBottom: Spacing.xl,
    gap: 12
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  checkboxActive: {
    backgroundColor: Colors.electricViolet,
    borderColor: Colors.electricViolet
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  checkText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18
  }
});
