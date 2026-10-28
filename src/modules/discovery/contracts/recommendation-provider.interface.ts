import { Gender, RelationshipIntent } from '@prisma/client';

export interface DiscoveryFilterOptions {
  userId: string;
  minAge?: number;
  maxAge?: number;
  genderPreferences?: Gender[];
  maxDistanceKm?: number;
  intentPreferences?: RelationshipIntent[];
  limit?: number;
  cursor?: string;
}

export interface ScoredCandidate {
  userId: string;
  score: number;
  distanceKm?: number;
  sharedInterestsCount: number;
  matchReasons?: string[];
}

export interface IRecommendationProvider {
  /**
   * Generates candidate user IDs ranked by compatibility.
   * Member 4 replaces/augments this with machine learning vector scoring.
   */
  getCandidates(options: DiscoveryFilterOptions): Promise<ScoredCandidate[]>;
}

export const RECOMMENDATION_PROVIDER_TOKEN = 'IRecommendationProvider';
