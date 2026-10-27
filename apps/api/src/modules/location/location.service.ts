import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryCard, UserProfile } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { calculateHaversineDistanceKm } from '@pairup/test-utils';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly store: MemoryStoreService) {}

  updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
    city?: string,
    state?: string
  ): { updated: boolean } {
    const existing = this.store.locations.get(userId) || {
      latitude: 19.076,
      longitude: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      isPaused: false
    };

    existing.latitude = latitude;
    existing.longitude = longitude;
    if (city) existing.city = city;
    if (state) existing.state = state;

    this.store.locations.set(userId, existing);

    // Also update profile city if given
    const profile = this.store.profiles.get(userId);
    if (profile && city) {
      profile.city = city;
      if (state) profile.state = state;
    }

    this.logger.log(`Location updated for user ${userId}: (${latitude}, ${longitude}) - ${city}`);
    return { updated: true };
  }

  getCurrentLocation(userId: string) {
    const loc = this.store.locations.get(userId);
    return loc || {
      latitude: 19.076,
      longitude: 72.8777,
      city: 'Mumbai',
      state: 'Maharashtra',
      isPaused: false
    };
  }

  setPaused(userId: string, isPaused: boolean) {
    const loc = this.getCurrentLocation(userId);
    loc.isPaused = isPaused;
    this.store.locations.set(userId, loc);
    return { isPaused };
  }

  findNearbyProfiles(
    currentUserId: string,
    radiusKm: number = 25,
    cityFilter?: string
  ): DiscoveryCard[] {
    const myLoc = this.getCurrentLocation(currentUserId);
    const myBlocked = this.store.blockedUsers.get(currentUserId) || new Set();

    const results: DiscoveryCard[] = [];

    for (const [userId, profile] of this.store.profiles.entries()) {
      if (userId === currentUserId) continue; // Skip self
      if (!profile.isVisible) continue; // Skip hidden
      if (myBlocked.has(userId)) continue; // Skip blocked

      const targetLoc = this.store.locations.get(userId);
      if (!targetLoc || targetLoc.isPaused) continue;

      let distanceKm: number | null = null;
      if (myLoc && targetLoc) {
        distanceKm = calculateHaversineDistanceKm(
          myLoc.latitude,
          myLoc.longitude,
          targetLoc.latitude,
          targetLoc.longitude
        );
      }

      // If user specified cityFilter, match city, otherwise filter by radius
      if (cityFilter && cityFilter !== 'All') {
        if (!profile.city || !profile.city.toLowerCase().includes(cityFilter.toLowerCase())) {
          continue;
        }
      } else if (distanceKm !== null && distanceKm > radiusKm) {
        continue;
      }

      // Return sanitized discovery card WITHOUT raw coordinates
      results.push({
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        age: profile.age,
        bio: profile.bio,
        gender: profile.gender,
        pronouns: profile.pronouns,
        relationshipIntention: profile.relationshipIntention,
        connectionMode: profile.connectionMode,
        city: profile.city,
        approximateDistanceKm: distanceKm !== null ? Math.round(distanceKm * 10) / 10 : null,
        interests: profile.interests,
        photos: profile.photos.filter((p) => p.isModerated),
        prompts: profile.prompts,
        verificationStatus: profile.verificationStatus,
        compatibilityScore: 85,
        compatibilityReasons: ['Nearby in ' + (profile.city || 'your area'), 'Shared lifestyle interests']
      });
    }

    return results;
  }
}
