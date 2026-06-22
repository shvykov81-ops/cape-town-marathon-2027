import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "");

/**
 * Decode JWT token from cookie to get role
 */
async function getRoleFromToken(request: NextRequest): Promise<string | null> {
  const tokenCookie = 
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
    return (payload.role as string) || null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const hasSession =
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("next-auth.session-token");

  // ─── ADMIN ROUTES ───
  if (pathname.startsWith("/admin") || pathname.startsWith("/ru/admin")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    const role = await getRoleFromToken(request);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─── TRAINER DASHBOARD ROUTES ───
  if (pathname.startsWith("/trainer-dashboard") || pathname.startsWith("/ru/trainer-dashboard")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    const role = await getRoleFromToken(request);
    if (role !== "trainer" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─── USER DASHBOARD ROUTES ───
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/ru/dashboard")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/ru/admin/:path*",
    "/trainer-dashboard/:path*",
    "/ru/trainer-dashboard/:path*",
    "/dashboard/:path*",
    "/ru/dashboard/:path*",
  ],
};
