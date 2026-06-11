import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  const pkg = await prisma.package.update({
    where: { id },
    data: {
      name,
      type,
      durationDays: parseInt(durationDays),
      priceBase: parseFloat(String(priceBase)),
      maxParticipants: parseInt(maxParticipants),
      description,
      includes: includes || [],
      isActive,
    },
  });

  return NextResponse.json(pkg);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
