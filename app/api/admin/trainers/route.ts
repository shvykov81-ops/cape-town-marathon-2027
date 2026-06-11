import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const trainers = await prisma.trainer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(trainers);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const {
    firstName,
    lastName,
    bio,
    credentials,
    photoUrl,
    photos,
    instagramUrl,
    tripsterUrl,
    rating,
    reviewCount,
    specialties,
    languages,
  } = body;

  const trainer = await prisma.trainer.create({
    data: {
      firstName,
      lastName,
      bio,
      credentials,
      photoUrl,
      photos: photos || [],
      instagramUrl,
      tripsterUrl,
      rating: rating || 0,
      reviewCount: reviewCount || 0,
      specialties: specialties || [],
      languages: languages || [],
    },
  });

  return NextResponse.json(trainer);
}
