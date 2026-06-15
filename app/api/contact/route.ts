import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true }, { status: 200 }); // Fake success
    }

    // Validation
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || undefined,
        source: "contact_page"
      }
    });

    // Send Telegram notification (async, non-blocking)
    sendContactNotification({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      createdAt: contactMessage.createdAt
    }).then((sent) => {
      if (sent) {
        prisma.contactMessage.update({
          where: { id: contactMessage.id },
          data: { telegramSent: true }
        }).catch(console.error);
      }
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      messageId: contactMessage.id,
      message: "Thank you! We'll get back to you within 24 hours."
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
