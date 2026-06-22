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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsW














ith("/en/admin") ||
    pathname.startsWith("/ru/admin");

  const isTrainerRoute =
    pathname.startsWith("/trainer-dashboard") ||
    pathname.startsWith("/en/trainer-dashboard") ||
    pathname.startsWith("/ru/trainer-dashboard");

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/en









/dashboard") ||
    pathname.startsWith("/ru/dashboard");

  if (isAdminRoute || isTrainerRoute || isDashboardRoute) {
    const hasSession =
      request.cookies.has("__Secure-authjs.session-token") ||
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    const role = await getRoleFromToken(request);

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isTrainerRoute && role !== "trainer" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(




request);

  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*),"
  ],
};
