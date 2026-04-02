import { z } from "zod";

export const itineraryItemSchema = z.object({
  timeBlock: z.enum(["morning", "afternoon", "evening"]),
  type: z.enum(["activity", "meal", "transport"]),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  durationMins: z.number().int().positive(),
  estimatedCost: z.number().nonnegative(),
  isOptional: z.boolean().default(false),
});

export const itineraryDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  theme: z.string().min(1),
  summary: z.string().min(1),
  items: z.array(itineraryItemSchema).min(1),
});

export const itineraryResponseSchema = z.array(itineraryDaySchema).min(1);

export const rewriteDayResponseSchema = itineraryDaySchema;

export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryResponse = z.infer<typeof itineraryResponseSchema>;
