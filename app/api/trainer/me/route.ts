import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

const trainerSelfServiceUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  headline: z.string().max(200).optional(),
  bio: z.string().max(5000).optional(),
  specialties: z.array(z.string().max(50)).max(20).optional(),
  languages: z.array(z.string().max(20)).max(10).optional(),
  credentials: z.string().max(2000).optional(),
  experienceYears: z.number().min(0).max(100).optional(),
  maxClientsPerMonth: z.number().min(0).max(1000).optional(),
  photos: z.array(z.string().url().max(500)).max(20).optional(),
  instagramUrl: z.string().max(200).optional(),
  stravaUrl: z.string().max(200).optional(),
  tripsterUrl: z.string().max(200).optional(),
  websiteUrl: z.string().max(200).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { userId: session.user.id },
    include: {
      availability: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  return NextResponse.json(trainer);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { userId: session.user.id },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  if (trainer.status === "SUSPENDED") {
    return NextResponse.json(
      { error: "Your account is suspended. Contact support." },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = trainerSelfServiceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const sanitized: Record<string, any> = {};
  const allowedFields = [
    "displayName", "headline", "bio", "specialties", "languages",
    "credentials", "experienceYears", "maxClientsPerMonth", "photos",
    "instagramUrl", "stravaUrl", "tripsterUrl", "websiteUrl",
  ];

  for (const key of allowedFields) {
    if (data[key as keyof typeof data] !== undefined) {
      if (key === "bio") {
        sanitized[key] = DOMPurify.sanitize(data.bio || "", {
          ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
          ALLOWED_ATTR: ["href", "target"],
        });
      } else {
        sanitized[key] = data[key as keyof typeof data];
      }
    }
  }

  // ─── ALL STATUSES: direct update (no revision workflow) ───
  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: {
      ...sanitized,
      updatedAt: new Date(),
    },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: session.user.id,
      changeType: "UPDATE",
      fieldName: "profile",
      oldValue: "",
      newValue: JSON.stringify(sanitized),
    },
  });

  revalidateTag("trainers");
  return NextResponse.json(updated);
}
