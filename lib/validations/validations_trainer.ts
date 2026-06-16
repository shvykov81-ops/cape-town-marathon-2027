import { z } from "zod";

export const trainerSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters")
    .trim(),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters")
    .trim(),
  bio: z.string()
    .min(10, "Bio must be at least 10 characters")
    .max(5000, "Bio must be less than 5000 characters")
    .trim(),
  credentials: z.string()
    .max(1000, "Credentials must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  photoUrl: z.string()
    .url("Photo URL must be a valid URL")
    .max(1000, "URL is too long")
    .optional()
    .or(z.literal("")),
  photos: z.array(z.string().url("Each photo must be a valid URL")).default([]),
  instagramUrl: z.string()
    .url("Instagram URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
  tripsterUrl: z.string()
    .url("Tripster URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
  specialties: z.array(z.string().trim().min(1)).default([]),
  languages: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
});

export const trainerUpdateSchema = trainerSchema.partial().extend({
  id: z.string().cuid("Invalid trainer ID"),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;
export type TrainerUpdateData = z.infer<typeof trainerUpdateSchema>;
