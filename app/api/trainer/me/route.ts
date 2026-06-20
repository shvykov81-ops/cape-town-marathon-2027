import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";
import { TrainerProfileStatus } from "@prisma/client";
import { sanitizeHtml } from "@/lib/sanitize";

export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }
  return NextResponse.json(trainer);
}

export async function PATCH(request: NextRequest) {
  const { error, trainer, user } = await requireTrainer();
  if (error) return error;
  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  if (trainer.status === TrainerProfileStatus.PENDING) {
    return NextResponse.json({ error: "Editing is disabled while profile is under review" }, { status: 403 });
  }
  if (trainer.status === TrainerProfileStatus.PUBLISHED) {
    return NextResponse.json({ error: "Published profiles cannot be edited directly. Contact admin." }, { status: 403 });
  }
  if (trainer.status === TrainerProfileStatus.SUSPENDED) {
    return NextResponse.json({ error: "Suspended profiles cannot be edited. Contact admin." }, { status: 403 });
  }

  const body = await request.json();
  const allowedFields = [
    "displayName", "headline", "bio", "bioHtml", "credentials",
    "photoUrl", "videoUrl", "stravaUrl", "websiteUrl", "instagramUrl", "tripsterUrl",
    "experienceYears", "maxClientsPerMonth", "specialties", "languages",
  ];

  const updateData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) updateData[key] = body[key];
  }

  // NEW: Sanitize bioHtml to prevent XSS
  if (body.bioHtml !== undefined) {
    updateData.bioHtml = sanitizeHtml(body.bioHtml);
  }

  const changes: { fieldName: string; oldValue: string | null; newValue: string | null }[] = [];
  for (const key of allowedFields) {
    const oldVal = (trainer as Record<string, unknown>)[key];
    const newVal = updateData[key];
    if (newVal !== undefined && JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({ fieldName: key, oldValue: oldVal !== null ? String(oldVal) : null, newValue: newVal !== null ? String(newVal) : null });
    }
  }

  const updated = await prisma.trainer.update({ where: { id: trainer.id }, data: updateData });

  if (changes.length > 0) {
    await prisma.trainerProfileChange.createMany({
      data: changes.map((c) => ({ trainerId: trainer.id, changedBy: user!.id, changeType: "UPDATE" as const, fieldName: c.fieldName, oldValue: c.oldValue, newValue: c.newValue })),
    });
  }

  return NextResponse.json(updated);
}
