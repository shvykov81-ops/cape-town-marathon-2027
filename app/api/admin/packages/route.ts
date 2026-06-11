import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const packages = await prisma.package.findMany({
    include: { options: true, _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    type,
    durationDays,
    priceBase,
    maxParticipants,
    description,
    includes,
    isActive,
  } = body;

  const pkg = await prisma.package.create({
    data: {
      name,
      type,
      durationDays: parseInt(durationDays),
      priceBase: parseFloat(String(priceBase)),
      maxParticipants: parseInt(maxParticipants),
      description,
      includes: includes || [],
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(pkg);
}
