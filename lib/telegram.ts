import { TrainerProfileStatus } from "@prisma/client";

/**
 * Send notification to admin Telegram group about trainer status change.
 */
export async function sendTrainerStatusChangeNotification(
  trainer: {
    displayName: string | null;
    firstName: string;
    lastName: string;
    slug: string;
    status: TrainerProfileStatus;
  },
  oldStatus: string,
  adminName: string | null
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Trainer status change:", trainer.displayName, oldStatus, "→", trainer.status);
    return;
  }

  const statusEmoji: Record<string, string> = {
    DRAFT: "📝",
    PENDING: "⏳",
    PUBLISHED: "✅",
    REJECTED: "❌",
    SUSPENDED: "🚫",
    APPLICATION_APPROVED: "🎉",
  };

  const message = `
<b>${statusEmoji[trainer.status] || "📋"} Trainer Status Update</b>

<b>Name:</b> ${trainer.displayName || `${trainer.firstName} ${trainer.lastName}`}
<b>Slug:</b> ${trainer.slug}
<b>Status:</b> ${oldStatus} → <b>${trainer.status}</b>
<b>By:</b> ${adminName || "System"}

<a href="${process.env.NEXTAUTH_URL}/trainers/${trainer.slug}">View Profile</a>
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

/**
 * T-5: Admin notification when trainer submits profile for review
 */
export async function sendTrainerSubmissionNotification({
  trainerName,
  trainerSlug,
  submittedAt,
}: {
  trainerName: string;
  trainerSlug: string;
  submittedAt: Date;
}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Trainer submitted:", trainerName, submittedAt);
    return;
  }

  const message = `
<b>⏳ New Trainer Submission</b>

<b>Trainer:</b> ${trainerName}
<b>Submitted:</b> ${submittedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}

<a href="${process.env.NEXTAUTH_URL}/admin/trainers">Review in Admin Panel</a>
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

/**
 * T-2: Admin notification when trainer submits a revision
 */
export async function sendTrainerRevisionSubmittedNotification({
  trainerName,
  trainerSlug,
  revisionId,
  submittedAt,
}: {
  trainerName: string;
  trainerSlug: string;
  revisionId: string;
  submittedAt: Date;
}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Revision submitted:", trainerName, revisionId);
    return;
  }

  const message = `
<b>📝 New Revision Submitted</b>

<b>Trainer:</b> ${trainerName}
<b>Revision ID:</b> <code>${revisionId}</code>
<b>Submitted:</b> ${submittedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}

<a href="${process.env.NEXTAUTH_URL}/admin/revisions">Review Revisions</a>
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

// ─── BACKWARD COMPATIBILITY EXPORTS ─────────────────────
// These functions existed in the original telegram.ts
// and are imported by other API routes

/**
 * Send booking notification to admin group.
 * Used by: app/api/booking/route.ts
 * Signature: sendBookingNotification(booking, { name, email, phone })
 */
export async function sendBookingNotification(
  booking: any,
  userInfo: { name: string | null; email: string; phone: string | null }
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Booking:", userInfo.name, booking.package?.name || "package");
    return;
  }

  const message = `
<b>🎉 New Booking</b>

<b>User:</b> ${userInfo.name || "Unknown"}
<b>Email:</b> ${userInfo.email}
<b>Phone:</b> ${userInfo.phone || "Not provided"}
<b>Package:</b> ${booking.package?.name || "Unknown"}
<b>Total:</b> $${booking.totalPrice}
<b>Check-in:</b> ${new Date(booking.checkInDate).toLocaleDateString("en-US")}
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

/**
 * Send contact form notification to admin group.
 * Used by: app/api/contact/route.ts
 * Signature: sendContactNotification({ name, email, phone, subject, message, createdAt })
 */
export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt?: Date;
}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Contact:", contact.name, contact.subject);
    return;
  }

  const message = `
<b>📨 New Contact Message</b>

<b>From:</b> ${contact.name}
<b>Email:</b> ${contact.email}
<b>Phone:</b> ${contact.phone || "Not provided"}
<b>Subject:</b> ${contact.subject}
<b>Message:</b> ${contact.message.slice(0, 500)}${contact.message.length > 500 ? "..." : ""}
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

/**
 * Send trainer application notification to admin group.
 * Used by: app/api/trainers/apply/route.ts
 * Signature: sendTrainerApplicationNotification({ name, email, applicationId, createdAt })
 */
export async function sendTrainerApplicationNotification(application: {
  name: string;
  email: string;
  applicationId?: string;
  createdAt?: Date;
  experience?: string;
}): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_GROUP_ID;

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Trainer application:", application.name);
    return;
  }

  const message = `
<b>👤 New Trainer Application</b>

<b>Name:</b> ${application.name}
<b>Email:</b> ${application.email}
<b>Experience:</b> ${application.experience || "Not provided"}
${application.applicationId ? `<b>Application ID:</b> ${application.applicationId}` : ""}

<a href="${process.env.NEXTAUTH_URL}/admin/trainer-applications">Review Applications</a>
  `.trim();

  await sendTelegramMessage(botToken, chatId, message);
}

/**
 * Low-level Telegram API helper.
 * Used by: app/api/telegram/webhook/route.ts
 * Signature: sendTelegramMessage(chatId, text) — botToken from env
 *           sendTelegramMessage(botToken, chatId, text) — explicit
 */
export async function sendTelegramMessage(
  arg1: string,
  arg2: string,
  arg3?: string
): Promise<void> {
  let botToken: string;
  let chatId: string;
  let text: string;

  if (arg3 !== undefined) {
    // 3-arg form: sendTelegramMessage(botToken, chatId, text)
    botToken = arg1;
    chatId = arg2;
    text = arg3;
  } else {
    // 2-arg form: sendTelegramMessage(chatId, text) — botToken from env
    botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    chatId = arg1;
    text = arg2;
  }

  if (!botToken || !chatId) {
    console.log("[TELEGRAM MOCK] Message to", chatId, ":", text.slice(0, 50));
    return;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}
