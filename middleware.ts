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

// Static assets that should NEVER be locale-redirected
const STATIC_PATHS = [
  "/images/",
  "/uploads/",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/_next/",
  "/api/",
];

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  if (acceptLang && locales.includes(acceptLang as any)) return acceptLang;
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // ====== SKIP STATIC ASSETS & API ======
  if (STATIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ====== LOCALE REDIRECT ======
  const pathnameHasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // ====== RATE LIMITING (only for API routes) ======
  if (pathname.startsWith("/api/")) {
    if (SKIP_RATE_LIMIT_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }
    if (RATE_LIMITED_PATHS.some((path) => pathname.startsWith(path))) {
      if (!checkRateLimit(ip, pathname)) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
