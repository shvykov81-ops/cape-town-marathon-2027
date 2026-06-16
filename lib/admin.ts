import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Unified admin authorization helper.
 * Returns null if authorized, or a NextResponse if denied.
 * 
 * Usage:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin(): Promise<null | NextResponse> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

/**
 * Check if user is admin without returning response.
 * Returns boolean for conditional logic.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return !!(session?.user && session.user.role === "admin");
}
