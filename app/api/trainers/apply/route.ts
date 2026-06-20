import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check if user already has a trainer profile
  const existing = await prisma.trainer.findFirst({
    where: { userId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You already have a trainer profile", status: existing.status },
      { status: 400 }
    );
  }

  // Check if user already applied
  const existingRequest = await prisma.trainerApplication.findFirst({
    where: { userId },
  });

  if (existingRequest) {
    return NextResponse.json(
      { error: "Application already submitted", status: existingRequest.status },
      { status: 400 }
    );
  }

  // Create application
  const application = await prisma.trainerApplication.create({
    data: {
      userId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, application });
}
