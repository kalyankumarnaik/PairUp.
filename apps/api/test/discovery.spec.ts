import { describe, expect, it, beforeEach } from 'vitest';
import { DiscoveryService } from '../src/modules/discovery/discovery.service';
import { LocationService } from '../src/modules/location/location.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { SwipeAction } from '@pairup/domain-types';

describe('DiscoveryService & Mutual Matching Engine', () => {
  let discoveryService: DiscoveryService;
  let locationService: LocationService;
  let store: MemoryStoreService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    locationService = new LocationService(store);
    discoveryService = new DiscoveryService(store, locationService);
  });

  it('records swipe decisions properly', () => {
    const res = discoveryService.processSwipe('usr_demo_1', 'usr_demo_3', SwipeAction.LIKE, 'DATING');
    expect(res.isMatch).toBe(false);
  });

  it('generates a mutual match when two users like each other', () => {
    // User 3 likes User 4
    const firstSwipe = discoveryService.processSwipe('usr_demo_3', 'usr_demo_4', SwipeAction.LIKE, 'DATING');
    expect(firstSwipe.isMatch).toBe(false);

    // User 4 likes User 3 back
    const secondSwipe = discoveryService.processSwipe('usr_demo_4', 'usr_demo_3', SwipeAction.LIKE, 'DATING');
    expect(secondSwipe.isMatch).toBe(true);
    expect(secondSwipe.matchId).toBeDefined();
    expect(secondSwipe.matchedProfile).toBeDefined();
  });

  it('allows rewinding the previous decision', () => {
    discoveryService.processSwipe('usr_demo_1', 'usr_demo_5', SwipeAction.PASS, 'DATING');
    const rewindRes = discoveryService.rewindLastDecision('usr_demo_1');
    expect(rewindRes.rewound).toBe(true);
    expect(rewindRes.targetUserId).toBe('usr_demo_5');
  });

  it('prevents self swiping', () => {
    expect(() => {
      discoveryService.processSwipe('usr_demo_1', 'usr_demo_1', SwipeAction.LIKE, 'DATING');
    }).toThrow(/cannot swipe on your own/);
  });
});
