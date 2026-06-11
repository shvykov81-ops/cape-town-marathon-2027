import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const options = await prisma.packageOption.findMany({
    where: { packageId: id, isActive: true },
  });
  return NextResponse.json(options);
}
