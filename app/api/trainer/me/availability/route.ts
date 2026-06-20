import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { availabilitySchema } from "@/lib/validations/trainer";

/**
 * GET /api/trainer/me/availability
 * Returns availability calendar for the authenticated trainer.
 * Query params: ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function GET(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = { trainerId: trainer.id };

  if (from || to) {
    where.date = {};
    if (from) {
      (where.date as Record<string, unknown>).gte = new Date(from);
    }
    if (to) {
      (where.date as Record<string, unknown>).lte = new Date(to);
    }
  }

  const availability = await prisma.trainerAvailability.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ availability });
}

/**
 * POST /api/trainer/me/availability
 * Set availability for specific dates (upsert).
 */
export async function POST(request: NextRequest) {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { dates } = parsed.data;

  // Upsert each date
  const results = await Promise.all(
    dates.map((d) =>
      prisma.trainerAvailability.upsert({
        where: {
          trainerId_date: {
            trainerId: trainer.id,
            date: new Date(d.date),
          },
        },
        update: {
          isAvailable: d.isAvailable,
          note: d.note || null,
        },
        create: {
          trainerId: trainer.id,
          date: new Date(d.date),
          isAvailable: d.isAvailable,
          note: d.note || null,
        },
      })
    )
  );

  return NextResponse.json({
    success: true,
    updated: results.length,
    availability: results,
  });
}
