import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Только /admin защищаем - проверяем наличие session cookie
  if (pathname.startsWith("/admin")) {
    const hasSession = 
      request.cookies.has("__Secure-authjs.session-token") ||
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};