import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";

const RATE_LIMITED_PATHS = [
  "/api/auth/",
  "/api/booking",
  "/api/contact",
  "/api/admin/",
  "/api/reviews",
  "/api/documents",
];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // === 1. ADMIN AUTH PROTECTION ===
  if (pathname.startsWith("/admin")) {
    const hasSession =
      req.cookies.has("__Secure-authjs.session-token") ||
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  // === 2. RATE LIMITING ===
  const shouldRateLimit = RATE_LIMITED_PATHS.some((p) =>
    pathname.startsWith(p)
  );

  if (shouldRateLimit) {
    const ip = getClientIp(req);

    if (!checkRateLimit(ip, pathname)) {
      const headers = getRateLimitHeaders(ip, pathname);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );
    }

    // Add rate limit headers to all responses for monitored paths
    const response = NextResponse.next();
    const headers = getRateLimitHeaders(ip, pathname);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/booking/:path*",
    "/api/contact/:path*",
    "/api/admin/:path*",
    "/api/reviews/:path*",
    "/api/documents/:path*",
  ],
};
