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

  console.log("[DEBUG] Token cookie found:", !!tokenCookie);

  if (!tokenCookie) return null;

  try {
    const { payload } = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
    console.log("[DEBUG] JWT payload:", JSON.stringify(payload));
    return (payload.role as string) || null;
  } catch (e) {
    console.log("[DEBUG] JWT verify error:", e);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl













;

  console.log("[DEBUG] pathname:", pathname);

  const intlResponse = intlMiddleware(request);

  if (intlResponse.status === 307 || intlResponse.status === 308) {
    console.log("[DEBUG] intl redirect:", intlResponse.status);
    return intlResponse;
  }

  const hasSession =
    request.cookies.has("__Secure-authjs.session-token") ||
 












   request.cookies.has("authjs.session-token") ||
    request.cookies.has("next-auth.session-token");

  console.log("[DEBUG] hasSession:", hasSession);

  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/en/admin") ||
    pathname.startsWith("/ru/admin");










  console.log("[DEBUG] isAdminRoute:", isAdminRoute);

  if (isAdminRoute) {
    if (!hasSession) {
      console.log("[DEBUG] No session, redirect to /account");
      return NextResponse.redirect(new URL("/account", request.url));
    }
 







   const role = await getRoleFromToken(request);
    console.log("[DEBUG] Role from token:", role);
    if (role !== "admin") {
      console.log("[DEBUG] Role !== admin, redirect to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
 





 }

  console.log("[DEBUG] Pass through");
  return intlResponse;
}

export const config = {







  matcher: [
    "/((?!api|_next|_vercel|videos|images|uploads|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};