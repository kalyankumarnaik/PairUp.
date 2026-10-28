import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

export interface NearbyBlip {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  angle: number; // Angle in degrees
  photoUrl?: string;
  isOnline: boolean;
  interests: string[];
}

export interface RadarViewProps {
  radiusKm: number;
  blips: NearbyBlip[];
  onSelectBlip?: (blip: NearbyBlip) => void;
  isScanning?: boolean;
}

const { width } = Dimensions.get('window');
const RADAR_SIZE = Math.min(width - 48, 340);

export function RadarView({
  radiusKm,
  blips,
  onSelectBlip,
  isScanning = true
}: RadarViewProps) {
  const center = RADAR_SIZE / 2;

  return (
    <View style={[styles.container, { width: RADAR_SIZE, height: RADAR_SIZE }]}>
      {/* Outer Circle (Max Radius) */}
      <View
        style={[
          styles.circle,
          {
            width: RADAR_SIZE,
            height: RADAR_SIZE,
            borderRadius: RADAR_SIZE / 2,
            borderColor: '#E2E8F0'
          }
        ]}
      />

      {/* Middle Circle */}
      <View
        style={[
          styles.circle,
          {
            width: RADAR_SIZE * 0.66,
            height: RADAR_SIZE * 0.66,
            borderRadius: (RADAR_SIZE * 0.66) / 2,
            borderColor: '#E9D5FF'
          }
        ]}
      />

      {/* Inner Circle */}
      <View
        style={[
          styles.circle,
          {
            width: RADAR_SIZE * 0.33,
            height: RADAR_SIZE * 0.33,
            borderRadius: (RADAR_SIZE * 0.33) / 2,
            borderColor: '#DDD6FE'
          }
        ]}
      />

      {/* Radar Crosshairs */}
      <View style={[styles.crosshairH, { width: RADAR_SIZE }]} />
      <View style={[styles.crosshairV, { height: RADAR_SIZE }]} />

      {/* Center User Blip (Me) */}
      <View style={styles.centerBlip}>
        <View style={styles.centerInner}>
          <Text style={{ fontSize: 13 }}>📍</Text>
        </View>
      </View>

      {/* Nearby Member Blips */}
      {blips.map((blip) => {
        // Calculate position based on distance ratio and angle
        const ratio = Math.min(1, Math.max(0.15, blip.distanceKm / Math.max(1, radiusKm)));
        const distancePx = ratio * (center - 24);
        const rad = (blip.angle * Math.PI) / 180;
        const x = center + distancePx * Math.cos(rad) - 16;
        const y = center + distancePx * Math.sin(rad) - 16;

        return (
          <TouchableOpacity
            key={blip.id}
            activeOpacity={0.8}
            onPress={() => onSelectBlip?.(blip)}
            style={[
              styles.memberBlip,
              {
                left: x,
                top: y
              }
            ]}
          >
            <View style={styles.memberPin}>
              <Text style={styles.memberEmoji}>💖</Text>
            </View>
            <View style={styles.blipBadge}>
              <Text style={styles.blipText} numberOfLines={1}>
                {blip.name} · {blip.distanceKm.toFixed(1)}km
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Range markers */}
      <Text style={[styles.rangeLabel, { top: 6 }]}>{radiusKm} km</Text>
      <Text style={[styles.rangeLabel, { top: RADAR_SIZE * 0.17 }]}>
        {Math.round(radiusKm * 0.66)} km
      </Text>
      <Text style={[styles.rangeLabel, { top: RADAR_SIZE * 0.33 }]}>
        {Math.round(radiusKm * 0.33)} km
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16
  },
  circle: {
    position: 'absolute',
    borderWidth: 1.5,
    borderStyle: 'dashed'
  },
  crosshairH: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#E2E8F0',
    opacity: 0.7
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#E2E8F0',
    opacity: 0.7
  },
  centerBlip: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.electricViolet,
    zIndex: 10
  },
  centerInner: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  memberBlip: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20
  },
  memberPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F5',
    borderWidth: 2,
    borderColor: Colors.passionCoral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.passionCoral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  memberEmoji: {
    fontSize: 14
  },
  blipBadge: {
    backgroundColor: 'rgba(36, 32, 57, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2
  },
  blipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  rangeLabel: {
    position: 'absolute',
    right: 12,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted
  }
});
