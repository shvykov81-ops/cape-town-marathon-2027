import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerProfileStatus } from "@prisma/client";
import { z } from "zod";
import { unstable_cache } from "next/cache";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const getTrainerReviews = unstable_cache(
  async (trainerId: string, skip: number, limit: number) => {
    return prisma.review.findMany({
      where: { trainerId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });
  },
  ["trainer-reviews"],
  { revalidate: 60 }
);

/**
 * GET /api/trainers/[slug]/reviews
 * Public endpoint: get reviews for a trainer.
 * No auth required.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "10",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  // Find trainer by slug
  const trainer = await prisma.trainer.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });

  if (!trainer || trainer.status !== TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  const [reviews, total] = await Promise.all([
    getTrainerReviews(trainer.id, skip, limit),
    prisma.review.count({ where: { trainerId: trainer.id } }),
  ]);

  return NextResponse.json({
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
