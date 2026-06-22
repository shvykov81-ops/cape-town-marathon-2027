import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { sendTrainerApplicationRejectedEmail } from "@/lib/email";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(1, "Reason is required").max(2000),
});

/**
 * POST /api/admin/trainer-applications/[id]/reject
 * Reject a trainer application with reason.
 * Admin only.
 */
export async function POST(
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
    include: { user: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (application.status !== "PENDING") {
    return NextResponse.json(
      { error: `Application already ${application.status}` },
      { status: 400 }
    );
  }

  await prisma.trainerApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  // Log rejection
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: "rejected-application",
      changedBy: adminId,
      changeType: "UPDATE",
      fieldName: "application_rejected",
      oldValue: application.status,
      newValue: `REJECTED: ${reason}`,
    },
  });

  // Send rejection email
  if (application.user.email) {
    sendTrainerApplicationRejectedEmail({
      to: application.user.email,
      trainerName: application.user.name || "Applicant",
      reason,
    }).catch(console.error);
  }

  return NextResponse.json({
    success: true,
    message: "Application rejected",
  });
}
