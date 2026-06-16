import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validations/package";

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
    const packages = await prisma.package.findMany({
      include: { options: true, _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Admin packages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const denied = checkAdmin(session);
  if (denied) return denied;

  try {
    const body = await req.json();
    const parsed = packageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, type, durationDays, priceBase, maxParticipants, description, includes, isActive } = parsed.data;

    const pkg = await prisma.package.create({
      data: {
        name,
        type,
        durationDays,
        priceBase,
        maxParticipants,
        description,
        includes,
        isActive,
      },
    });

    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error("Admin package create error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
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
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg._count.bookings > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete package with active bookings", 
          bookingsCount: pkg._count.bookings 
        },
        { status: 409 }
      );
    }

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin package delete error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
