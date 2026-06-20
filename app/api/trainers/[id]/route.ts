import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerProfileStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

const getTrainerBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.trainer.findUnique({
      where: { slug },
      include: {
        packages: {
          select: {
            id: true,
            package: {
              select: { id: true, name: true },
            },
          },
        },
        _count: {
          select: { reviews: true, bookings: true },
        },
      },
    });
  },
  ["trainer-by-slug"],
  { revalidate: 300, tags: ["trainers"] }
);

/**
 * GET /api/trainers/[slug]
 * Public endpoint: get single trainer by slug.
 * Increments profileViews atomically.
 * No auth required.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await params;

  const trainer = await getTrainerBySlug(slug);

  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  // Only PUBLISHED trainers are visible publicly
  if (trainer.status !== TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Trainer profile not available" },
      { status: 404 }
    );
  }

  // Increment profileViews atomically using raw query (no race condition)
  // This runs independently of the cached data fetch
  prisma.$executeRaw`
    UPDATE "Trainer" SET "profileViews" = "profileViews" + 1 WHERE id = ${trainer.id}
  `.catch(() => {
    // Silently fail — views are not critical
  });

  // Return trainer data (views may be slightly stale due to cache, but that's acceptable)
  return NextResponse.json({ trainer });
}
