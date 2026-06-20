import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { syncUserToSheet } from "@/lib/sheets-sync";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().max(20).optional().nullable(),
});

// Simple disposable email check (expand as needed)
const DISPOSABLE_DOMAINS = [
  "tempmail.com", "throwaway.com", "mailinator.com", "guerrillamail.com",
  "yopmail.com", "fakeemail.com", "temp.inbox", "burnermail.io",
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

export async function POST(req: NextRequest) {
  // Rate limiting: 3 registrations per hour per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, "/api/auth/register")) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name, phone } = parsed.data;

    // Check disposable email
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Please use a permanent email address" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        name, 
        phone,
        emailVerified: null, // Will be set after verification
      },
    });

    // TODO: Send verification email via Resend
    // await sendVerificationEmail(user.email, user.id);

    // Sync to Google Sheets (non-blocking)
    syncUserToSheet(user).catch(() => {});

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      message: "Registration successful. Please check your email to verify your account."
    }, { status: 201 });

  } catch (e) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
