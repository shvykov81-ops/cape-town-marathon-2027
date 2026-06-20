import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * GET /api/admin/trainers/pending
 * List only PENDING trainers for moderation queue.
 * Admin only.
 */
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  const [trainers, total] = await Promise.all([
    prisma.trainer.findMany({
      where: { status: TrainerProfileStatus.PENDING },
      skip,
      take: limit,
      orderBy: { updatedAt: "asc" }, // oldest first = FIFO queue
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    }),
    prisma.trainer.count({ where: { status: TrainerProfileStatus.PENDING } }),
  ]);

  return NextResponse.json({
    trainers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
