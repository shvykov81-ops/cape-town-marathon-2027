// middleware.ts — ИСПРАВЛЕННАЯ ВЕРСИЯ
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { locales, defaultLocale } from "@/i18n/config";

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

// Paths that should skip rate limiting
const SKIP_RATE_LIMIT_PATHS = [
  "/api/auth/session",
  "/api/trainers",
  "/api/packages",
  "/api/checklist",
];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Check for locale in pathname first
  const pathnameLocale = locales.find(
    (l) => request.nextUrl.pathname.startsWith(`/${l}/`) || request.nextUrl.pathname === `/${l}`
  );
  if (pathnameLocale) return pathnameLocale;

  // Check accept-language header
  const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  if (acceptLang && locales.includes(acceptLang as any)) return acceptLang;

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // ====== LOCALE REDIRECT / REWRITE ======
  const pathnameHasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (!pathnameHasLocale && !pathname.startsWith("/api/") && !pathname.startsWith("/_next/") && !pathname.startsWith("/favicon") && !pathname.startsWith("/robots") && !pathname.startsWith("/sitemap")) {
    // Redirect / → /en or /ru based on browser language
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
  // =======================================

  // Skip rate limiting for high-frequency legitimate endpoints
  if (SKIP_RATE_LIMIT_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Apply rate limiting for protected endpoints
  if (RATE_LIMITED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};