import { z } from "zod";

// ============================================
// BASE TRAINER SCHEMA (admin creation)
// ============================================
export const trainerSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters")
    .trim(),
  lastName: z.string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters")
    .trim(),
  displayName: z.string()
    .max(100)
    .optional()
    .or(z.literal("")),
  slug: z.string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)")
    .optional()
    .or(z.literal("")),
  headline: z.string()
    .max(200, "Headline must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  bio: z.string()
    .min(10, "Bio must be at least 10 characters")
    .max(5000, "Bio must be less than 5000 characters")
    .trim(),
  bioHtml: z.string()
    .max(10000, "HTML bio must be less than 10000 characters")
    .optional()
    .or(z.literal("")),
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
  videoUrl: z.string()
    .url("Video URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
  videoThumbnail: z.string()
    .url("Thumbnail URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
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
  stravaUrl: z.string()
    .url("Strava URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
  websiteUrl: z.string()
    .url("Website URL must be valid")
    .max(1000)
    .optional()
    .or(z.literal("")),
  specialties: z.array(z.string().trim().min(1)).default([]),
  languages: z.array(z.string().trim().min(1)).default([]),
  experienceYears: z.number().int().min(0).max(100).optional(),
  maxClientsPerMonth: z.number().int().min(1).max(100).optional(),
  isActive: z.boolean().default(true),
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "SUSPENDED"]).default("DRAFT"),
  moderationNote: z.string().max(2000).optional().or(z.literal("")),
});

// ============================================
// TRAINER UPDATE SCHEMA (admin edits)
// ============================================
export const trainerUpdateSchema = trainerSchema.partial().extend({
  id: z.string().cuid("Invalid trainer ID"),
});

// ============================================
// TRAINER SELF-SERVICE SCHEMA (trainer dashboard)
// Only fields trainers can edit themselves
// ============================================
export const trainerSelfServiceSchema = z.object({
  displayName: z.string().max(100).optional().or(z.literal("")),
  headline: z.string().max(200).optional().or(z.literal("")),
  bio: z.string().min(10).max(5000).trim(),
  bioHtml: z.string().max(10000).optional().or(z.literal("")),
  credentials: z.string().max(1000).optional().or(z.literal("")),
  photoUrl: z.string().url().max(1000).optional().or(z.literal("")),
  photos: z.array(z.string().url()).max(10, "Maximum 10 photos allowed").default([]),
  videoUrl: z.string().url().max(1000).optional().or(z.literal("")),
  instagramUrl: z.string().url().max(1000).optional().or(z.literal("")),
  tripsterUrl: z.string().url().max(1000).optional().or(z.literal("")),
  stravaUrl: z.string().url().max(1000).optional().or(z.literal("")),
  websiteUrl: z.string().url().max(1000).optional().or(z.literal("")),
  specialties: z.array(z.string().trim().min(1)).max(10).default([]),
  languages: z.array(z.string().trim().min(1)).max(10).default([]),
  experienceYears: z.number().int().min(0).max(100).optional(),
  maxClientsPerMonth: z.number().int().min(1).max(100).optional(),
});

// ============================================
// MODERATION SCHEMA (admin actions)
// ============================================
export const trainerModerationSchema = z.object({
  action: z.enum(["approve", "reject", "suspend"]),
  reason: z.string().max(2000).optional(),
});

// ============================================
// AVAILABILITY SCHEMA
// ============================================
export const trainerAvailabilitySchema = z.object({
  date: z.string().datetime(),
  isAvailable: z.boolean().default(true),
  note: z.string().max(500).optional().or(z.literal("")),
});

// ============================================
// TYPES
// ============================================
export type TrainerFormData = z.infer<typeof trainerSchema>;
export type TrainerUpdateData = z.infer<typeof trainerUpdateSchema>;
export type TrainerSelfServiceData = z.infer<typeof trainerSelfServiceSchema>;
export type TrainerModerationData = z.infer<typeof trainerModerationSchema>;
export type TrainerAvailabilityData = z.infer<typeof trainerAvailabilitySchema>;
