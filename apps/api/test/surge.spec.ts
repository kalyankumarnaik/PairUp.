import { describe, expect, it, beforeEach } from 'vitest';
import { SurgeService } from '../src/modules/surge/surge.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';

describe('SurgeService - Real-Time Proximity Surges & Multipliers', () => {
  let surgeService: SurgeService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    surgeService = new SurgeService(store);
  });

  it('retrieves active activity surges', () => {
    const surges = surgeService.getAllActiveSurges();
    expect(surges.length).toBeGreaterThan(0);
    expect(surges[0].surgeMultiplier).toBeGreaterThanOrEqual(1.5);
    expect(surges[0].activeUsersCount).toBeGreaterThan(0);
  });

  it('filters active surges by metropolitan city', () => {
    const blrSurges = surgeService.getAllActiveSurges('Bengaluru');
    expect(blrSurges.length).toBeGreaterThan(0);
    expect(blrSurges.every((s) => s.city.toLowerCase() === 'bengaluru')).toBe(true);

    const mumSurges = surgeService.getAllActiveSurges('Mumbai');
    expect(mumSurges.length).toBeGreaterThan(0);
    expect(mumSurges.every((s) => s.city.toLowerCase() === 'mumbai')).toBe(true);
  });

  it('detects when GPS coordinates fall inside an active surge radius', () => {
    // Indiranagar coordinates: 12.9716, 77.6412
    const surge = surgeService.getSurgeForCoordinates(12.9718, 77.6415);
    expect(surge).toBeDefined();
    expect(surge?.name).toContain('Indiranagar');
    expect(surge?.surgeMultiplier).toBeGreaterThanOrEqual(2.0);
  });

  it('returns null when coordinates are outside any surge zone', () => {
    // Remote coordinates
    const surge = surgeService.getSurgeForCoordinates(0.0, 0.0);
    expect(surge).toBeNull();
  });

  it('activates user profile boost multiplier', () => {
    const boost = surgeService.activateBoost('usr_demo_1');
    expect(boost.success).toBe(true);
    expect(boost.multiplier).toBe(3.0);
    expect(boost.durationMinutes).toBe(30);
  });
});
