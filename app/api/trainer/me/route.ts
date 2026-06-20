import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { sanitizeHtml } from "@/lib/sanitize";
import { trainerSelfServiceUpdateSchema } from "@/lib/validations/trainer";
import { TrainerProfileStatus } from "@prisma/client";

/**
 * GET /api/trainer/me
 * Returns the authenticated trainer's own profile.
 */
export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  const fullTrainer = await prisma.trainer.findUnique({
    where: { id: trainer.id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      packages: {
        select: {
          id: true,
          package: {
            select: { id: true, name: true },
          },
        },
      },
      _count: {
        select: { reviews: true, bookings: true },
      },
    },
  });

  if (!fullTrainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  return NextResponse.json({ trainer: fullTrainer });
}

/**
 * PATCH /api/trainer/me
 * Update own profile. Only allowed when status is DRAFT or REJECTED.
 */
export async function PATCH(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  // Only editable in DRAFT or REJECTED
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json(
      { error: "Profile is pending moderation. You cannot edit it now." },
      { status: 403 }
    );
  }
  if (trainer.status === TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Published profiles cannot be edited directly. Contact admin for changes." },
      { status: 403 }
    );
  }
  if (trainer.status === TrainerProfileStatus.SUSPENDED) {
    return NextResponse.json(
      { error: "Profile is suspended. Contact admin." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
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

  // Sanitize HTML bio
  const sanitizedBioHtml = data.bioHtml ? sanitizeHtml(data.bioHtml) : undefined;

  // Build update payload — only include defined fields
  const updatePayload: Record<string, unknown> = {};
  const fieldsToUpdate = [
    "displayName", "headline", "bio", "credentials", "photoUrl", "photos",
    "videoUrl", "videoThumbnail", "stravaUrl", "websiteUrl", "instagramUrl",
    "tripsterUrl", "specialties", "languages", "experienceYears", "maxClientsPerMonth",
  ] as const;

  for (const key of fieldsToUpdate) {
    if (data[key] !== undefined) {
      updatePayload[key] = data[key];
    }
  }
  if (sanitizedBioHtml !== undefined) {
    updatePayload.bioHtml = sanitizedBioHtml;
  }

  // Update trainer
  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: updatePayload,
  });

  // Log the change
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: trainer.userId ?? trainer.id,
      changeType: "UPDATE",
      fieldName: "multiple",
      newValue: JSON.stringify(updatePayload),
    },
  });

  return NextResponse.json({ trainer: updated });
}
