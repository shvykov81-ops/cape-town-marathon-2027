import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

/**
 * POST /api/auth/update-role
 * Updates the JWT cookie role directly via API route
 * This is more reliable than Server Actions for cookie manipulation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role || !["user", "admin", "trainer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // 1. Get current session token from cookie
    const tokenCookie =
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!tokenCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // 2. Verify and decode current token
    let payload;
    try {
      const verified = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
      payload = verified.payload;
    } catch {
      return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
    }

    // 3. Validate role switch permissions from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { role: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const canBeAdmin = user.role === "admin";
    const canBeTrainer = user.role === "trainer" || user.role === "admin";

    let allowed = false;
    if (role === "admin" && canBeAdmin) allowed = true;
    if (role === "trainer" && canBeTrainer) allowed = true;
    if (role === "user") allowed = true;

    if (!allowed) {
      return NextResponse.json({ error: `Cannot switch to role: ${role}` }, { status: 403 });
    }

    // 4. Create new JWT with updated role
    const now = Math.floor(Date.now() / 1000);
    const newToken = await new SignJWT({
      ...payload,
      role: role,
      originalRole: user.role,
      iat: now,
      exp: now + 30 * 24 * 60 * 60,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime("30d")
      .sign(SECRET);

    // 5. Build redirect URL
    const redirectPath =
      role === "admin" ? "/admin" :
      role === "trainer" ? "/trainer-dashboard" :
      "/dashboard";

    // 6. Create response with ALL cookie names set
    const response = NextResponse.json({
      success: true,
      role,
      redirectUrl: redirectPath,
    });

    // Set ALL possible cookie names
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    };

    response.cookies.set("authjs.session-token", newToken, cookieOptions);
    response.cookies.set("__Secure-authjs.session-token", newToken, cookieOptions);
    response.cookies.set("next-auth.session-token", newToken, cookieOptions);
    response.cookies.set("__Secure-next-auth.session-token", newToken, cookieOptions);

    return response;

  } catch (error) {
    console.error("[update-role] Error:", (error as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
