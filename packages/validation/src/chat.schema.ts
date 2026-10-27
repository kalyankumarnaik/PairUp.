import { z } from 'zod';

export const SendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  type: z.enum(['TEXT', 'IMAGE', 'VOICE_NOTE', 'ICEBREAKER', 'SYSTEM']).default('TEXT'),
  content: z.string().max(2000, 'Message cannot exceed 2000 characters'),
  attachmentUrls: z.array(z.string().url()).max(5).optional(),
  voiceDurationSeconds: z.number().min(1).max(300).optional(),
  waveform: z.array(z.number()).optional()
});

export const AddReactionSchema = z.object({
  messageId: z.string().uuid(),
  emoji: z.string().min(1).max(8)
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type AddReactionInput = z.infer<typeof AddReactionSchema>;
