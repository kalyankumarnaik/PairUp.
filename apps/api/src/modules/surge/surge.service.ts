import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../../common/database/memory-store.service';

export interface SurgeZone {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  activeUsersCount: number;
  surgeMultiplier: number; // e.g. 1.8x, 2.4x
  isActive: boolean;
  surgeReason: string;
  startedAt: string;
  expiresAt: string;
}

@Injectable()
export class SurgeService {
  private zones: Map<string, SurgeZone> = new Map();

  constructor(private readonly store: MemoryStoreService) {
    this.initializeDefaultSurges();
  }

  private initializeDefaultSurges() {
    const defaultZones: SurgeZone[] = [
      {
        id: 'surge_blr_indiranagar',
        name: 'Indiranagar 100ft Road',
        city: 'Bengaluru',
        latitude: 12.9716,
        longitude: 77.6412,
        radiusMeters: 3000,
        activeUsersCount: 342,
        surgeMultiplier: 2.2,
        isActive: true,
        surgeReason: '🔥 3x more singles active right now! Higher match rate guaranteed.',
        startedAt: new Date(Date.now() - 1800000).toISOString(),
        expiresAt: new Date(Date.now() + 5400000).toISOString()
      },
      {
        id: 'surge_mum_bandra',
        name: 'Bandra West & Carter Road',
        city: 'Mumbai',
        latitude: 19.0596,
        longitude: 72.8295,
        radiusMeters: 3500,
        activeUsersCount: 489,
        surgeMultiplier: 2.5,
        isActive: true,
        surgeReason: '⚡ Sunset surge! Profiles receive 2.5x more views right now.',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      },
      {
        id: 'surge_del_hauz_khas',
        name: 'Hauz Khas Social Circle',
        city: 'New Delhi',
        latitude: 28.5494,
        longitude: 77.2001,
        radiusMeters: 4000,
        activeUsersCount: 298,
        surgeMultiplier: 1.9,
        isActive: true,
        surgeReason: '🌟 Weekend night vibe surge in South Delhi.',
        startedAt: new Date(Date.now() - 1200000).toISOString(),
        expiresAt: new Date(Date.now() + 7200000).toISOString()
      }
    ];

    defaultZones.forEach((z) => this.zones.set(z.id, z));
  }

  getAllActiveSurges(city?: string): SurgeZone[] {
    const now = new Date().getTime();
    return Array.from(this.zones.values()).filter((z) => {
      const isNotExpired = new Date(z.expiresAt).getTime() > now;
      const cityMatches = city ? z.city.toLowerCase() === city.toLowerCase() : true;
      return z.isActive && isNotExpired && cityMatches;
    });
  }

  getSurgeForCoordinates(lat: number, lng: number): SurgeZone | null {
    for (const zone of this.zones.values()) {
      const dist = this.haversineDistanceKm(lat, lng, zone.latitude, zone.longitude) * 1000;
      if (dist <= zone.radiusMeters) {
        return zone;
      }
    }
    return null;
  }

  activateBoost(userId: string): { success: boolean; multiplier: number; durationMinutes: number } {
    return {
      success: true,
      multiplier: 3.0,
      durationMinutes: 30
    };
  }

  private haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
