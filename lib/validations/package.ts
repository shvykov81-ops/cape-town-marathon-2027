import { z } from "zod";

export const packageSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters")
    .trim(),
  type: z.string()
    .min(1, "Type is required")
    .max(100, "Type must be less than 100 characters")
    .trim(),
  durationDays: z.coerce.number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 day")
    .max(365, "Duration must be less than 365 days"),
  priceBase: z.coerce.number()
    .min(0, "Price must be non-negative")
    .max(999999.99, "Price is too high"),
  maxParticipants: z.coerce.number()
    .int("Max participants must be a whole number")
    .min(1, "Must allow at least 1 participant")
    .max(1000, "Max participants is too high"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters")
    .trim(),
  includes: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});

export const packageUpdateSchema = packageSchema.partial().extend({
  id: z.string().cuid("Invalid package ID"),
});

export type PackageFormData = z.infer<typeof packageSchema>;
export type PackageUpdateData = z.infer<typeof packageUpdateSchema>;
