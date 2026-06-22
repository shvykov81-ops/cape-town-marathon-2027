import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { sendTrainerApplicationApprovedEmail } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";
import slugify from "slugify";

/**
 * POST /api/admin/trainer-applications/[id]/approve
 * Approve a trainer application and create a Trainer profile.
 * Admin only.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId: adminId } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  // 1. Find application
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

  // 2. Check if trainer profile already exists
  const existingTrainer = await prisma.trainer.findFirst({
    where: { userId: application.userId },
  });

  if (existingTrainer) {
    return NextResponse.json(
      { error: "Trainer profile already exists for this user" },
      { status: 400 }
    );
  }

  // 3. Generate unique slug
  const baseSlug = slugify(
    `${application.user.firstName || ""}-${application.user.lastName || ""}`,
    { lower: true, strict: true }
  ) || `trainer-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.trainer.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // 4. Create Trainer profile
  const trainer = await prisma.trainer.create({
    data: {
      userId: application.userId,
      firstName: application.user.firstName || application.user.name?.split(" ")[0] || "Trainer",
      lastName: application.user.lastName || application.user.name?.split(" ").slice(1).join(" ") || "",
      displayName: application.user.name || "New Trainer",
      slug,
      status: "DRAFT",
      bio: application.note || "",
    },
  });

  // 5. Update application status and link to trainer
  await prisma.trainerApplication.update({
    where: { id },
    data: { status: "APPROVED", trainerId: trainer.id },
  });

  // 6. Update user role
  await prisma.user.update({
    where: { id: application.userId },
    data: { role: "trainer" },
  });

  // 7. Log creation
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: adminId,
      changeType: "CREATE",
      fieldName: "trainer_profile",
      newValue: `Created from application ${id}`,
    },
  });

  // 8. Send email notification (non-blocking)
  if (application.user.email) {
    sendTrainerApplicationApprovedEmail({
      to: application.user.email,
      trainerName: trainer.displayName,
      dashboardUrl: `${process.env.NEXTAUTH_URL}/trainer-dashboard`,
    }).catch(console.error);
  }

  // 9. Send Telegram notification (non-blocking)
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { name: true, email: true },
  });

  if (admin) {
    const text = `✅ **Trainer Application Approved**

👤 **Trainer:** ${trainer.displayName}
📧 **Email:** ${application.user.email}
🔗 **Profile:** /trainers/${trainer.slug}
👨‍💼 **Approved by:** ${admin.name || admin.email}

📝 **Action:** Trainer can now complete their profile`;

    sendTelegramMessage(process.env.TELEGRAM_ADMIN_GROUP_ID || "", text).catch(console.error);
  }

  return NextResponse.json({
    success: true,
    message: "Application approved, trainer profile created",
    trainer: {
      id: trainer.id,
      slug: trainer.slug,
      status: trainer.status,
    },
  });
}
