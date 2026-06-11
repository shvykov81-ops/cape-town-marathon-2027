import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [
    totalUsers,
    totalBookings,
    totalPackages,
    totalTrainers,
    pendingDocuments,
    pendingBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.package.count(),
    prisma.trainer.count(),
    prisma.document.count({ where: { status: "pending" } }),
    prisma.booking.count({ where: { status: "pending" } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalBookings,
    totalPackages,
    totalTrainers,
    pendingDocuments,
    pendingBookings,
  });
}
