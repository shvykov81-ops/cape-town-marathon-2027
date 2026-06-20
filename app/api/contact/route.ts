import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/telegram";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  phone: z.string().max(20).optional().nullable(),
  subject: z.enum(["GENERAL", "PREP_CAMP", "TRAINER", "PARTNERSHIP", "MEDIA"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting: 5 submissions per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, "/api/contact")) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, honeypot } = parsed.data;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // Send Telegram notification (non-blocking)
    sendContactNotification({
      name,
      email,
      phone,
      subject,
      message,
      createdAt: contactMessage.createdAt,
    }).catch(() => {});

    return NextResponse.json({ success: true, id: contactMessage.id });
  } catch (e) {
    console.error("Contact form error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
