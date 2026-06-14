import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { syncUserToSheet } from "@/lib/sheets-sync";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Нормализуем входные данные
    const email = (body.email || "").toLowerCase().trim();
    const password = body.password || "";
    const name = body.name || "";
    const phone = body.phone || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone },
    });

    // Не блокируем ответ если Sheets упал
    syncUserToSheet(user).catch((err) => {
      console.error("[Google Sheets] User sync failed:", err);
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (e) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}