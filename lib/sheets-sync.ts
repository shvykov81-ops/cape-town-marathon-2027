import { appendToSheet } from "./google-sheets";

export async function syncBookingToSheet(booking: any, user: any, phone?: string) {
  try {
    // Fetch trainer name if trainerId exists
    let trainerName = "";
    if (booking.trainerId) {
      try {
        const { prisma } = await import("@/lib/prisma");
        const trainer = await prisma.trainer.findUnique({
          where: { id: booking.trainerId },
          select: { firstName: true, lastName: true },
        });
        if (trainer) {
          trainerName = `${trainer.firstName} ${trainer.lastName}`;
        }
      } catch (e) {
        console.error("[Google Sheets] Failed to fetch trainer:", e);
      }
    }

    await appendToSheet({
      spreadsheetId: process.env.GOOGLE_SHEET_ID_BOOKINGS!,
      range: "Bookings!A1",
      values: [
        [
          booking.id,
          new Date(booking.createdAt).toISOString(),
          user.email,
          user.name || "",
          booking.packageId,
          `${booking.checkInDate} - ${booking.checkOutDate}`,
          String(booking.guestsCount),
          String(booking.totalPrice),
          booking.status,
          phone || user.phone || "",
          trainerName,
          booking.trainerId || "",
        ],
      ],
    });
  } catch (e) {
    console.error("[Google Sheets] Booking sync failed:", e);
  }
}

export async function syncUserToSheet(user: any) {
  try {
    await appendToSheet({
      spreadsheetId: process.env.GOOGLE_SHEET_ID_USERS!,
      range: "Users!A1",
      values: [
        [
          user.id,
          new Date(user.createdAt).toISOString(),
          user.email,
          user.name || "",
          user.phone || "",
          user.nationality || "",
          user.telegramId || "",
        ],
      ],
    });
  } catch (e) {
    console.error("[Google Sheets] User sync failed:", e);
  }
}
