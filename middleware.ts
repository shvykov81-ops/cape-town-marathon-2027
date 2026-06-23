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
  // Try ALL possible cookie names
  const tokenCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!tokenCookie) {
    console.log("[Middleware] No session token found");
    return null;
  }

  try {
    const { payload } = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
    console.log("[Middleware] JWT verified, role:", payload.role);
    return (payload.role as string) || null;
  } catch (error) {
    console.error("[Middleware] JWT verify failed:", (error as Error).message);
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

  // DEBUG: Log all cookies
  console.log("[Middleware] Path:", pathname);
  console.log("[Middleware] Cookies:", Array.from(request.cookies.getAll()).map(c => c.name));

  // ─── 1. Run next-intl middleware FIRST ───
  const intlResponse = intlMiddleware(request);

  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // ─── 2. Check protected routes ───
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
      request.cookies.has("next-auth.session-token") ||
      request.cookies.has("__Secure-next-auth.session-token");

    const locale = getLocaleFromPathname(pathname);
    console.log("[Middleware] Has session:", hasSession, "Locale:", locale);

    if (!hasSession) {
      console.log("[Middleware] No session, redirecting to login");
      return NextResponse.redirect(new URL(`/${locale}/account`, request.url));
    }

    const role = await getRoleFromToken(request);
    console.log("[Middleware] Role:", role, "Required:", isAdminRoute ? "admin" : isTrainerRoute ? "trainer" : "user");

    if (isAdminRoute && role !== "admin") {
      console.log("[Middleware] Admin access denied, role:", role);
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    if (isTrainerRoute && role !== "trainer" && role !== "admin") {
      console.log("[Middleware] Trainer access denied, role:", role);
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    console.log("[Middleware] Access granted");
    return NextResponse.next();
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
