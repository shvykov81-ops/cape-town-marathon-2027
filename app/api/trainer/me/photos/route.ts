import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { z } from "zod";

const photoUrlSchema = z.object({
  url: z.string().url("Must be a valid URL").max(500),
});

const deletePhotoSchema = z.object({
  url: z.string().max(500),
});

/**
 * POST /api/trainer/me/photos
 * Add a photo URL to the gallery.
 */
export async function POST(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  // Block if PENDING
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json(
      { error: "Cannot edit photos while profile is pending moderation" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = photoUrlSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { url } = parsed.data;
  const currentPhotos = trainer.photos ?? [];

  if (currentPhotos.length >= 20) {
    return NextResponse.json(
      { error: "Maximum 20 photos allowed" },
      { status: 400 }
    );
  }

  if (currentPhotos.includes(url)) {
    return NextResponse.json(
      { error: "Photo already exists in gallery" },
      { status: 409 }
    );
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { photos: { push: url } },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: trainer.userId ?? trainer.id,
      changeType: "UPDATE",
      fieldName: "photos",
      newValue: url,
    },
  });

  return NextResponse.json({ trainer: updated });
}

/**
 * DELETE /api/trainer/me/photos
 * Remove a photo URL from the gallery.
 */
export async function DELETE(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json(
      { error: "Cannot edit photos while profile is pending moderation" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = deletePhotoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { url } = parsed.data;
  const currentPhotos = trainer.photos ?? [];
  const newPhotos = currentPhotos.filter((p) => p !== url);

  if (newPhotos.length === currentPhotos.length) {
    return NextResponse.json(
      { error: "Photo not found in gallery" },
      { status: 404 }
    );
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { photos: newPhotos },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: trainer.userId ?? trainer.id,
      changeType: "UPDATE",
      fieldName: "photos",
      oldValue: url,
    },
  });

  return NextResponse.json({ trainer: updated });
}
