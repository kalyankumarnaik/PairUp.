import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';

export default function MobileOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const { verifyOtp } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const phone = params.phone || '+91 98765 43210';

  useEffect(() => {
    let interval: any = null;
    if (timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSeconds]);

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp(otpCode);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(res.error || 'Invalid code. Try using dev code 123456');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimerSeconds(60);
    setCanResend(false);
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>💬</Text>
        </View>

        <Text style={styles.title}>Enter 6-Digit Code</Text>
        <Text style={styles.subtitle}>
          We sent an SMS with a one-time verification code to{' '}
          <Text style={{ fontWeight: '700', color: Colors.midnightInk }}>{phone}</Text>
        </Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        {/* OTP Input Fields */}
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.hiddenInput}
            value={otpCode}
            onChangeText={(val) => {
              const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
              setOtpCode(cleaned);
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <View style={styles.boxesRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const char = otpCode[index] || '';
              const isCurrent = otpCode.length === index;

              return (
                <View
                  key={index}
                  style={[
                    styles.digitBox,
                    isCurrent && styles.digitBoxActive,
                    char ? styles.digitBoxFilled : null
                  ]}
                >
                  <Text style={styles.digitText}>{char}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Dev Mode Helper */}
        <TouchableOpacity
          style={styles.devBadge}
          onPress={() => setOtpCode('123456')}
          activeOpacity={0.7}
        >
          <Text style={styles.devBadgeText}>🛠️ Tap here to autofill Dev OTP (123456)</Text>
        </TouchableOpacity>

        {/* Resend Timer */}
        <View style={styles.resendRow}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendActiveText}>Resend verification code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in <Text style={{ fontWeight: '700' }}>00:{String(timerSeconds).padStart(2, '0')}</Text>
            </Text>
          )}
        </View>

        {/* Verify Action */}
        <Button
          title="Verify & Enter PairUp"
          onPress={handleVerify}
          loading={isLoading}
          variant="primary"
          size="lg"
          style={{ marginTop: Spacing.xl }}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Edit mobile number</Text>
        </TouchableOpacity>
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
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFE4EC',
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
    fontWeight: '600',
    textAlign: 'center'
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative'
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: 60,
    opacity: 0,
    zIndex: 10
  },
  boxesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center'
  },
  digitBox: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  digitBoxActive: {
    borderColor: Colors.electricViolet,
    borderWidth: 2
  },
  digitBoxFilled: {
    borderColor: Colors.midnightInk,
    backgroundColor: '#FAF5FF'
  },
  digitText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.midnightInk
  },
  devBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: 12,
    marginBottom: 16
  },
  devBadgeText: {
    fontSize: 12,
    color: Colors.electricViolet,
    fontWeight: '600'
  },
  resendRow: {
    marginVertical: 12
  },
  resendActiveText: {
    color: Colors.electricViolet,
    fontWeight: '700',
    fontSize: 14
  },
  timerText: {
    color: Colors.textSecondary,
    fontSize: 13
  },
  backButton: {
    marginTop: Spacing.lg
  },
  backButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600'
  }
});
