import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTrainerApplicationNotification } from "@/lib/telegram";
import { z } from "zod";

const applicationSchema = z.object({
  experience: z.string().max(1000).optional(),
  specialties: z.array(z.string().max(50)).max(10).optional(),
  languages: z.array(z.string().max(10)).max(5).optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting: 3 applications per hour per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip, 3)) {
    return NextResponse.json(
      { error: "Too many applications. Please try again later." },
      { status: 429 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check if user already has a trainer profile
  const existing = await prisma.trainer.findFirst({
    where: { userId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You already have a trainer profile", status: existing.status },
      { status: 400 }
    );
  }

  // Check if user already applied
  const existingRequest = await prisma.trainerApplication.findFirst({
    where: { userId },
  });

  if (existingRequest) {
    return NextResponse.json(
      { error: "Application already submitted", status: existingRequest.status },
      { status: 400 }
    );
  }

  // Validate optional body
  let body = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is OK
  }
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Create application
  const application = await prisma.trainerApplication.create({
    data: {
      userId,
      status: "PENDING",
      note: parsed.data.experience || null,
    },
  });

  // Notify admin via Telegram (non-blocking)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (user) {
    sendTrainerApplicationNotification({
      name: user.name || user.email,
      email: user.email,
      applicationId: application.id,
      createdAt: application.createdAt,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true, application });
}
