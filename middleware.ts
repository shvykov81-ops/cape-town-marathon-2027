import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

const intlMiddleware = createMiddleware(routing);

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

function getLocaleFromPathname(pathname: string): string {
  if (pathname.startsWith("/ru")) return "ru";
  if (pathname.startsWith("/en")) return "en";
  return "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── 1. Run next-intl middleware FIRST (adds locale prefix) ───
  // This handles /admin → /en/admin or /ru/admin BEFORE role checks
  const intlResponse = intlMiddleware(request);

  // If next-intl did a redirect (307/308), return it immediately
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // ─── 2. Check protected routes AFTER locale is resolved ───
  const isAdminRoute =
    pathname.includes("/admin") ||
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/ru/admin");

  const isTrainerRoute =
    pathname.includes("/trainer-dashboard") ||
    pathname.startsWith("/en/trainer-dashboard") ||
    pathname.startsWith("/ru/trainer-dashboard");

  const isDashboardRoute =
    pathname.includes("/dashboard") ||
    pathname.startsWith("/en/dashboard") ||
    pathname.startsWith("/ru/dashboard");

  if (isAdminRoute || isTrainerRoute || isDashboardRoute) {
    const hasSession =
      request.cookies.has("__Secure-authjs.session-token") ||
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("next-auth.session-token");

    const locale = getLocaleFromPathname(pathname);

    if (!hasSession) {
      // Redirect to login with locale
      return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
    }

    const role = await getRoleFromToken(request);

    if (isAdminRoute && role !== "admin") {
      // Redirect to homepage with locale (not raw "/")
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    if (isTrainerRoute && role !== "trainer" && role !== "admin") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    return NextResponse.next();
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
