import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../../common/database/memory-store.service';
import { RelationshipIntention, ConnectionMode } from '@pairup/domain-types';

export interface CompatibilityAnalysis {
  overallScore: number; // 0 to 100
  breakdown: {
    sharedInterestsScore: number;
    intentionAlignmentScore: number;
    locationSynergyScore: number;
    vibeMatchScore: number;
  };
  reasons: string[];
  suggestedIcebreaker: string;
  recommendedDateIdea: string;
}

export interface ToxicityAnalysis {
  isSafe: boolean;
  toxicityScore: number; // 0.0 to 1.0
  flags: string[];
  suggestedAction: 'ALLOW' | 'FLAG_FOR_REVIEW' | 'BLOCK';
}

@Injectable()
export class AiService {
  constructor(private readonly store: MemoryStoreService) {}

  /**
   * Computes a multi-dimensional AI compatibility matrix between two members
   */
  generateCompatibilityReasons(userAId: string, userBId: string): CompatibilityAnalysis {
    const profA = this.store.profiles.get(userAId);
    const profB = this.store.profiles.get(userBId);

    if (!profA || !profB) {
      return {
        overallScore: 78,
        breakdown: {
          sharedInterestsScore: 20,
          intentionAlignmentScore: 20,
          locationSynergyScore: 20,
          vibeMatchScore: 18
        },
        reasons: ['Both open to meaningful social connections in your city'],
        suggestedIcebreaker: 'Hey! What was the highlight of your week? ✨',
        recommendedDateIdea: 'Filter coffee and a walk through an art gallery'
      };
    }

    const reasons: string[] = [];

    // 1. Shared Interests Match (Max 35 pts)
    const setA = new Set(profA.interests.map((i) => i.name.toLowerCase()));
    const sharedInterests = profB.interests.filter((i) => setA.has(i.name.toLowerCase()));
    let sharedInterestsScore = 15;
    if (sharedInterests.length > 0) {
      sharedInterestsScore = Math.min(35, 15 + sharedInterests.length * 8);
      reasons.push(`You both love ${sharedInterests.map((i) => i.name).join(' & ')}`);
    } else {
      reasons.push('Complementary lifestyle passions that invite great discovery');
    }

    // 2. Intention Alignment (Max 25 pts)
    let intentionAlignmentScore = 10;
    if (profA.relationshipIntention === profB.relationshipIntention) {
      intentionAlignmentScore = 25;
      reasons.push('Aligned intentions: both seeking the same journey');
    } else if (
      profA.relationshipIntention === RelationshipIntention.OPEN_TO_DISCUSS ||
      profB.relationshipIntention === RelationshipIntention.OPEN_TO_DISCUSS
    ) {
      intentionAlignmentScore = 18;
      reasons.push('Open-minded approaches to genuine connection');
    }

    // 3. Location Synergy (Max 20 pts)
    let locationSynergyScore = 10;
    if (profA.city && profB.city && profA.city.toLowerCase() === profB.city.toLowerCase()) {
      locationSynergyScore = 20;
      reasons.push(`Both based in ${profA.city} — easy to grab spontaneous coffee`);
    }

    // 4. Vibe & Prompt Synergy (Max 20 pts)
    let vibeMatchScore = 16;
    if (profA.prompts.length > 0 && profB.prompts.length > 0) {
      vibeMatchScore = 19;
      reasons.push('Shared wit and engaging conversation prompts');
    }

    const overallScore = Math.min(99, Math.max(50, sharedInterestsScore + intentionAlignmentScore + locationSynergyScore + vibeMatchScore));

    // Dynamic Date Idea
    let recommendedDateIdea = 'Filter coffee & quiet conversation at a cosy bookstore cafe';
    if (sharedInterests.some((i) => /music|concert|indie/i.test(i.name))) {
      recommendedDateIdea = 'Catching a weekend live acoustic gig or vinyl listening bar';
    } else if (sharedInterests.some((i) => /food|brew|coffee|baking/i.test(i.name))) {
      recommendedDateIdea = 'Artisanal sourdough bakery breakfast followed by pour-over tastings';
    } else if (sharedInterests.some((i) => /trek|badminton|run|cycle|fitness/i.test(i.name))) {
      recommendedDateIdea = 'Sunday morning cycling sprint or outdoor badminton duel';
    }

    const icebreakers = this.generateIcebreakers(userAId, userBId);
    const suggestedIcebreaker = icebreakers[0] || 'Hey! What is your go-to weekend ritual? ✨';

    return {
      overallScore,
      breakdown: {
        sharedInterestsScore,
        intentionAlignmentScore,
        locationSynergyScore,
        vibeMatchScore
      },
      reasons,
      suggestedIcebreaker,
      recommendedDateIdea
    };
  }

  /**
   * Generates tailored conversation openers across distinct conversational tones
   */
  generateIcebreakers(userAId: string, userBId: string, category: string = 'all'): string[] {
    const profB = this.store.profiles.get(userBId);
    const firstName = profB?.displayName?.split(' ')[0] || 'there';

    const pool: { category: string; prompt: string }[] = [];

    if (profB && profB.interests.length > 0) {
      const topInterest = profB.interests[0].name;
      pool.push({
        category: 'shared_interest',
        prompt: `Hey ${firstName}! I noticed you're into ${topInterest}. What got you passionate about that? ✨`
      });
      if (profB.interests.length > 1) {
        pool.push({
          category: 'shared_interest',
          prompt: `${profB.interests[1].name} and good conversations — seems like you have the ultimate weekend combo! 🎨`
        });
      }
    }

    if (profB && profB.prompts && profB.prompts.length > 0) {
      const p = profB.prompts[0];
      pool.push({
        category: 'prompt_response',
        prompt: `Your answer to "${p.question}" made me smile! How long have you felt that way? 😄`
      });
    }

    // Curated Indian & Global Icebreaker collection
    pool.push(
      {
        category: 'foodie',
        prompt: `Serious question, ${firstName}: South Indian filter coffee or artisanal cold brew on a lazy morning? ☕`
      },
      {
        category: 'wanderlust',
        prompt: `If you could teleport to any beach or mountain spot this weekend, where are you headed? ✈️`
      },
      {
        category: 'playful',
        prompt: `Quick vibe check: What song is currently playing in your head on repeat? 🎵`
      },
      {
        category: 'deep',
        prompt: `What is one little thing that made you genuinely happy this week? ✨`
      },
      {
        category: 'indie',
        prompt: `Tell me your absolute favorite hidden gem cafe in ${profB?.city || 'town'}! 🌇`
      }
    );

    if (category !== 'all') {
      const filtered = pool.filter((p) => p.category === category);
      if (filtered.length > 0) return filtered.map((f) => f.prompt);
    }

    return pool.map((p) => p.prompt).slice(0, 5);
  }

  /**
   * AI Bio Assistant with distinct persona rewrites
   */
  improveBio(currentBio: string, intention: string, tone: 'charismatic' | 'witty' | 'minimalist' = 'charismatic'): { suggestions: string[] } {
    const base = currentBio?.trim() || '';

    switch (tone) {
      case 'witty':
        return {
          suggestions: [
            `${base ? base + ' · ' : ''}Professional over-thinker, amateur sourdough enthusiast. 90% good vibes, 10% asking for song recommendations.`,
            `Here for great conversations and people who actually reply in under 3 business days. Let's debate the best street food in town.`,
            `Certified coffee addict. Fluent in sarcasm, Spotify playlists, and knowing which lane is fastest in traffic.`
          ]
        };
      case 'minimalist':
        return {
          suggestions: [
            `Design · Filter Coffee · Spontaneous road trips. Seeking genuine connections & good energy.`,
            `Books, bad puns, and city sunsets. Looking for someone to explore hidden cafes with.`,
            `Curious mind, warm heart. Here for sincere conversations and good laughs.`
          ]
        };
      case 'charismatic':
      default:
        return {
          suggestions: [
            `${base ? base + ' | ' : ''}Architecting by day, vinyl hunter by evening. Always down for sunset walks and honest conversations.`,
            `Passionate about creative projects, weekend tennis, and discovering indie cafes. Say hi with your favorite track! 🎶`,
            `Believer in good karma, hearty laughs, and sharing desserts. Looking for a partner in adventure and cosy Sunday mornings.`
          ]
        };
    }
  }

  /**
   * Fast safety toxicity & solicitations classifier for chat messages and bio text
   */
  classifyContentSafety(text: string): ToxicityAnalysis {
    const lower = text.toLowerCase();
    const flags: string[] = [];
    let toxicityScore = 0.0;

    // Financial / Solicitation patterns
    if (/[0-9]{10}|@[a-z]{3,10}|upi|paytm|gpay|crypto|forex|send money/i.test(lower)) {
      flags.push('FINANCIAL_SOLICITATION_DETECTED');
      toxicityScore += 0.5;
    }

    // Inappropriate / Abusive keywords check
    const abusiveTerms = ['scam', 'cheat', 'abuse', 'hate', 'harass', 'kill', 'fraud'];
    for (const term of abusiveTerms) {
      if (lower.includes(term)) {
        flags.push(`SUSPICIOUS_CONTENT_${term.toUpperCase()}`);
        toxicityScore += 0.35;
      }
    }

    // Underage grooming alerts
    if (/minor|under\s*18|school\s*kid|teen/i.test(lower)) {
      flags.push('POTENTIAL_UNDERAGE_REFERENCE');
      toxicityScore += 0.7;
    }

    toxicityScore = Math.min(1.0, toxicityScore);
    const isSafe = toxicityScore < 0.4;
    const suggestedAction =
      toxicityScore >= 0.7 ? 'BLOCK' : toxicityScore >= 0.4 ? 'FLAG_FOR_REVIEW' : 'ALLOW';

    return {
      isSafe,
      toxicityScore,
      flags,
      suggestedAction
    };
  }
}
