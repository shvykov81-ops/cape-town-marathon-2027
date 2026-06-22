import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { RevisionStatus, TrainerProfileStatus } from "@prisma/client";
import { sendTrainerRevisionStatusEmail } from "@/lib/email";
import { sendTrainerStatusChangeNotification } from "@/lib/telegram";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  moderationNote: z.string().max(2000).optional(),
});

/**
 * GET /api/admin/revisions/[id]
 * Get a single revision with full diff data.
 * Admin only.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const revision = await prisma.trainerRevision.findUnique({
    where: { id },
    include: {
      trainer: {
        select: {
          id: true,
          slug: true,
          displayName: true,
          firstName: true,
          lastName: true,
          headline: true,
          bio: true,
          bioHtml: true,
          credentials: true,
          photoUrl: true,
          photos: true,
          videoUrl: true,
          stravaUrl: true,
          websiteUrl: true,
          instagramUrl: true,
          tripsterUrl: true,
          specialties: true,
          languages: true,
          experienceYears: true,
          maxClientsPerMonth: true,
          status: true,
          user: {
            select: { email: true, name: true },
          },
        },
      },
    },
  });

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }

  // Build diff for UI
  const currentData = revision.trainer;
  const proposedData = revision.data as Record<string, unknown>;
  const diff: Array<{
    field: string;
    current: unknown;
    proposed: unknown;
    changed: boolean;
  }> = [];

  const fieldsToCompare = [
    "displayName", "headline", "bio", "bioHtml", "credentials",
    "photoUrl", "photos", "videoUrl", "stravaUrl", "websiteUrl",
    "instagramUrl", "tripsterUrl", "specialties", "languages",
    "experienceYears", "maxClientsPerMonth",
  ];

  for (const field of fieldsToCompare) {
    const current = (currentData as Record<string, unknown>)[field];
    const proposed = proposedData[field];
    const changed = JSON.stringify(current) !== JSON.stringify(proposed);
    if (changed || proposed !== undefined) {
      diff.push({ field, current, proposed, changed });
    }
  }

  return NextResponse.json({
    revision,
    diff,
  });
}

/**
 * PATCH /api/admin/revisions/[id]
 * Approve or reject a revision.
 * Admin only.
 * 
 * APPROVE: Merge revision.data into Trainer, update status to PUBLISHED, invalidate cache
 * REJECT: Update revision status to REJECTED, notify trainer
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId: adminId } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, moderationNote } = parsed.data;

  const revision = await prisma.trainerRevision.findUnique({
    where: { id },
    include: {
      trainer: {
        include: {
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 });
  }

  if (revision.status !== RevisionStatus.PENDING) {
    return NextResponse.json(
      { error: `Revision already ${revision.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  const trainer = revision.trainer;
  const now = new Date();

  if (action === "APPROVE") {
    // Merge revision data into Trainer
    const updateData = revision.data as Record<string, unknown>;

    // Remove fields that shouldn't be merged
    delete updateData.status;
    delete updateData.slug;
    delete updateData.id;
    delete updateData.userId;

    const updatedTrainer = await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        ...updateData,
        updatedAt: now,
      },
    });

    // Update revision status
    await prisma.trainerRevision.update({
      where: { id },
      data: {
        status: RevisionStatus.APPROVED,
        reviewedAt: now,
        reviewedBy: adminId,
        moderationNote: moderationNote || null,
      },
    });

    // Log in audit trail
    await prisma.trainerProfileChange.create({
      data: {
        trainerId: trainer.id,
        changedBy: adminId,
        changeType: "UPDATE",
        fieldName: "revision_approved",
        oldValue: null,
        newValue: revision.id,
      },
    });

    // Send email to trainer (non-blocking)
    if (trainer.user?.email) {
      sendTrainerRevisionStatusEmail({
        to: trainer.user.email,
        trainerName: trainer.displayName || trainer.firstName,
        status: "APPROVED",
        moderationNote: moderationNote,
        profileUrl: `${process.env.NEXTAUTH_URL}/trainers/${trainer.slug}`,
      }).catch(console.error);
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: trainer.userId!,
        type: "TRAINER_REVISION_APPROVED",
        channel: "in_app",
        status: "sent",
        payload: JSON.stringify({
          trainerId: trainer.id,
          revisionId: revision.id,
          message: "Your profile revision has been approved and published!",
        }),
        sentAt: now,
      },
    });

    // Invalidate cache
    revalidateTag("trainers");

    return NextResponse.json({
      success: true,
      message: "Revision approved and merged into trainer profile",
      trainer: updatedTrainer,
    });

  } else {
    // REJECT
    await prisma.trainerRevision.update({
      where: { id },
      data: {
        status: RevisionStatus.REJECTED,
        reviewedAt: now,
        reviewedBy: adminId,
        moderationNote: moderationNote || null,
      },
    });

    // Log in audit trail
    await prisma.trainerProfileChange.create({
      data: {
        trainerId: trainer.id,
        changedBy: adminId,
        changeType: "UPDATE",
        fieldName: "revision_rejected",
        oldValue: null,
        newValue: revision.id,
      },
    });

    // Send email to trainer (non-blocking)
    if (trainer.user?.email) {
      sendTrainerRevisionStatusEmail({
        to: trainer.user.email,
        trainerName: trainer.displayName || trainer.firstName,
        status: "REJECTED",
        moderationNote: moderationNote,
        dashboardUrl: `${process.env.NEXTAUTH_URL}/trainer-dashboard`,
      }).catch(console.error);
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: trainer.userId!,
        type: "TRAINER_REVISION_REJECTED",
        channel: "in_app",
        status: "sent",
        payload: JSON.stringify({
          trainerId: trainer.id,
          revisionId: revision.id,
          reason: moderationNote,
          message: "Your profile revision was not approved. Please review the feedback and resubmit.",
        }),
        sentAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Revision rejected",
      revision: {
        id: revision.id,
        status: RevisionStatus.REJECTED,
      },
    });
  }
}
