import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkDatabase(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", latency: Date.now() - start };
  } catch (e) {
    return { status: "error", latency: Date.now() - start };
  }
}

async function checkTelegram(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return { status: "disabled", latency: 0 };
    }
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      method: "POST",
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      return { status: "ok", latency: Date.now() - start };
    }
    return { status: "error", latency: Date.now() - start };
  } catch {
    return { status: "error", latency: Date.now() - start };
  }
}

async function checkGoogleSheets(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      return { status: "disabled", latency: 0 };
    }
    return { status: "ok", latency: Date.now() - start };
  } catch {
    return { status: "error", latency: Date.now() - start };
  }
}

/**
 * GET /api/health
 * Health check endpoint for monitoring.
 * No auth required.
 */
export async function GET() {
  const startTime = Date.now();

  const [database, telegram, googleSheets] = await Promise.all([
    checkDatabase(),
    checkTelegram(),
    checkGoogleSheets(),
  ]);

  const checks = {
    database,
    telegram,
    googleSheets,
  };

  const healthy = Object.values(checks).every(
    (c) => c.status === "ok" || c.status === "disabled"
  );

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "7.3.0",
      responseTime: `${responseTime}ms`,
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}
