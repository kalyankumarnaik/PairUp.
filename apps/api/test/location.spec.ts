import { describe, expect, it, beforeEach } from 'vitest';
import { LocationService } from '../src/modules/location/location.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { calculateHaversineDistanceKm } from '@pairup/test-utils';

describe('LocationService & Distance Masking', () => {
  let locationService: LocationService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    locationService = new LocationService(store);
  });

  it('calculates Haversine distance accurately between Mumbai coordinates', () => {
    // Bandra (19.0596, 72.8295) to Marine Drive (18.9438, 72.8233)
    const distanceKm = calculateHaversineDistanceKm(19.0596, 72.8295, 18.9438, 72.8233);
    expect(distanceKm).toBeGreaterThan(10);
    expect(distanceKm).toBeLessThan(15);
  });

  it('updates location coordinates and city', () => {
    const res = locationService.updateLocation('usr_demo_1', 19.076, 72.8777, 'Mumbai', 'Maharashtra');
    expect(res.updated).toBe(true);

    const loc = locationService.getCurrentLocation('usr_demo_1');
    expect(loc.city).toBe('Mumbai');
  });

  it('never returns raw coordinates in discovery cards', () => {
    const nearby = locationService.findNearbyProfiles('usr_demo_1', 50);
    expect(nearby.length).toBeGreaterThan(0);

    nearby.forEach((card: any) => {
      // Must NOT contain raw latitude or longitude
      expect(card.latitude).toBeUndefined();
      expect(card.longitude).toBeUndefined();
      // Must contain privacy-safe approximate distance
      expect(typeof card.approximateDistanceKm).toBe('number');
    });
  });

  it('excludes users who have paused their location', () => {
    locationService.setPaused('usr_demo_2', true);
    const nearby = locationService.findNearbyProfiles('usr_demo_1', 50);
    const found = nearby.find((c) => c.userId === 'usr_demo_2');
    expect(found).toBeUndefined();
  });
});
