import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  return NextResponse.json({
    session,
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}