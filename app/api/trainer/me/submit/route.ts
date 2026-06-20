import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";

export async function POST() {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  if (trainer.status !== TrainerProfileStatus.DRAFT && trainer.status !== TrainerProfileStatus.REJECTED) {
    return NextResponse.json({ error: `Cannot submit profile in ${trainer.status} status` }, { status: 400 });
  }

  if (!trainer.displayName || !trainer.bio || !trainer.photoUrl) {
    return NextResponse.json({ error: "Profile incomplete. Please fill in display name, bio, and photo." }, { status: 400 });
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { status: TrainerProfileStatus.PENDING, moderationNote: null },
  });

  await prisma.trainerProfileChange.create({
    data: { trainerId: trainer.id, changedBy: user!.id, changeType: "UPDATE", fieldName: "status", oldValue: trainer.status, newValue: TrainerProfileStatus.PENDING },
  });

  return NextResponse.json({ success: true, status: updated.status });
}
