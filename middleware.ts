import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { locales, defaultLocale } from "@/i18n/config";

const RATE_LIMITED_PATHS = [
  "/api/auth/",
  "/api/booking",
  "/api/contact",
  "/api/admin/",
  "/api/reviews",
  "/api/documents",
];

const PUBLIC_FILE = /\.(.*)$/;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getLocaleFromRequest(req: NextRequest): string {
  const acceptLang = req.headers.get("accept-language");
  if (!acceptLang) return defaultLocale;

  const preferred = acceptLang.split(",")[0].split("-")[0].toLowerCase();
  return locales.includes(preferred as typeof locales[number]) ? preferred : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public files and API routes for locale handling
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/videos/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    // But still apply rate limiting to API routes
    if (pathname.startsWith("/api/")) {
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
        const response = NextResponse.next();
        const headers = getRateLimitHeaders(ip, pathname);
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      }
    }
    return NextResponse.next();
  }

  // === 1. ADMIN AUTH PROTECTION ===
  if (pathname.startsWith("/admin")) {
    const hasSession =
      req.cookies.has("__Secure-authjs.session-token") ||
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/en/account", req.url));
    }
    return NextResponse.next();
  }

  // === 2. LOCALE HANDLING ===
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale
    const locale = req.cookies.get("locale")?.value || getLocaleFromRequest(req);
    const newUrl = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|images|videos|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
