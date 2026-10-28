import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextInputProps
} from 'react-native';
import { Colors, BorderRadius, Spacing, Typography } from '../theme/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  icon,
  secureTextEntry,
  containerStyle,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputFocused : null,
          error ? styles.inputError : null
        ]}
      >
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.eyeText}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hintText}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%'
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52
  },
  inputFocused: {
    borderColor: Colors.electricViolet,
    backgroundColor: '#FFFFFF'
  },
  inputError: {
    borderColor: Colors.dangerRed
  },
  iconContainer: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: Colors.textPrimary,
    fontSize: 15
  },
  eyeButton: {
    padding: 6
  },
  eyeText: {
    fontSize: 16
  },
  errorText: {
    fontSize: 12,
    color: Colors.dangerRed,
    marginTop: 4,
    fontWeight: '500'
  },
  hintText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4
  }
});
