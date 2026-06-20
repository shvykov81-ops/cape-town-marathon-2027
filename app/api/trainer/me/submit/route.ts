import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";

/**
 * POST /api/trainer/me/submit
 * Submit profile for moderation: DRAFT → PENDING
 */
export async function POST() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  // Only DRAFT or REJECTED can be submitted
  if (trainer.status !== TrainerProfileStatus.DRAFT && trainer.status !== TrainerProfileStatus.REJECTED) {
    return NextResponse.json(
      { error: `Cannot submit profile with status: ${trainer.status}` },
      { status: 400 }
    );
  }

  // Validate minimum required fields
  const missing: string[] = [];
  if (!trainer.displayName) missing.push("displayName");
  if (!trainer.bio && !trainer.bioHtml) missing.push("bio");
  if (!trainer.photoUrl) missing.push("photoUrl");
  if (!trainer.specialties || trainer.specialties.length === 0) missing.push("specialties");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Profile incomplete", missing },
      { status: 400 }
    );
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { status: TrainerProfileStatus.PENDING },
  });

  // Log change
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: trainer.userId ?? trainer.id,
      changeType: "UPDATE",
      fieldName: "status",
      oldValue: trainer.status,
      newValue: TrainerProfileStatus.PENDING,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Profile submitted for moderation",
    trainer: updated,
  });
}
