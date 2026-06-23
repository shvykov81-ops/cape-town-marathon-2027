import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendTrainerModerationEmail } from "@/lib/email";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const moderateSchema = z.object({
  action: z.enum(["suspend", "delete", "reactivate"]),
  reason: z.string().max(1000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, reason } = parsed.data;

  if (action === "delete") {
    await prisma.trainer.delete({ where: { id } });

    if (trainer.userId) {
      await prisma.user.update({
        where: { id: trainer.userId },
        data: { role: "user" },
      });
    }

    revalidateTag("trainers");
    return NextResponse.json({ success: true, message: "Trainer profile deleted" });
  }

  if (action === "suspend") {
    const updated = await prisma.trainer.update({
      where: { id },
      data: {
        status: "SUSPENDED",
        moderationNote: reason || null,
        moderatedBy: session.user.id,
        moderatedAt: new Date(),
      },
    });

    if (trainer.user?.email) {
      sendTrainerModerationEmail({
        to: trainer.user.email,
        trainerName: trainer.displayName || trainer.firstName,
        oldStatus: trainer.status,
        newStatus: "SUSPENDED",
        reason: reason || undefined,
        actionUrl: `${process.env.NEXTAUTH_URL || "https://cape-town-marathon-2027.vercel.app"}/trainers/${trainer.slug}`,
      }).catch(console.error);
    }

    revalidateTag("trainers");
    return NextResponse.json({ success: true, trainer: updated });
  }

  if (action === "reactivate") {
    const updated = await prisma.trainer.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        moderationNote: null,
        moderatedBy: null,
        moderatedAt: null,
      },
    });

    revalidateTag("trainers");
    return NextResponse.json({ success: true, trainer: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
