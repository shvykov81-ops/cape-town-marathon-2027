import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/check-roles
 * Check what roles a user has before login.
 * Returns roles array for role selector.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { trainerProfile: true },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Build roles array
  const roles: Array<{ role: "user" | "admin" | "trainer"; hasTrainerProfile: boolean }> = [];

  // Everyone can be user
  roles.push({ role: "user", hasTrainerProfile: !!user.trainerProfile });

  // Trainer role
  if (user.role === "trainer" || user.role === "admin") {
    if (user.trainerProfile) {
      roles.push({ role: "trainer", hasTrainerProfile: true });
    }
  }

  // Admin role
  if (user.role === "admin") {
    roles.push({ role: "admin", hasTrainerProfile: !!user.trainerProfile });
  }

  return NextResponse.json({ roles });
}
