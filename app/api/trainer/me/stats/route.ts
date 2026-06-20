import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";

/**
 * GET /api/trainer/me/stats
 * Returns profile views and booking inquiries for the authenticated trainer.
 */
export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;

  const stats = await prisma.trainer.findUnique({
    where: { id: trainer.id },
    select: {
      profileViews: true,
      bookingInquiries: true,
      rating: true,
      reviewCount: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  if (!stats) {
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }

  return NextResponse.json({
    profileViews: stats.profileViews,
    bookingInquiries: stats.bookingInquiries,
    rating: stats.rating,
    reviewCount: stats.reviewCount,
    totalBookings: stats._count.bookings,
    totalReviews: stats._count.reviews,
  });
}
