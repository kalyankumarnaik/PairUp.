import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'coral' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconRight,
  style,
  textStyle
}: ButtonProps) {
  const getContainerStyle = (): ViewStyle => {
    let base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.xl,
      opacity: disabled ? 0.6 : 1
    };

    if (fullWidth) {
      base.width = '100%';
    }

    switch (size) {
      case 'sm':
        base.paddingVertical = 8;
        base.paddingHorizontal = Spacing.md;
        break;
      case 'lg':
        base.paddingVertical = 16;
        base.paddingHorizontal = Spacing.xl;
        break;
      case 'md':
      default:
        base.paddingVertical = 12;
        base.paddingHorizontal = Spacing.lg;
        break;
    }

    switch (variant) {
      case 'secondary':
        base.backgroundColor = Colors.surfaceAlt;
        base.borderWidth = 1;
        base.borderColor = Colors.border;
        break;
      case 'coral':
        base.backgroundColor = Colors.passionCoral;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = Colors.electricViolet;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = Colors.dangerRed;
        break;
      case 'primary':
      default:
        base.backgroundColor = Colors.electricViolet;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let base: TextStyle = {
      fontWeight: '700',
      textAlign: 'center'
    };

    switch (size) {
      case 'sm':
        base.fontSize = 13;
        break;
      case 'lg':
        base.fontSize = 17;
        break;
      case 'md':
      default:
        base.fontSize = 15;
        break;
    }

    switch (variant) {
      case 'secondary':
        base.color = Colors.textPrimary;
        break;
      case 'outline':
      case 'ghost':
        base.color = Colors.electricViolet;
        break;
      case 'danger':
      case 'coral':
      case 'primary':
      default:
        base.color = Colors.textInverse;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.electricViolet : Colors.textInverse}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={[getTextStyle(), icon ? { marginLeft: 8 } : null, iconRight ? { marginRight: 8 } : null, textStyle]}>
            {title}
          </Text>
          {iconRight ? <>{iconRight}</> : null}
        </>
      )}
    </TouchableOpacity>
  );
}
