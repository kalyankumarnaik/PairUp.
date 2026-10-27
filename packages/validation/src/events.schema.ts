import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  category: z.string().min(2).max(50),
  emoji: z.string().min(1).max(8),
  venueName: z.string().min(3).max(120),
  approximateLocation: z.string().min(3).max(120),
  city: z.string().min(2).max(80),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  capacity: z.number().int().min(2).max(500)
});

export const CreateVoiceRoomSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().max(250).optional(),
  category: z.string().min(2).max(50),
  emoji: z.string().min(1).max(8),
  isPrivate: z.boolean().default(false),
  capacity: z.number().int().min(2).max(100).default(50)
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type CreateVoiceRoomInput = z.infer<typeof CreateVoiceRoomSchema>;
