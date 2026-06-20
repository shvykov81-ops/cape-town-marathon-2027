import { z } from "zod";
import { TrainerProfileStatus } from "@prisma/client";

// ─── Shared ──────────────────────────────────────────────

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug must be at most 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase, hyphens only)");

export const urlSchema = z
  .string()
  .url("Must be a valid URL")
  .max(500, "URL too long")
  .optional()
  .or(z.literal(""));

// ─── Backward-compatible base schemas (used by existing code) ─

export const trainerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").max(200),
  photoUrl: z.string().url().max(500).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  specialties: z.array(z.string().max(50)).max(20).optional(),
  languages: z.array(z.string().max(30)).max(10).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const trainerUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().max(200).optional(),
  photoUrl: z.string().url().max(500).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  specialties: z.array(z.string().max(50)).max(20).optional(),
  languages: z.array(z.string().max(30)).max(10).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  rating: z.number().min(0).max(5).optional(),
});

// ─── Trainer Self-Service Update ───────────────────────────

export const trainerSelfServiceUpdateSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100).optional(),
  headline: z.string().max(200).optional().or(z.literal("")),
  bioHtml: z.string().max(10000).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  credentials: z.string().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().url().max(500).optional().or(z.literal("")),
  photos: z.array(z.string().url().max(500)).max(20).optional(),
  videoUrl: urlSchema,
  videoThumbnail: urlSchema,
  stravaUrl: urlSchema,
  websiteUrl: urlSchema,
  instagramUrl: urlSchema,
  tripsterUrl: urlSchema,
  specialties: z.array(z.string().max(50)).max(20).optional(),
  languages: z.array(z.string().max(30)).max(10).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  maxClientsPerMonth: z.number().int().min(1).max(100).optional(),
});

export type TrainerSelfServiceUpdateInput = z.infer<typeof trainerSelfServiceUpdateSchema>;

// ─── Trainer Submit for Moderation ───────────────────────

export const trainerSubmitSchema = z.object({
  confirm: z.literal(true, {
    errorMap: () => ({ message: "You must confirm submission" }),
  }),
});

// ─── Admin Moderation ────────────────────────────────────

export const moderationActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "SUSPEND"]),
  reason: z.string().max(2000).optional(),
});

export type ModerationActionInput = z.infer<typeof moderationActionSchema>;

// ─── Admin Force Edit ────────────────────────────────────

export const adminTrainerUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  headline: z.string().max(200).optional().or(z.literal("")),
  bioHtml: z.string().max(10000).optional().or(z.literal("")),
  bio: z.string().max(5000).optional().or(z.literal("")),
  credentials: z.string().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().url().max(500).optional().or(z.literal("")),
  photos: z.array(z.string().url().max(500)).max(20).optional(),
  videoUrl: urlSchema,
  videoThumbnail: urlSchema,
  stravaUrl: urlSchema,
  websiteUrl: urlSchema,
  instagramUrl: urlSchema,
  tripsterUrl: urlSchema,
  specialties: z.array(z.string().max(50)).max(20).optional(),
  languages: z.array(z.string().max(30)).max(10).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  maxClientsPerMonth: z.number().int().min(1).max(100).optional(),
  status: z.nativeEnum(TrainerProfileStatus).optional(),
  slug: slugSchema.optional(),
});

export type AdminTrainerUpdateInput = z.infer<typeof adminTrainerUpdateSchema>;

// ─── Availability ────────────────────────────────────────

export const availabilitySchema = z.object({
  dates: z.array(
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
      isAvailable: z.boolean().default(true),
      note: z.string().max(200).optional().or(z.literal("")),
    })
  ).max(365, "Cannot set more than 365 dates at once"),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

// ─── Public Listing Filters ────────────────────────────────

export const trainerListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  specialty: z.string().max(50).optional(),
  language: z.string().max(30).optional(),
  sortBy: z.enum(["rating", "experience", "newest", "popular"]).default("rating"),
  search: z.string().max(100).optional(),
});

export type TrainerListQuery = z.infer<typeof trainerListQuerySchema>;
