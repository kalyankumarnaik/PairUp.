import { z } from 'zod';

export const SwipeDecisionSchema = z.object({
  targetUserId: z.string().uuid('Invalid user ID'),
  action: z.enum(['LIKE', 'PASS', 'SUPER_LIKE']),
  connectionMode: z.enum(['DATING', 'FRIENDSHIP', 'BOTH'])
});

export const DiscoveryQuerySchema = z.object({
  minAge: z.coerce.number().min(18).max(99).optional().default(18),
  maxAge: z.coerce.number().min(18).max(99).optional().default(50),
  maxDistanceKm: z.coerce.number().min(1).max(200).optional().default(50),
  connectionMode: z.enum(['DATING', 'FRIENDSHIP', 'BOTH']).optional().default('DATING'),
  genderPreferences: z
    .array(z.enum(['WOMAN', 'MAN', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY']))
    .optional(),
  category: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional().default(20)
});

export type SwipeDecisionInput = z.infer<typeof SwipeDecisionSchema>;
export type DiscoveryQueryInput = z.infer<typeof DiscoveryQuerySchema>;
