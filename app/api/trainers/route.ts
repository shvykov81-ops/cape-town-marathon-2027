import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trainers = await prisma.trainer.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { rating: "desc" },
  });
  return NextResponse.json(trainers);
}
