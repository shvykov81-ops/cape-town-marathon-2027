import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { TrainerApplicationStatus } from "@prisma/client";
import { sendTrainerApplicationRejectedEmail } from "@/lib/email";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required").max(2000),
});

/**
 * POST /api/admin/trainer-applications/[id]/reject
 * Reject a trainer application with structured reason.
 * Admin only.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { reason } = parsed.data;

  const application = await prisma.trainerApplication.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (application.status !== TrainerApplicationStatus.PENDING) {
    return NextResponse.json(
      { error: `Application already ${application.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  const updated = await prisma.trainerApplication.update({
    where: { id },
    data: {
      status: TrainerApplicationStatus.REJECTED,
      note: reason,
    },
  });

  // Send email notification (non-blocking)
  if (application.user.email) {
    sendTrainerApplicationRejectedEmail({
      to: application.user.email,
      name: application.user.name || "Applicant",
      reason,
      reapplyUrl: `${process.env.NEXTAUTH_URL}/trainers`,
    }).catch(console.error);
  }

  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId: application.userId,
      type: "TRAINER_APPLICATION_REJECTED",
      channel: "in_app",
      status: "sent",
      payload: JSON.stringify({
        reason,
        message: "Your trainer application was not approved.",
      }),
      sentAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Application rejected",
    application: updated,
  });
}
