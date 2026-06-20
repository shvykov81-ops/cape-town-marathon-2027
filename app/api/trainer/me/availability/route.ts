import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { z } from "zod";

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isAvailable: z.boolean().default(true),
  note: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;
  if (!trainer) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());

  const availability = await prisma.trainerAvailability.findMany({
    where: { trainerId: trainer.id, date: { gte: new Date(year, month - 1, 1), lte: new Date(year, month, 0) } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(availability);
}

export async function POST(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json({ error: "Calendar editing is disabled while profile is under review" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { date, isAvailable, note } = parsed.data;
  const dateObj = new Date(date + "T00:00:00Z");

  const availability = await prisma.trainerAvailability.upsert({
    where: { trainerId_date: { trainerId: trainer.id, date: dateObj } },
    update: { isAvailable, note: note || null },
    create: { trainerId: trainer.id, date: dateObj, isAvailable, note: note || null },
  });

  await prisma.trainerProfileChange.create({
    data: { trainerId: trainer.id, changedBy: user!.id, changeType: "UPDATE", fieldName: "availability", newValue: JSON.stringify({ date, isAvailable, note }) },
  });

  return NextResponse.json(availability);
}
