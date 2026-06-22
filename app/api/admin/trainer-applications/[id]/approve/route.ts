import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { TrainerApplicationStatus, TrainerProfileStatus } from "@prisma/client";
import slugify from "slugify";
import { sendTrainerApplicationApprovedEmail } from "@/lib/email";
import { sendTrainerStatusChangeNotification } from "@/lib/telegram";
import { revalidateTag } from "next/cache";

/**
 * POST /api/admin/trainer-applications/[id]/approve
 * Approve a trainer application → create Trainer profile (DRAFT).
 * Admin only.
 * 
 * Workflow:
 * 1. Find TrainerApplication by id
 * 2. Verify admin role
 * 3. Create Trainer record with status DRAFT
 * 4. Link application to trainer via trainerId
 * 5. Update application status to APPROVED
 * 6. Send email notification to user
 * 7. Log in TrainerProfileChange
 * 8. Invalidate trainers cache
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId: adminId } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  // 1. Find application with user details
  const application = await prisma.trainerApplication.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  if (application.status !== TrainerApplicationStatus.PENDING) {
    return NextResponse.json(
      { error: `Application already ${application.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  // 2. Check if user already has a trainer profile
  const existingTrainer = await prisma.trainer.findUnique({
    where: { userId: application.userId },
  });

  if (existingTrainer) {
    return NextResponse.json(
      { error: "User already has a trainer profile" },
      { status: 409 }
    );
  }

  // 3. Generate unique slug from name
  const baseSlug = slugify(
    `${application.user.firstName || application.user.name || "trainer"}-${application.user.lastName || ""}`,
    { lower: true, strict: true, trim: true }
  ) || `trainer-${Date.now()}`;

  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.trainer.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  // 4. Create Trainer profile in DRAFT status
  const trainer = await prisma.trainer.create({
    data: {
      userId: application.userId,
      firstName: application.user.firstName || application.user.name?.split(" ")[0] || "",
      lastName: application.user.lastName || application.user.name?.split(" ").slice(1).join(" ") || "",
      displayName: application.user.name || `${application.user.firstName || ""} ${application.user.lastName || ""}`.trim(),
      slug,
      bio: "",
      bioHtml: "",
      credentials: "",
      photoUrl: application.user.image || null,
      photos: [],
      specialties: [],
      languages: [],
      status: TrainerProfileStatus.DRAFT,
    },
  });

  // 5. Update application with link to trainer and APPROVED status
  await prisma.trainerApplication.update({
    where: { id: application.id },
    data: {
      status: TrainerApplicationStatus.APPROVED,
      trainerId: trainer.id,
    },
  });

  // 6. Log creation in audit trail
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: adminId,
      changeType: "CREATE",
      fieldName: "status",
      oldValue: null,
      newValue: TrainerProfileStatus.DRAFT,
    },
  });

  // 7. Send email notification (non-blocking)
  if (application.user.email) {
    sendTrainerApplicationApprovedEmail({
      to: application.user.email,
      trainerName: trainer.displayName || trainer.firstName,
      dashboardUrl: `${process.env.NEXTAUTH_URL}/trainer-dashboard`,
    }).catch(console.error);
  }

  // 8. Send Telegram notification to admin group (non-blocking)
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
        status: TrainerProfileStatus.DRAFT,
      },
      "APPLICATION_APPROVED",
      admin.name || admin.email
    ).catch(console.error);
  }

  // 9. Create in-app notification
  await prisma.notification.create({
    data: {
      userId: application.userId,
      type: "TRAINER_APPLICATION_APPROVED",
      channel: "in_app",
      status: "sent",
      payload: JSON.stringify({
        trainerId: trainer.id,
        slug: trainer.slug,
        message: "Your trainer application has been approved! Complete your profile to go live.",
      }),
      sentAt: new Date(),
    },
  });

  // 10. Invalidate cache
  revalidateTag("trainers");

  return NextResponse.json({
    success: true,
    message: "Application approved. Trainer profile created in DRAFT status.",
    trainer: {
      id: trainer.id,
      slug: trainer.slug,
      status: trainer.status,
      displayName: trainer.displayName,
    },
  });
}
