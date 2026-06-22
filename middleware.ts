import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

// next-intl middleware — handles / → /en redirect, locale detection, etc.
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── STEP 1: Handle i18n routing FIRST ───
  // next-intl handles: / → /en, locale detection, rewrites, etc.
  const intlResponse = intlMiddleware(request);

  // If next-intl wants to redirect (307/308), return immediately
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // ─── STEP 2: Role-based protection for protected routes ───
  const hasSession =
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("next-auth.session-token");

  // Helper: check if pathname matches protected route (with or without locale prefix)
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/ru/admin");

  const isTrainerRoute =
    pathname.startsWith("/trainer-dashboard") ||
    pathname.startsWith("/en/trainer-dashboard") ||
    pathname.startsWith("/ru/trainer-dashboard");

  const isUserDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/en/dashboard") ||
    pathname.startsWith("/ru/dashboard");

  // ─── ADMIN ROUTES ───
  if (isAdminRoute) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    const role = await getRoleFromToken(request);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─── TRAINER DASHBOARD ROUTES ───
  if (isTrainerRoute) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    const role = await getRoleFromToken(request);
    if (role !== "trainer" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─── USER DASHBOARD ROUTES ───
  if (isUserDashboard) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Return next-intl response (may include rewrites for localized pages)
  return intlResponse;
}

export const config = {
  // IMPORTANT: Must match ALL routes (same as old working middleware)
  // next-intl needs this to intercept / and add locale prefix
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
