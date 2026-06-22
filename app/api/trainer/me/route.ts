import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus, RevisionStatus } from "@prisma/client";
import { trainerSelfServiceUpdateSchema } from "@/lib/validations/trainer";
import { sanitizeHtml } from "@/lib/sanitize";

export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }
  return NextResponse.json(trainer);
}

export async function PATCH(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  const body = await request.json();

  // ─── PUBLISHED profiles: create revision instead of direct edit ───
  if (trainer.status === TrainerProfileStatus.PUBLISHED) {
    // Validate with Zod first
    const parsed = trainerSelfServiceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = parsed.data;

    // Sanitize bioHtml
    if (updateData.bioHtml) {
      updateData.bioHtml = sanitizeHtml(updateData.bioHtml);
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanData).length === 0) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 });
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
          error: "You already have a pending revision. Please wait for it to be reviewed or submit the existing one.",
          revisionId: existingPending.id,
          status: existingPending.status,
        },
        { status: 409 }
      );
    }

    // Create revision
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
        fieldName: "revision_created_via_patch",
        oldValue: null,
        newValue: revision.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your profile is published. Changes have been saved as a revision for admin review.",
      revision: {
        id: revision.id,
        status: revision.status,
        createdAt: revision.createdAt,
      },
    }, { status: 202 });
  }

  // ─── DRAFT / REJECTED profiles: direct edit (existing behavior) ───
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json(
      { error: "Editing is disabled while profile is under review" },
      { status: 403 }
    );
  }
  if (trainer.status === TrainerProfileStatus.SUSPENDED) {
    return NextResponse.json(
      { error: "Suspended profiles cannot be edited. Contact admin." },
      { status: 403 }
    );
  }

  // Validate with Zod
  const parsed = trainerSelfServiceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updateData = parsed.data;
  const allowedFields = [
    "displayName", "headline", "bio", "bioHtml", "credentials",
    "photoUrl", "photos", "videoUrl", "videoThumbnail", "stravaUrl", "websiteUrl",
    "instagramUrl", "tripsterUrl", "experienceYears", "maxClientsPerMonth",
    "specialties", "languages",
  ];

  const filteredData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (updateData[key as keyof typeof updateData] !== undefined) {
      filteredData[key] = updateData[key as keyof typeof updateData];
    }
  }

  // Sanitize bioHtml
  if (filteredData.bioHtml) {
    filteredData.bioHtml = sanitizeHtml(filteredData.bioHtml as string);
  }

  const changes: { fieldName: string; oldValue: string | null; newValue: string | null }[] = [];
  for (const key of allowedFields) {
    const oldVal = (trainer as Record<string, unknown>)[key];
    const newVal = filteredData[key];
    if (newVal !== undefined && JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        fieldName: key,
        oldValue: oldVal !== null ? String(oldVal) : null,
        newValue: newVal !== null ? String(newVal) : null,
      });
    }
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: filteredData,
  });

  if (changes.length > 0) {
    await prisma.trainerProfileChange.createMany({
      data: changes.map((c) => ({
        trainerId: trainer.id,
        changedBy: user!.id,
        changeType: "UPDATE" as const,
        fieldName: c.fieldName,
        oldValue: c.oldValue,
        newValue: c.newValue,
      })),
    });
  }

  return NextResponse.json(updated);
}
