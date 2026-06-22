import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { sendTrainerSubmissionNotification } from "@/lib/telegram";
import { sendTrainerSubmissionNotificationEmail } from "@/lib/email";

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

  // ─── T-5: Notify admins ──────────────────────────────
  const submittedAt = new Date();

  // Telegram notification (non-blocking)
  sendTrainerSubmissionNotification({
    trainerName: trainer.displayName || `${trainer.firstName} ${trainer.lastName}`,
    trainerSlug: trainer.slug,
    submittedAt,
  }).catch(console.error);

  // Email notification to all admins (non-blocking)
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, email: true },
  });

  for (const admin of admins) {
    if (admin.email) {
      sendTrainerSubmissionNotificationEmail({
        to: admin.email,
        trainerName: trainer.displayName || `${trainer.firstName} ${trainer.lastName}`,
        trainerEmail: user!.email || "no-email",
        submittedAt,
        adminUrl: `${process.env.NEXTAUTH_URL}/admin/trainers`,
      }).catch(console.error);
    }
  }

  // Create in-app notifications for admins
  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type: "TRAINER_SUBMITTED",
      channel: "in_app",
      status: "pending",
      payload: JSON.stringify({
        trainerId: trainer.id,
        trainerName: trainer.displayName || trainer.firstName,
        message: `Trainer ${trainer.displayName || trainer.firstName} submitted their profile for review.`,
      }),
    })),
  });

  return NextResponse.json({ success: true, status: updated.status });
}
