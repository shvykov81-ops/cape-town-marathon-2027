import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { RevisionStatus, TrainerProfileStatus } from "@prisma/client";
import { sendTrainerRevisionSubmittedNotification } from "@/lib/telegram";

/**
 * POST /api/trainer/me/revision/[id]/submit
 * Submit a DRAFT revision for admin review.
 * Trainer only. Revision must be in DRAFT status.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  if (trainer.status !== TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Only published profiles can submit revisions" },
      { status: 400 }
    );
  }

  const { id } = await params;

  const revision = await prisma.trainerRevision.findUnique({
    where: { id },
  });

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }

  if (revision.trainerId !== trainer.id) {
    return NextResponse.json(
      { error: "Forbidden: Not your revision" },
      { status: 403 }
    );
  }

  if (revision.status !== RevisionStatus.DRAFT) {
    return NextResponse.json(
      { error: `Revision already ${revision.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  const updated = await prisma.trainerRevision.update({
    where: { id },
    data: { status: RevisionStatus.PENDING },
  });

  // Log in audit trail
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: user!.id,
      changeType: "UPDATE",
      fieldName: "revision_status",
      oldValue: RevisionStatus.DRAFT,
      newValue: RevisionStatus.PENDING,
    },
  });

  // Notify admin group via Telegram (non-blocking)
  sendTrainerRevisionSubmittedNotification({
    trainerName: trainer.displayName || `${trainer.firstName} ${trainer.lastName}`,
    trainerSlug: trainer.slug,
    revisionId: revision.id,
    submittedAt: new Date(),
  }).catch(console.error);

  // Create in-app notification for admins
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });

  await prisma.notification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type: "TRAINER_REVISION_SUBMITTED",
      channel: "in_app",
      status: "pending",
      payload: JSON.stringify({
        trainerId: trainer.id,
        trainerName: trainer.displayName || trainer.firstName,
        revisionId: revision.id,
        message: `Trainer ${trainer.displayName || trainer.firstName} submitted a profile revision for review.`,
      }),
    })),
  });

  return NextResponse.json({
    success: true,
    message: "Revision submitted for review",
    revision: {
      id: updated.id,
      status: updated.status,
      submittedAt: updated.createdAt,
    },
  });
}
