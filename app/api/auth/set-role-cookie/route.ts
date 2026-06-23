import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/auth/set-role-cookie
 * Sets an unencrypted cookie with the user's active role.
 * Called by client after sign-in and after role-switch.
 * This cookie is readable by Edge middleware (unlike encrypted NextAuth session).
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const role = body.role || session.user.role;
  const originalRole = (session.user as any).originalRole || role;

  const response = NextResponse.json({ success: true, role });

  // Set unencrypted role cookies — readable by Edge middleware
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };

  response.cookies.set("x-active-role", role, cookieOptions);
  response.cookies.set("x-original-role", originalRole, cookieOptions);

  return response;
}

/**
 * DELETE /api/auth/set-role-cookie
 * Clears role cookies on sign out.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("x-active-role");
  response.cookies.delete("x-original-role");
  return response;
}
