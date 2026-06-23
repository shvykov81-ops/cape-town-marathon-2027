"use server";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

/**
 * Server Action: Update JWT role directly
 * Sets ALL possible cookie names to ensure compatibility
 */
export async function updateRoleAction(role: string) {
  try {
    // 1. Get current session token from cookie
    const cookieStore = await cookies();

    // Try ALL possible cookie names (NextAuth v5 uses different names)
    const tokenCookie =
      cookieStore.get("__Secure-authjs.session-token")?.value ||
      cookieStore.get("authjs.session-token")?.value ||
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (!tokenCookie) {
      console.error("[updateRoleAction] No session token found in cookies");
      return { success: false, error: "No session found" };
    }

    // 2. Verify and decode current token
    let payload;
    try {
      const verified = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
      payload = verified.payload;
    } catch (verifyError) {
      console.error("[updateRoleAction] JWT verify failed:", (verifyError as Error).message);
      return { success: false, error: "Invalid session token" };
    }

    // 3. Validate role switch permissions from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { role: true, email: true, name: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const canBeAdmin = user.role === "admin";
    const canBeTrainer = user.role === "trainer" || user.role === "admin";

    let allowed = false;
    if (role === "admin" && canBeAdmin) allowed = true;
    if (role === "trainer" && canBeTrainer) allowed = true;
    if (role === "user") allowed = true;

    if (!allowed) {
      return { success: false, error: `Cannot switch to role: ${role}` };
    }

    // 4. Create new JWT with updated role
    const now = Math.floor(Date.now() / 1000);
    const newToken = await new SignJWT({
      ...payload,
      role: role,
      originalRole: user.role,
      iat: now,
      exp: now + 30 * 24 * 60 * 60, // 30 days
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime("30d")
      .sign(SECRET);

    // 5. Set ALL possible cookie names (ensure compatibility)
    // NextAuth v5 beta may use different names on Vercel
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Always secure in production
      sameSite: "lax" as const,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    };

    // Set ALL possible cookie names
    cookieStore.set("authjs.session-token", newToken, cookieOptions);
    cookieStore.set("__Secure-authjs.session-token", newToken, cookieOptions);
    cookieStore.set("next-auth.session-token", newToken, cookieOptions);
    cookieStore.set("__Secure-next-auth.session-token", newToken, cookieOptions);

    console.log(`[updateRoleAction] Role switched to ${role} for user ${user.email}`);

    // 6. Determine redirect URL
    const redirectUrl =
      role === "admin" ? "/admin" :
      role === "trainer" ? "/trainer-dashboard" :
      "/dashboard";

    return {
      success: true,
      role,
      redirectUrl,
      message: `Switched to ${role}`
    };

  } catch (error) {
    console.error("[updateRoleAction] Error:", (error as Error).message);
    return { success: false, error: "Server error" };
  }
}
