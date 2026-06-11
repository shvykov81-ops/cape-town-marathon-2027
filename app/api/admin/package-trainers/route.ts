import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    const links = await prisma.packageTrainer.findMany({
      include: {
        package: { select: { name: true } },
        trainer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ packageTrainers: links });
  } catch (error) {
    console.error("Admin package-trainers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

const createSchema = z.object({
  packageId: z.string().cuid(),
  trainerId: z.string().cuid(),
  role: z.string().min(1),
  isIncluded: z.boolean().default(false),
  priceAdd: z.number().optional(),
  maxSlots: z.number().optional(),
  offeringDescription: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const denied = checkAdmin(session);
  if (denied) return denied;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const link = await prisma.packageTrainer.create({
      data: parsed.data,
      include: {
        package: { select: { name: true } },
        trainer: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ packageTrainer: link }, { status: 201 });
  } catch (error) {
    console.error("Admin package-trainer create error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
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

    await prisma.packageTrainer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin package-trainer delete error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
