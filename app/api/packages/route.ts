import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    include: { options: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(packages);
}
