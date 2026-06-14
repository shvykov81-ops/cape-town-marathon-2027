import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("__Secure-next-auth.session-token")?.value 
      || request.cookies.get("next-auth.session-token")?.value;
    
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