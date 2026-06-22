import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus, RevisionStatus } from "@prisma/client";
import { trainerSelfServiceUpdateSchema } from "@/lib/validations/trainer";
import { sanitizeHtml } from "@/lib/sanitize";

/**
 * POST /api/trainer/me/revision
 * Create a new revision (DRAFT) for a PUBLISHED trainer profile.
 * Trainer only. Profile must be PUBLISHED.
 * 
 * Body: Same as PATCH /api/trainer/me (trainerSelfServiceUpdateSchema)
 */
export async function POST(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  // Only PUBLISHED profiles can create revisions
  if (trainer.status !== TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Revisions can only be created for published profiles" },
      { status: 400 }
    );
  }

  // Check for existing pending revision
  const existingPending = await prisma.trainerRevision.findFirst({
    where: {
      trainerId: trainer.id,
      status: { in: [RevisionStatus.DRAFT, RevisionStatus.PENDING] },
    },
  });

  if (existingPending) {
    return NextResponse.json(
      { 
        error: "You already have a pending revision",
        revisionId: existingPending.id,
        status: existingPending.status,
      },
      { status: 409 }
    );
  }

  const body = await request.json();

  // Validate with Zod
  const parsed = trainerSelfServiceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateData = parsed.data;

  // Sanitize bioHtml if present
  if (updateData.bioHtml) {
    updateData.bioHtml = sanitizeHtml(updateData.bioHtml);
  }

  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(cleanData).length === 0) {
    return NextResponse.json(
      { error: "No changes provided" },
      { status: 400 }
    );
  }

  // Create revision with snapshot of proposed changes
  const revision = await prisma.trainerRevision.create({
    data: {
      trainerId: trainer.id,
      data: cleanData as any,
      status: RevisionStatus.DRAFT,
    },
  });

  // Log in audit trail
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: user!.id,
      changeType: "UPDATE",
      fieldName: "revision_created",
      oldValue: null,
      newValue: revision.id,
    },
  });

  return NextResponse.json({
    success: true,
    revision: {
      id: revision.id,
      status: revision.status,
      createdAt: revision.createdAt,
      data: cleanData,
    },
  }, { status: 201 });
}

/**
 * GET /api/trainer/me/revision
 * List all revisions for the current trainer.
 * Trainer only.
 */
export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  const revisions = await prisma.trainerRevision.findMany({
    where: { trainerId: trainer.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      reviewedAt: true,
      reviewedBy: true,
      moderationNote: true,
      data: true,
    },
  });

  return NextResponse.json({ revisions });
}
