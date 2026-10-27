import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@Injectable()
export class AiService {
  constructor(private readonly store: MemoryStoreService) {}

  generateCompatibilityReasons(userAId: string, userBId: string): { score: number; reasons: string[] } {
    const profA = this.store.profiles.get(userAId);
    const profB = this.store.profiles.get(userBId);

    if (!profA || !profB) {
      return { score: 75, reasons: ['Both open to meaningful connections'] };
    }

    const reasons: string[] = [];
    let score = 65;

    // Shared interests
    const namesA = new Set(profA.interests.map((i) => i.name.toLowerCase()));
    const sharedInterests = profB.interests.filter((i) => namesA.has(i.name.toLowerCase()));

    if (sharedInterests.length > 0) {
      score += Math.min(25, sharedInterests.length * 10);
      reasons.push(`You both love ${sharedInterests.map((i) => i.name).join(' and ')}`);
    }

    // Same city
    if (profA.city && profB.city && profA.city.toLowerCase() === profB.city.toLowerCase()) {
      score += 10;
      reasons.push(`Both based in ${profA.city}`);
    }

    // Compatible intention
    if (profA.relationshipIntention === profB.relationshipIntention) {
      score += 10;
      reasons.push('Aligned connection intentions');
    }

    if (reasons.length === 0) {
      reasons.push('Similar vibe and active in local communities');
    }

    return {
      score: Math.min(98, score),
      reasons
    };
  }

  generateIcebreakers(userAId: string, userBId: string): string[] {
    const profB = this.store.profiles.get(userBId);
    if (!profB) {
      return [
        'Hey! What was the highlight of your week? ✨',
        'Filter coffee or cold brew? ☕',
        'Tell me your favorite spot in town!'
      ];
    }

    const icebreakers: string[] = [];

    if (profB.interests.length > 0) {
      const firstInterest = profB.interests[0].name;
      icebreakers.push(`Hey! I noticed you enjoy ${firstInterest}. What got you into that? ✨`);
    }

    if (profB.prompts.length > 0) {
      const firstPrompt = profB.prompts[0];
      icebreakers.push(`Loved your answer to "${firstPrompt.question}"! How long have you felt that way? 😄`);
    }

    icebreakers.push('Filter coffee or matcha latte on a lazy Sunday morning? ☕');
    icebreakers.push(`Hey ${profB.displayName}! If you could teleport anywhere this weekend, where would you go? ✈️`);

    return icebreakers.slice(0, 3);
  }

  improveBio(currentBio: string, intention: string): { suggestions: string[] } {
    return {
      suggestions: [
        `${currentBio.trim()} | Love weekend filter coffees and indie vinyl records. Always up for good conversations.`,
        `Curious explorer, badminton enthusiast, and coffee lover. Looking for genuine vibes and spontaneous city walks.`,
        `Designing products by day, hunting down the best sunset cafes by evening. Say hi with your favourite song!`
      ]
    };
  }
}
