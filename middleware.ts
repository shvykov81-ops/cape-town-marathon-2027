import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log EVERYTHING
  console.log("=== MIDDLEWARE START ===");
  console.log("Path:", pathname);
  console.log("Cookie names:", request.cookies.getAll().map(c => c.name));

  // Try to read token
  const tokenCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  console.log("Has token:", !!tokenCookie);

  let role = null;
  if (tokenCookie) {
    try {
      const { payload } = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
      role = payload.role;
      console.log("Token role:", role);
      console.log("Token originalRole:", payload.originalRole);
      console.log("Token sub:", payload.sub);
    } catch (e) {
      console.log("Token verify error:", (e as Error).message);
    }
  }

  // Check if admin route
  const isAdminRoute = pathname.includes("/admin");
  console.log("Is admin route:", isAdminRoute);

  if (isAdminRoute) {
    console.log("Admin route check — role:", role, "required: admin");
    if (role !== "admin") {
      console.log("ACCESS DENIED — redirecting to /ru");
      return NextResponse.redirect(new URL("/ru", request.url));
    }
    console.log("ACCESS GRANTED");
  }

  console.log("=== MIDDLEWARE END ===");

  // Run intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
