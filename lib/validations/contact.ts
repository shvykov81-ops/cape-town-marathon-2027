import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'']+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Please enter a valid email")
    .max(255, "Email is too long"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)")
    .optional()
    .or(z.literal("")),
  subject: z.enum(["GENERAL", "PREP_CAMP", "TRAINER", "PARTNERSHIP", "MEDIA"]),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  website: z.string().max(0).optional() // honeypot — must be empty
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
