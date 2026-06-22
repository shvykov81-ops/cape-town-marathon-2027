import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { RevisionStatus } from "@prisma/client";
import { z } from "zod";

const querySchema = z.object({
  status: z.nativeEnum(RevisionStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).optional(),
});

/**
 * GET /api/admin/revisions
 * List all trainer revisions with optional status filter.
 * Admin only.
 */
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
    search: searchParams.get("search") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { status, page, limit, search } = parsed.data;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.trainer = {
      OR: [
        { displayName: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [revisions, total] = await Promise.all([
    prisma.trainerRevision.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        trainer: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            status: true,
            user: {
              select: { email: true },
            },
          },
        },
      },
    }),
    prisma.trainerRevision.count({ where }),
  ]);

  // Count by status
  const statusCounts = await prisma.trainerRevision.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const counts = statusCounts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.status;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    revisions,
    counts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
