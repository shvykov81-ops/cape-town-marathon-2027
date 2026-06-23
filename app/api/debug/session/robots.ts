import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || ""
);

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const cookieNames = cookies.map(c => c.name);

  // Try to find and verify the session token
  let tokenInfo = null;
  const tokenCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (tokenCookie) {
    try {
      const { payload } = await jwtVerify(tokenCookie, SECRET, { clockTolerance: 60 });
      tokenInfo = {
        role: payload.role,
        originalRole: payload.originalRole,
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (e) {
      tokenInfo = { error: (e as Error).message };
    }
  }

  return NextResponse.json({
    cookies: cookieNames,
    hasToken: !!tokenCookie,
    tokenInfo,
    headers: {
      cookie: request.headers.get("cookie")?.substring(0, 100) + "...",
    },
  });
}
