import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../theme/colors';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  isOnline?: boolean;
  isVerified?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 88,
  xxl: 120
};

export function Avatar({
  uri,
  name,
  size = 'md',
  isOnline = false,
  isVerified = false,
  style
}: AvatarProps) {
  const dimension = sizeMap[size];
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PU';

  return (
    <View style={[{ width: dimension, height: dimension }, styles.wrapper, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: Colors.dreamLavender
            }
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              {
                fontSize: dimension * 0.38,
                color: Colors.electricViolet
              }
            ]}
          >
            {initials}
          </Text>
        </View>
      )}

      {isOnline ? (
        <View
          style={[
            styles.onlineBadge,
            {
              width: Math.max(10, dimension * 0.22),
              height: Math.max(10, dimension * 0.22),
              borderRadius: Math.max(5, dimension * 0.11),
              right: 0,
              bottom: 0
            }
          ]}
        />
      ) : null}

      {isVerified ? (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: Math.max(16, dimension * 0.28),
              height: Math.max(16, dimension * 0.28),
              borderRadius: Math.max(8, dimension * 0.14),
              right: -2,
              top: -2
            }
          ]}
        >
          <Text style={{ fontSize: Math.max(10, dimension * 0.18), color: '#FFF' }}>✓</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  initialsText: {
    fontWeight: '800'
  },
  onlineBadge: {
    position: 'absolute',
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: Colors.electricViolet,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  }
});
