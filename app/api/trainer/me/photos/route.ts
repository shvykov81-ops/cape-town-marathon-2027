import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const photoSchema = z.object({ url: z.string().url() });
const deletePhotoSchema = z.object({ url: z.string() });
const setMainSchema = z.object({ photoUrl: z.string().url() });

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { userId: session.user.id },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  if (trainer.status === "SUSPENDED") {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = photoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const { url } = parsed.data;
  if (trainer.photos.length >= 20) {
    return NextResponse.json({ error: "Maximum 20 photos allowed" }, { status: 400 });
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { photos: { push: url } },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: session.user.id,
      changeType: "UPDATE",
      fieldName: "photos",
      oldValue: JSON.stringify(trainer.photos),
      newValue: JSON.stringify(updated.photos),
    },
  });

  revalidateTag("trainers");
  return NextResponse.json({ success: true, photos: updated.photos });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { userId: session.user.id },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = deletePhotoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { url } = parsed.data;
  const newPhotos = trainer.photos.filter((p) => p !== url);

  // If deleting main photo, clear photoUrl
  const updateData: any = { photos: newPhotos };
  if (trainer.photoUrl === url) {
    updateData.photoUrl = null;
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: updateData,
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: session.user.id,
      changeType: "UPDATE",
      fieldName: "photos",
      oldValue: JSON.stringify(trainer.photos),
      newValue: JSON.stringify(updated.photos),
    },
  });

  revalidateTag("trainers");
  return NextResponse.json({ success: true, photos: updated.photos });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { userId: session.user.id },
  });

  if (!trainer) {
    return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = setMainSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 });
  }

  const { photoUrl } = parsed.data;

  // Ensure the photo exists in the photos array
  if (!trainer.photos.includes(photoUrl) && trainer.photoUrl !== photoUrl) {
    return NextResponse.json({ error: "Photo not found in gallery" }, { status: 400 });
  }

  const updated = await prisma.trainer.update({
    where: { id: trainer.id },
    data: { photoUrl },
  });

  await prisma.trainerProfileChange.create({
    data: {
      trainerId: trainer.id,
      changedBy: session.user.id,
      changeType: "UPDATE",
      fieldName: "photoUrl",
      oldValue: trainer.photoUrl || "",
      newValue: photoUrl,
    },
  });

  revalidateTag("trainers");
  return NextResponse.json({ success: true, photoUrl: updated.photoUrl });
}
