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
  { revalidate: 300 }
);

/**
 * GET /api/trainers/[slug]
 * Public endpoint: get single trainer by slug.
 * Increments profileViews on each visit.
 * No auth required.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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

  // Increment profileViews asynchronously (fire-and-forget)
  prisma.trainer.update({
    where: { id: trainer.id },
    data: { profileViews: { increment: 1 } },
  }).catch(() => {
    // Silently fail — views are not critical
  });

  return NextResponse.json({ trainer });
}
