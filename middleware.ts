import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Проверяем авторизацию только для защищённых роутов
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const session = await auth();
    
    // Нет сессии → на страницу входа
    if (!session) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    
    // Для /admin проверяем роль
    if (pathname.startsWith("/admin") && session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};