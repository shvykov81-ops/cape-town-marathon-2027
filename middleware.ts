import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const COOKIE_NAMES = [
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "next-auth.session-token",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    let token: string | undefined;
    
    for (const name of COOKIE_NAMES) {
      const value = request.cookies.get(name)?.value;
      if (value) {
        token = value;
        break;
      }
    }

    if (!token) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};