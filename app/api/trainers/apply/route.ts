import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTrainerApplicationNotification } from "@/lib/telegram";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const applicationSchema = z.object({
  experience: z.string().max(1000).optional(),
  specialties: z.array(z.string().max(50)).max(10).optional(),
  languages: z.array(z.string().max(10)).max(5).optional(),
});

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
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

  const existing = await prisma.trainer.findFirst({ where: { userId } });
  if (existing) {
    return NextResponse.json(
      { error: "You already have a trainer profile", status: existing.status },
      { status: 400 }
    );
  }

  let body = {};
  try { body = await req.json(); } catch { /* empty body OK */ }
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, firstName: true, lastName: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const slug = generateSlug(user.name || user.email || "trainer");

  const [application, trainer] = await prisma.$transaction([
    prisma.trainerApplication.create({
      data: {
        userId,
        status: "APPROVED",
        note: parsed.data.experience || null,
      },
    }),

    prisma.trainer.create({
      data: {
        userId,
        slug,
        firstName: user.firstName || user.name?.split(" ")[0] || "Coach",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        displayName: user.name || "New Coach",
        status: "PUBLISHED",
        headline: null,
        bio: parsed.data.experience || "",
        specialties: parsed.data.specialties || [],
        languages: parsed.data.languages || [],
        photos: [],
        credentials: null,
        rating: 0,
        reviewCount: 0,
        profileViews: 0,
        bookingInquiries: 0,
        publishedAt: new Date(),
      },
    }),

    prisma.user.update({
      where: { id: userId },
      data: { role: "trainer" },
    }),
  ]);

  sendTrainerApplicationNotification({
    name: user.name || user.email,
    email: user.email,
    applicationId: application.id,
    createdAt: application.createdAt,
  }).catch(console.error);

  revalidateTag("trainers");

  const response = NextResponse.json({
    success: true,
    message: "Welcome! Your trainer profile is live.",
    trainerId: trainer.id,
    slug: trainer.slug,
    redirectTo: "/trainer-dashboard",
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  };

  response.cookies.set("x-active-role", "trainer", cookieOptions);
  response.cookies.set("x-original-role", "trainer", cookieOptions);

  return response;
}
