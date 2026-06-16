import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { trainerSchema } from "@/lib/validations/trainer";

function checkAdmin(session: any) {
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await auth();
  const denied = checkAdmin(session);
  if (denied) return denied;

  try {
    const trainers = await prisma.trainer.findMany({
      include: { _count: { select: { bookings: true, reviews: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Admin trainers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch trainers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const denied = checkAdmin(session);
  if (denied) return denied;

  try {
    const body = await req.json();
    const parsed = trainerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const trainer = await prisma.trainer.create({
      data: parsed.data,
    });

    return NextResponse.json(trainer, { status: 201 });
  } catch (error) {
    console.error("Admin trainer create error:", error);
    return NextResponse.json({ error: "Failed to create trainer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const denied = checkAdmin(session);
  if (denied) return denied;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // FK CHECK: Prevent deletion if active bookings exist
    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    if (trainer._count.bookings > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete trainer with active bookings", 
          bookingsCount: trainer._count.bookings 
        },
        { status: 409 }
      );
    }

    await prisma.trainer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin trainer delete error:", error);
    return NextResponse.json({ error: "Failed to delete trainer" }, { status: 500 });
  }
}
