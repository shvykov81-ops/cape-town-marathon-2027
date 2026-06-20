import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/trainer-guard";
import { adminTrainerUpdateSchema } from "@/lib/validations/trainer";
import { sanitizeHtml } from "@/lib/sanitize";

/**
 * GET /api/admin/trainers/[id]
 * Get full trainer details for admin moderation.
 * Admin only.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
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

  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  return NextResponse.json({ trainer });
}

/**
 * PUT /api/admin/trainers/[id]
 * Force-edit any trainer profile (bypasses workflow).
 * Admin only.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId: adminId } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = adminTrainerUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Build update payload
  const updatePayload: Record<string, unknown> = {};
  const fields = [
    "displayName", "headline", "bio", "credentials", "photoUrl", "photos",
    "videoUrl", "videoThumbnail", "stravaUrl", "websiteUrl", "instagramUrl",
    "tripsterUrl", "specialties", "languages", "experienceYears",
    "maxClientsPerMonth", "status", "slug",
  ] as const;

  for (const key of fields) {
    if (data[key] !== undefined) {
      updatePayload[key] = data[key];
    }
  }
  if (data.bioHtml !== undefined) {
    updatePayload.bioHtml = sanitizeHtml(data.bioHtml);
  }

  const updated = await prisma.trainer.update({
    where: { id },
    data: updatePayload,
  });

  // Log change
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: id,
      changedBy: adminId,
      changeType: "UPDATE",
      fieldName: "admin_force_edit",
      newValue: JSON.stringify(updatePayload),
    },
  });

  return NextResponse.json({ trainer: updated });
}

/**
 * DELETE /api/admin/trainers/[id]
 * Delete a trainer profile.
 * Admin only.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, userId: adminId } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  // Log deletion before removing
  await prisma.trainerProfileChange.create({
    data: {
      trainerId: id,
      changedBy: adminId,
      changeType: "DELETE",
      fieldName: "trainer",
      oldValue: JSON.stringify({
        name: trainer.displayName || `${trainer.firstName} ${trainer.lastName}`,
        slug: trainer.slug,
        status: trainer.status,
      }),
    },
  });

  await prisma.trainer.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Trainer deleted" });
}
