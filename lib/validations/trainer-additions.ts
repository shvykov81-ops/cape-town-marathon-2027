// ============================================
// ADDITIONS TO lib/validations/trainer.ts
// Add these schemas to your existing trainer.ts file
// ============================================

import { z } from "zod";

// ─── T-6: Structured Rejection Reasons ───────────────────

export const RejectionReason = {
  INCOMPLETE_PROFILE: "Profile is incomplete (missing photo/bio)",
  PHOTO_QUALITY: "Main photo does not meet quality standards",
  CREDENTIALS_MISSING: "Credentials or certifications required",
  BIO_INAPPROPRIATE: "Bio contains inappropriate content",
  CONTACT_INFO: "Contact information needs updating",
  EXPERIENCE_INSUFFICIENT: "Insufficient coaching experience",
  OTHER: "Other (see detailed note)",
} as const;

export const rejectionReasonSchema = z.enum([
  "INCOMPLETE_PROFILE",
  "PHOTO_QUALITY",
  "CREDENTIALS_MISSING",
  "BIO_INAPPROPRIATE",
  "CONTACT_INFO",
  "EXPERIENCE_INSUFFICIENT",
  "OTHER",
]);

export type RejectionReasonType = z.infer<typeof rejectionReasonSchema>;

// Updated moderation action schema with structured reasons
export const moderationActionSchemaV2 = z.object({
  action: z.enum(["APPROVE", "REJECT", "SUSPEND"]),
  reason: rejectionReasonSchema.optional(),
  detailedNote: z.string().max(2000).optional(),
});

export type ModerationActionInputV2 = z.infer<typeof moderationActionSchemaV2>;

// ─── Revision Query Schema ───────────────────────────────

export const revisionQuerySchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type RevisionQueryInput = z.infer<typeof revisionQuerySchema>;

// ─── Application Query Schema ────────────────────────────

export const applicationQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
});

export type ApplicationQueryInput = z.infer<typeof applicationQuerySchema>;
