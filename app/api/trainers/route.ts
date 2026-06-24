import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trainerListQuerySchema } from "@/lib/validations/trainer";
import { TrainerProfileStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";

const getPublishedTrainers = unstable_cache(
  async (where: Record<string, unknown>, skip: number, limit: number, orderBy: Record<string, unknown>) => {
    return prisma.trainer.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        slug: true,
        displayName: true,
        firstName: true,
        lastName: true,
        headline: true,
        photoUrl: true,
        photos: true,  // ← ADDED: gallery photos for card display
        specialties: true,
        languages: true,
        experienceYears: true,
        rating: true,
        reviewCount: true,
        profileViews: true,
        status: true,
        createdAt: true,
      },
    });
  },
  ["trainers-list"],
  { revalidate: 300, tags: ["trainers"] }
);

const countPublishedTrainers = unstable_cache(
  async (where: Record<string, unknown>) => {
    return prisma.trainer.count({ where });
  },
  ["trainers-count"],
  { revalidate: 300, tags: ["trainers"] }
);

/**
 * GET /api/trainers
 * Public endpoint: list PUBLISHED trainers with filters, sort, pagination.
 * No auth required.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsed = trainerListQuerySchema.safeParse({
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "12",
    specialty: searchParams.get("specialty") || undefined,
    language: searchParams.get("language") || undefined,
    sortBy: searchParams.get("sortBy") || "rating",
    search: searchParams.get("search") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, specialty, language, sortBy, search } = parsed.data;
  const skip = (page - 1) * limit;

  // Build where clause — ONLY PUBLISHED
  const where: Record<string, unknown> = {
    status: TrainerProfileStatus.PUBLISHED,
  };

  if (specialty) {
    where.specialties = { has: specialty };
  }
  if (language) {
    where.languages = { has: language };
  }
  if (search) {
    where.OR = [
      { displayName: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { headline: { contains: search, mode: "insensitive" } },
      { bio: { contains: search, mode: "insensitive" } },
    ];
  }

  // Build orderBy
  let orderBy: Record<string, unknown>;
  switch (sortBy) {
    case "rating":
      orderBy = { rating: "desc" };
      break;
    case "experience":
      orderBy = { experienceYears: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "popular":
      orderBy = { profileViews: "desc" };
      break;
    default:
      orderBy = { rating: "desc" };
  }

  const [trainers, total] = await Promise.all([
    getPublishedTrainers(where, skip, limit, orderBy),
    countPublishedTrainers(where),
  ]);

  // Get unique specialties and languages for filters
  const [allSpecialties, allLanguages] = await Promise.all([
    prisma.trainer.findMany({
      where: { status: TrainerProfileStatus.PUBLISHED },
      select: { specialties: true },
      distinct: ["specialties"],
    }),
    prisma.trainer.findMany({
      where: { status: TrainerProfileStatus.PUBLISHED },
      select: { languages: true },
      distinct: ["languages"],
    }),
  ]);

  const uniqueSpecialties = Array.from(
    new Set(allSpecialties.flatMap((t) => t.specialties))
  ).sort();
  const uniqueLanguages = Array.from(
    new Set(allLanguages.flatMap((t) => t.languages))
  ).sort();

  // Aggregated stats
  const stats = await prisma.trainer.aggregate({
    where: { status: TrainerProfileStatus.PUBLISHED },
    _avg: { rating: true },
    _count: { id: true },
  });

  return NextResponse.json({
    trainers,
    filters: {
      specialties: uniqueSpecialties,
      languages: uniqueLanguages,
    },
    stats: {
      totalCoaches: stats._count.id,
      avgRating: stats._avg.rating ? parseFloat(stats._avg.rating.toFixed(1)) : 0,
      totalSpecialties: uniqueSpecialties.length,
      totalLanguages: uniqueLanguages.length,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
