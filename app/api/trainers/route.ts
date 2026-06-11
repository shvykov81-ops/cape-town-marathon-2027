import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trainers = await prisma.trainer.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
  });
  return NextResponse.json(trainers);
}
