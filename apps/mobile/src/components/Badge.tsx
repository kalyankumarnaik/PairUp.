import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../theme/colors';

export type BadgeVariant = 'primary' | 'coral' | 'peach' | 'verified' | 'success' | 'warning' | 'gold' | 'outline';

export interface BadgeProps {
  label: string;
  icon?: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ label, icon, variant = 'primary', style, textStyle }: BadgeProps) {
  const getBadgeStyle = (): ViewStyle => {
    switch (variant) {
      case 'coral':
        return { backgroundColor: '#FFE4EC' };
      case 'peach':
        return { backgroundColor: '#FFF0EA' };
      case 'verified':
        return { backgroundColor: '#EDE9FE' };
      case 'success':
        return { backgroundColor: '#D1FAE5' };
      case 'warning':
        return { backgroundColor: '#FEF3C7' };
      case 'gold':
        return { backgroundColor: '#FEF9C3' };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border };
      case 'primary':
      default:
        return { backgroundColor: Colors.surfaceAlt };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'coral':
        return { color: Colors.passionCoral };
      case 'peach':
        return { color: Colors.sunsetPeach };
      case 'verified':
        return { color: Colors.electricViolet };
      case 'success':
        return { color: Colors.successGreen };
      case 'warning':
        return { color: Colors.warningAmber };
      case 'gold':
        return { color: '#B45309' };
      case 'outline':
        return { color: Colors.textSecondary };
      case 'primary':
      default:
        return { color: Colors.midnightInk };
    }
  };

  return (
    <View style={[styles.badgeContainer, getBadgeStyle(), style]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.label, getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start'
  },
  icon: {
    marginRight: 4,
    fontSize: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '600'
  }
});
