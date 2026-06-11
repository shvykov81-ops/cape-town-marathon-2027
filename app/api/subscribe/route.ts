import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
