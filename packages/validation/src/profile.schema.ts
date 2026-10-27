import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(2).max(40).optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  gender: z.enum(['WOMAN', 'MAN', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  pronouns: z.string().max(30).optional().nullable(),
  relationshipIntention: z
    .enum(['LONG_TERM', 'CASUAL', 'DATING_TO_MARRY', 'NEW_FRIENDS', 'ACTIVITY_PARTNER', 'NOT_SURE_YET'])
    .optional(),
  connectionMode: z.enum(['DATING', 'FRIENDSHIP', 'BOTH']).optional(),
  education: z.string().max(100).optional().nullable(),
  occupation: z.string().max(100).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  state: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  languages: z.array(z.string().min(1).max(50)).max(10).optional(),
  interestIds: z.array(z.string().uuid()).max(15).optional(),
  prompts: z
    .array(
      z.object({
        question: z.string().min(5).max(120),
        answer: z.string().min(1).max(300)
      })
    )
    .max(3)
    .optional(),
  isVisible: z.boolean().optional(),
  isIncognito: z.boolean().optional()
});

export const PhotoReorderSchema = z.object({
  photoIds: z.array(z.string().uuid()).min(1).max(9)
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type PhotoReorderInput = z.infer<typeof PhotoReorderSchema>;
