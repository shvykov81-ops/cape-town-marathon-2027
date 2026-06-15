import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { findFaqAnswer, FALLBACK_MESSAGE } from "@/lib/telegram-faq";
import { sendTelegramMessage } from "@/lib/telegram";

const telegramUpdateSchema = z.object({
  message: z.object({
    chat: z.object({ id: z.number() }),
    text: z.string().optional(),
    from: z.object({
      id: z.number(),
      first_name: z.string(),
      username: z.string().optional()
    })
  }).optional(),
  callback_query: z.object({
    message: z.object({
      chat: z.object({ id: z.number() })
    }).optional(),
    data: z.string().optional(),
    from: z.object({
      id: z.number(),
      first_name: z.string()
    })
  }).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate secret token if configured
    const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (expectedSecret && secretToken !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const parsed = telegramUpdateSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Webhook validation failed:", parsed.error.flatten());
      return NextResponse.json({ ok: false, error: "Invalid format" }, { status: 400 });
    }

    // Handle callback queries
    if (parsed.data.callback_query) {
      return NextResponse.json({ ok: true });
    }

    // Handle messages
    const message = parsed.data.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id.toString();
    const text = (message.text || "").trim();
    const from = message.from;

    if (!text) {
      return NextResponse.json({ ok: true });
    }

    // Log incoming message
    await prisma.telegramLog.create({
      data: {
        chatId,
        messageType: "user_support",
        payload: body,
        status: "pending"
      }
    });

    // Handle commands
    if (text.startsWith("/")) {
      const command = text.toLowerCase().split(" ")[0];
      let response = "";

      switch (command) {
        case "/start":
          response = `🏃‍♂️ Welcome to Cape Town Marathon 2027 Support Bot!\n\n` +
            `I'm here to help with:\n` +
            `• Prep camp bookings\n` +
            `• Trainer inquiries\n` +
            `• Event information\n` +
            `• General questions\n\n` +
            `Try these commands:\n` +
            `/faq — Common questions\n` +
            `/book — How to book\n` +
            `/contact — Contact options\n` +
            `/help — All commands`;
          break;
        case "/help":
          response = `📋 Available commands:\n\n` +
            `/start — Welcome message\n` +
            `/faq — Frequently asked questions\n` +
            `/book — Booking instructions\n` +
            `/contact — Contact information\n` +
            `/help — This message\n\n` +
            `Or simply type your question!`;
          break;
        case "/faq":
          response = `❓ Common questions:\n\n` +
            `1. How do I book a prep camp?\n` +
            `2. Can I choose a trainer?\n` +
            `3. What are the prices?\n` +
            `4. When is the marathon?\n` +
            `5. What's the refund policy?\n\n` +
            `Type any question and I'll find the answer!`;
          break;
        case "/book":
          response = `🎯 How to book:\n\n` +
            `1. Visit: capetownmarathon2027.com/prep-camp\n` +
            `2. Select your dates\n` +
            `3. Choose a package\n` +
            `4. Complete payment\n\n` +
            `Or use the contact form on our website for custom requests.`;
          break;
        case "/contact":
          response = `📞 Contact us:\n\n` +
            `• Website: capetownmarathon2027.com/contact\n` +
            `• Telegram: Join our group for community support\n` +
            `• This bot: ask anything!\n\n` +
            `Response time: within 24 hours`;
          break;
        default:
          response = "I don't recognize that command. Try /help for available options.";
      }

      await sendTelegramMessage(chatId, response);
    } else {
      // FAQ matching for non-command messages
      const answer = findFaqAnswer(text);

      if (answer) {
        await sendTelegramMessage(chatId, answer);
      } else {
        // Forward to admin group
        const adminGroupId = process.env.TELEGRAM_ADMIN_GROUP_ID;
        if (adminGroupId) {
          const adminMessage = `📩 <b>New Support Question</b>\n\n` +
            `From: ${escapeHtml(from.first_name)} (ID: ${from.id}${from.username ? ", @" + from.username : ""})\n` +
            `Message: ${escapeHtml(text)}\n\n` +
            `Reply to this message to respond directly.`;

          await sendTelegramMessage(adminGroupId, adminMessage);
        }

        await sendTelegramMessage(chatId, FALLBACK_MESSAGE);
      }
    }

    // Update log status
    await prisma.telegramLog.updateMany({
      where: { chatId, status: "pending" },
      data: { status: "sent" }
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
