import { z } from "zod";

export const reviewSchema = z.object({
  bookingId: z.string().cuid("Invalid booking ID").optional().nullable(),
  trainerId: z.string().cuid("Invalid trainer ID").optional().nullable(),
  rating: z.coerce.number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  text: z.string()
    .min(10, "Review text must be at least 10 characters")
    .max(5000, "Review text must be less than 5000 characters")
    .trim(),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
