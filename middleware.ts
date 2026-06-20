import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";

// Paths that require rate limiting
const RATE_LIMITED_PATHS = [
  "/api/contact",
  "/api/booking",
  "/api/upload",
  "/api/trainers/apply",
  "/api/auth/register",
  "/api/reviews",
  "/api/documents",
];

// Paths that should skip rate limiting (high-frequency legitimate requests)
const SKIP_RATE_LIMIT_PATHS = [
  "/api/auth/session",
  "/api/trainers",  // Public listing
  "/api/trainers/", // Individual trainer profiles (public)
  "/api/packages",
  "/api/checklist",
  "/api/documents",
  "/api/packages",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Skip rate limiting for high-frequency legitimate endpoints
  if (SKIP_RATE_LIMIT_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Apply rate limiting for protected endpoints
  if (RATE_LIMITED_PATHS.some(path => pathname.startsWith(path))) {
    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Locale detection and redirect
  const locale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || "en";

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
