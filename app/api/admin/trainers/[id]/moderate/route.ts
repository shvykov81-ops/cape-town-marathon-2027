import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { moderationActionSchema } from "@/lib/validations/trainer";
import { TrainerProfileStatus } from "@prisma/client";
import { sendTrainerStatusChangeNotification } from "@/lib/telegram";

/**
 * PATCH /api/admin/trainers/[id]/moderate
 * Approve, Reject, or Suspend a trainer profile.
 * Admin only.
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

  const parsed = moderationActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, reason } = parsed.data;

  const trainer = await prisma.trainer.findUnique({ 
    where: { id },
    include: { user: { select: { name: true, email: true } } }
  });
  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  const oldStatus = trainer.status;
  let newStatus: TrainerProfileStatus;
  let publishedAt: Date | null | undefined = undefined;

  switch (action) {
    case "APPROVE":
      newStatus = TrainerProfileStatus.PUBLISHED;
      publishedAt = new Date();
      break;
    case "REJECT":
      newStatus = TrainerProfileStatus.REJECTED;
      break;
    case "SUSPEND":
      newStatus = TrainerProfileStatus.SUSPENDED;
      break;
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.trainer.update({
    where: { id },
    data: {
      status: newStatus,
      moderationNote: reason || null,
      moderatedBy: adminId,
      moderatedAt: new Date(),
      ...(publishedAt !== undefined && { publishedAt }),
    },
  });

  // Log change
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: id,
      changedBy: adminId,
      changeType: "UPDATE",
      fieldName: "status",
      oldValue: oldStatus,
      newValue: newStatus,
    },
  });

  if (reason) {
    await prisma.trainerProfileChange.create({
      data: {
        trainerId: id,
        changedBy: adminId,
        changeType: "UPDATE",
        fieldName: "moderationNote",
        newValue: reason,
      },
    });
  }

  // Notify admin group via Telegram (non-blocking)
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { name: true, email: true },
  });

  if (admin) {
    sendTrainerStatusChangeNotification(
      {
        displayName: trainer.displayName,
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        slug: trainer.slug,
        status: newStatus,
      },
      oldStatus,
      admin.name || admin.email
    ).catch(console.error);
  }

  return NextResponse.json({
    success: true,
    message: `Trainer ${action.toLowerCase()}d`,
    trainer: updated,
  });
}
