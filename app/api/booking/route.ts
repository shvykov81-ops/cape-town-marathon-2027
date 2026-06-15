import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { syncBookingToSheet } from "@/lib/sheets-sync";
import { sendBookingNotification } from "@/lib/telegram";
import { z } from "zod";

const bookingSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  trainerId: z.string().optional().nullable(),
  raceCategory: z.string().optional(),
  participants: z.coerce.number().int().min(1).max(20).default(1),
  extras: z.array(z.string()).default([]),
  totalAmount: z.coerce.number().min(0),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      packageId,
      trainerId,
      raceCategory,
      participants,
      extras,
      totalAmount,
      checkInDate,
      checkOutDate,
      phone,
    } = parsed.data;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: "Invalid dates provided" },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "Check-out date must be after check-in date" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });
    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    if (trainerId) {
      const trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
      });
      if (!trainer) {
        return NextResponse.json(
          { error: "Trainer not found" },
          { status: 404 }
        );
      }
    }

    const totalPrice =
      parseFloat(String(totalAmount)) || parseFloat(String(pkg.priceBase));

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        packageId,
        trainerId: trainerId || null,
        status: "pending",
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount: participants,
        totalPrice,
      },
      include: {
        trainer: true,
        package: true,
      },
    });

    let userWithPhone = user;
    if (phone) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
      const freshUser = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
        },
      });
      userWithPhone = {
        ...freshUser,
        role: freshUser.role as "user" | "admin",
      };
    }

    // Sync to Google Sheets (non-blocking)
    syncBookingToSheet(booking, userWithPhone).catch(console.error);

    // Send Telegram notification to admin group (non-blocking)
    const userEmail = userWithPhone.email || "no-email@unknown.com";
    sendBookingNotification(booking, {
      name: userWithPhone.name,
      email: userEmail,
      phone: userWithPhone.phone,
    }).catch(console.error);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (e) {
    console.error("Booking error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
