const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID;

if (!BOT_TOKEN && process.env.NODE_ENV === "production") {
  console.warn("TELEGRAM_BOT_TOKEN not set — Telegram notifications disabled");
}

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!BOT_TOKEN) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Telegram send failed:", error);
    return false;
  }
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt: Date;
}): Promise<boolean> {
  if (!ADMIN_GROUP_ID) return false;

  const subjectLabels: Record<string, string> = {
    GENERAL: "General Inquiry",
    PREP_CAMP: "Prep Camp Booking",
    TRAINER: "Trainer Inquiry",
    PARTNERSHIP: "Partnership",
    MEDIA: "Media Request"
  };

  const text = `📬 <b>New Contact Form Submission</b>

👤 <b>Name:</b> ${escapeHtml(contact.name)}
📧 <b>Email:</b> ${escapeHtml(contact.email)}
📱 <b>Phone:</b> ${contact.phone ? escapeHtml(contact.phone) : "Not provided"}
📋 <b>Subject:</b> ${subjectLabels[contact.subject] || contact.subject}

📝 <b>Message:</b>
${escapeHtml(contact.message)}

⏰ <b>Received:</b> ${contact.createdAt.toISOString()}
🔗 <b>Reply:</b> Reply to this thread or email ${escapeHtml(contact.email)}`;

  return sendTelegramMessage(ADMIN_GROUP_ID, text);
}

export async function sendBookingNotification(booking: {
  id: string;
  status: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestsCount: number;
  totalPrice: number | Decimal;
  trainer?: { firstName: string; lastName: string } | null;
  package?: { name: string };
}, user: {
  name?: string | null;
  email: string;
  phone?: string | null;
}): Promise<boolean> {
  if (!ADMIN_GROUP_ID) return false;

  const trainerName = booking.trainer
    ? `${booking.trainer.firstName} ${booking.trainer.lastName}`
    : "Not selected";

  const packageName = booking.package?.name || "Unknown package";
  const userName = user.name || user.email;

  const text = `🏃‍♂️ <b>New Booking!</b>

👤 <b>User:</b> ${escapeHtml(userName)}
📧 <b>Email:</b> ${escapeHtml(user.email)}
📱 <b>Phone:</b> ${user.phone ? escapeHtml(user.phone) : "Not provided"}

📦 <b>Package:</b> ${escapeHtml(packageName)}
👨‍🏫 <b>Trainer:</b> ${escapeHtml(trainerName)}
📅 <b>Dates:</b> ${formatDate(booking.checkInDate)} — ${formatDate(booking.checkOutDate)}
👥 <b>Guests:</b> ${booking.guestsCount}
💰 <b>Total:</b> $${booking.totalPrice}
⏳ <b>Status:</b> ${booking.status}

🔗 <b>Booking ID:</b> <code>${booking.id}</code>

📝 <b>Action:</b> Review in admin panel`;

  return sendTelegramMessage(ADMIN_GROUP_ID, text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

type Decimal = { toString(): string };
