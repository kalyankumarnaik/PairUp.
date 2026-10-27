import { z } from 'zod';

export const CreateReportSchema = z.object({
  reportedUserId: z.string().uuid(),
  category: z.enum([
    'HARASSMENT',
    'INAPPROPRIATE_CONTENT',
    'SPAM',
    'FAKE_PROFILE',
    'UNDERAGE',
    'OFFENSIVE_LANGUAGE',
    'SCAM'
  ]),
  reason: z.string().min(5).max(1000),
  evidenceUrls: z.array(z.string().url()).max(5).optional()
});

export const ModerationActionSchema = z.object({
  reportId: z.string().uuid(),
  action: z.enum(['WARNING', 'CONTENT_REMOVED', 'SHADOWBAN', 'TEMPORARY_SUSPENSION', 'PERMANENT_BAN']),
  moderatorNotes: z.string().min(3).max(1000)
});

export const BlockUserSchema = z.object({
  targetUserId: z.string().uuid()
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;
export type ModerationActionInput = z.infer<typeof ModerationActionSchema>;
export type BlockUserInput = z.infer<typeof BlockUserSchema>;
