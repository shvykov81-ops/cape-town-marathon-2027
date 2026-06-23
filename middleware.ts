import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ROLE_COOKIE = "x-active-role";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run intl middleware first for locale handling
  const intlResponse = intlMiddleware(request);

  // Check if protected route
  const isAdminRoute = pathname.includes("/admin");
  const isTrainerRoute = pathname.includes("/trainer-dashboard");

  if (!isAdminRoute && !isTrainerRoute) {
    return intlResponse;
  }

  // Read role from unencrypted cookie (set by /api/auth/set-role-cookie)
  const role = request.cookies.get(ROLE_COOKIE)?.value || null;
  const locale = pathname.split("/")[1] || "en";

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (isTrainerRoute && role !== "trainer" && role !== "admin") {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
