import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTrainer } from "@/lib/auth/trainer-guard";

export async function GET() {
  const { error, trainer } = await requireTrainer();
  if (error) return error;
  if (!trainer) return NextResponse.json({ error: "Trainer profile not found" }, { status: 404 });

  const bookingCount = await prisma.booking.count({ where: { trainerId: trainer.id } });
  return NextResponse.json({
    profileViews: trainer.profileViews,
    bookingInquiries: trainer.bookingInquiries,
    totalBookings: bookingCount,
    rating: trainer.rating,
    reviewCount: trainer.reviewCount,
    status: trainer.status,
  });
}
