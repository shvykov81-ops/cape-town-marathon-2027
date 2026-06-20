import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * GET /api/auth/session
 * NextAuth v5 built-in session endpoint.
 * This route is handled by NextAuth internally.
 * Rate limiting for this endpoint is configured in middleware.ts
 * with a higher limit (60/min) to prevent 429 errors on legitimate usage.
 */
export async function GET() {
  const session = await auth();
  return NextResponse.json(session);
}
