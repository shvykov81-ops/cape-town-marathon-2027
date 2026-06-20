import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { z } from "zod";

const photoSchema = z.object({ url: z.string().url() });
const deletePhotoSchema = z.object({ url: z.string() });

export async function POST(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json({ error: "Photo editing is disabled while profile is under review" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = photoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

  const { url } = parsed.data;
  if (trainer.photos.length >= 20) return NextResponse.json({ error: "Maximum 20 photos allowed" }, { status: 400 });

  const updated = await prisma.trainer.update({ where: { id: trainer.id }, data: { photos: { push: url } } });
  await prisma.trainerProfileChange.create({
    data: { trainerId: trainer.id, changedBy: user!.id, changeType: "UPDATE", fieldName: "photos", oldValue: JSON.stringify(trainer.photos), newValue: JSON.stringify(updated.photos) },
  });
  return NextResponse.json({ success: true, photos: updated.photos });
}

export async function DELETE(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json({ error: "Photo editing is disabled while profile is under review" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = deletePhotoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { url } = parsed.data;
  const newPhotos = trainer.photos.filter((p) => p !== url);
  const updated = await prisma.trainer.update({ where: { id: trainer.id }, data: { photos: newPhotos } });
  await prisma.trainerProfileChange.create({
    data: { trainerId: trainer.id, changedBy: user!.id, changeType: "UPDATE", fieldName: "photos", oldValue: JSON.stringify(trainer.photos), newValue: JSON.stringify(updated.photos) },
  });
  return NextResponse.json({ success: true, photos: updated.photos });
}
