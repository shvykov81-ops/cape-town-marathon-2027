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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
