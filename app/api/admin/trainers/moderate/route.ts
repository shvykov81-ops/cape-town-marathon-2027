import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { sendTrainerModerationEmail } from "@/lib/email";
import { sendTrainerStatusChangeNotification } from "@/lib/telegram";

const moderationSchema = z.object({
  action: z.enum(["APPROVE", "SUSPEND", "DELETE"]),
  reason: z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = moderationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, reason } = parsed.data;

  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  let newStatus: string;
  let notificationMessage: string;

  switch (action) {
    case "APPROVE":
      newStatus = "PUBLISHED";
      notificationMessage = "Your trainer profile has been published and is now visible to athletes.";
      break;

    case "SUSPEND":
      newStatus = "SUSPENDED";
      notificationMessage = `Your trainer account has been suspended.${reason ? ` Reason: ${reason}` : ""}`;
      break;

    case "DELETE":
      await prisma.$transaction([
        prisma.trainer.delete({ where: { id } }),
        prisma.user.update({
          where: { id: trainer.userId },
          data: { role: "user" },
        }),
      ]);

      if (trainer.user?.email) {
        sendTrainerModerationEmail({
          to: trainer.user.email,
          trainerName: trainer.displayName || trainer.firstName,
          action: "DELETED",
          reason: reason || "Profile removed by admin",
        }).catch(console.error);
      }

      revalidateTag("trainers");
      return NextResponse.json({
        success: true,
        message: "Trainer profile deleted and user role reverted to user.",
      });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await prisma.trainer.update({
    where: { id },
    data: {
      status: newStatus as any,
      publishedAt: action === "APPROVE" ? new Date() : trainer.publishedAt,
    },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: id,
      type: "UPDATE",
      changedBy: session.user.id,
      changes: JSON.stringify({
        status: { from: trainer.status, to: newStatus },
        reason: reason || null,
      }),
    },
  });

  if (trainer.user?.email) {
    sendTrainerModerationEmail({
      to: trainer.user.email,
      trainerName: trainer.displayName || trainer.firstName,
      action: action as "APPROVE" | "SUSPEND",
      reason: reason || undefined,
    }).catch(console.error);
  }

  sendTrainerStatusChangeNotification({
    trainerName: trainer.displayName || trainer.firstName,
    status: newStatus,
    reason: reason || undefined,
  }).catch(console.error);

  await prisma.notification.create({
    data: {
      userId: trainer.userId,
      type: "trainer_status_change",
      title: action === "APPROVE" ? "Profile Published" : "Account Suspended",
      message: notificationMessage,
      link: "/trainer-dashboard",
    },
  });

  revalidateTag("trainers");

  return NextResponse.json({
    success: true,
    trainer: updated,
    message: `Trainer ${action.toLowerCase()}d successfully.`,
  });
}
