import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: {
      trainerId: id,
      isPublished: true,
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: trainerId } = await params;
  const body = await req.json();
  const { bookingId, rating, text } = body;

  if (!bookingId || !rating || !text) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Проверяем, что пользователь действительно бронировал этого тренера
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId: session.user.id,
      trainerId: trainerId,
      status: "confirmed",
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "No confirmed booking found with this trainer" },
      { status: 403 }
    );
  }

  // Проверяем, что отзыв еще не оставлен
  const existing = await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      trainerId: trainerId,
      bookingId: bookingId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Review already exists" },
      { status: 409 }
    );
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      bookingId: bookingId,
      trainerId: trainerId,
      rating: parseInt(rating),
      text: text,
      images: body.images || [],
    },
  });

  return NextResponse.json(review, { status: 201 });
}
