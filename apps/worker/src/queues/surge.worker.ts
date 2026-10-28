import { ActivitySurgeJobData } from '../types';

export class SurgeWorker {
  // Activity surge threshold: >= 150 active connections within 15 mins triggers surge
  private static readonly SURGE_MINIMUM_ACTIVE = 150;

  public static async process(job: ActivitySurgeJobData): Promise<{
    surgeActive: boolean;
    multiplier: number;
    city: string;
    activeCount: number;
    broadcastPayload?: {
      title: string;
      message: string;
      multiplier: number;
    };
  }> {
    const isSurge = job.activeCount >= this.SURGE_MINIMUM_ACTIVE;

    let multiplier = 1.0;
    if (job.activeCount >= 400) {
      multiplier = 2.4;
    } else if (job.activeCount >= 250) {
      multiplier = 2.0;
    } else if (job.activeCount >= this.SURGE_MINIMUM_ACTIVE) {
      multiplier = 1.5;
    }

    if (isSurge) {
      return {
        surgeActive: true,
        multiplier,
        city: job.city,
        activeCount: job.activeCount,
        broadcastPayload: {
          title: `⚡ Activity Surge Active in ${job.city}!`,
          message: `${job.activeCount}+ active members nearby right now. Match rate is boosted ${multiplier}x!`,
          multiplier
        }
      };
    }

    return {
      surgeActive: false,
      multiplier: 1.0,
      city: job.city,
      activeCount: job.activeCount
    };
  }
}
