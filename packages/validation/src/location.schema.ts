import { z } from 'zod';

export const LocationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  isPaused: z.boolean().optional()
});

export const ManualLocationSchema = z.object({
  city: z.string().min(2).max(100),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().default('India'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export type LocationUpdateInput = z.infer<typeof LocationUpdateSchema>;
export type ManualLocationInput = z.infer<typeof ManualLocationSchema>;
