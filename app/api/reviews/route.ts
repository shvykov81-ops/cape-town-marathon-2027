import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations/review";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublished: true },
      include: {
        user: { select: { name: true, image: true } },
        trainer: { select: { firstName: true, lastName: true, photoUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bookingId, trainerId, rating, text, images } = parsed.data;

    // Validate booking ownership if bookingId provided
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { userId: true },
      });
      if (!booking || booking.userId !== user.id) {
        return NextResponse.json(
          { error: "Invalid booking" },
          { status: 403 }
        );
      }
    }

    // Validate trainer exists if trainerId provided
    if (trainerId) {
      const trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
        select: { id: true },
      });
      if (!trainer) {
        return NextResponse.json(
          { error: "Trainer not found" },
          { status: 404 }
        );
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        bookingId: bookingId || null,
        trainerId: trainerId || null,
        rating,
        text,
        images,
        isPublished: false, // Require admin approval
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
