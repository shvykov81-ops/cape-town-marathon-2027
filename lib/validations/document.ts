import { z } from "zod";

export const documentSchema = z.object({
  name: z.string()
    .min(1, "Document name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
  type: z.string()
    .min(1, "Document type is required")
    .max(100, "Type must be less than 100 characters")
    .trim(),
  url: z.string()
    .url("Document URL must be a valid URL")
    .max(2000, "URL is too long"),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
