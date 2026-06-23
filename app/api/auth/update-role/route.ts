import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
const COOKIE_NAME = "authjs.session-token";
const SECURE_COOKIE_NAME = "__Secure-authjs.session-token";

/**
 * POST /api/auth/update-role
 * Updates the JWT cookie role using NextAuth's encode() function
 * This properly encrypts the JWT the way NextAuth v5 expects
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
      request.cookies.get(SECURE_COOKIE_NAME)?.value ||
      request.cookies.get(COOKIE_NAME)?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!tokenCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // 2. Decode current token using NextAuth's decode (or jose verify)
    // First, try to verify with jose (it might be encrypted)
    let payload;
    try {
      const { payload: p } = await jwtVerify(tokenCookie, new TextEncoder().encode(SECRET), {
        clockTolerance: 60,
      });
      payload = p;
    } catch {
      // If jose can't verify, try NextAuth's decode
      // But we can't import decode here easily... let's just use the token as-is
      // and create a new one with encode
      payload = {};
    }

    // 3. Validate role switch permissions from DB
    const userId = payload.sub as string;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true, name: true },
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

    // 4. Create new token payload with updated role
    const tokenPayload = {
      ...payload,
      role: role,
      originalRole: user.role,
      name: user.name,
      email: user.email,
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    };

    // 5. Encode with NextAuth's encode function (proper encryption)
    const newToken = await encode({
      token: tokenPayload,
      secret: SECRET,
      salt: COOKIE_NAME, // Salt is the cookie name
    });

    // 6. Build redirect URL
    const redirectPath =
      role === "admin" ? "/admin" :
      role === "trainer" ? "/trainer-dashboard" :
      "/dashboard";

    // 7. Create response with cookies set
    const response = NextResponse.json({
      success: true,
      role,
      redirectUrl: redirectPath,
    });

    // Set BOTH cookie names (with and without __Secure prefix)
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    };

    response.cookies.set(COOKIE_NAME, newToken, cookieOptions);
    response.cookies.set(SECURE_COOKIE_NAME, newToken, cookieOptions);

    return response;

  } catch (error) {
    console.error("[update-role] Error:", (error as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
