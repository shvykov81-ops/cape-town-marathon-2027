import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/switch-role
 * Validate role switch permissions.
 * Returns redirect path (without locale) — client prepends current locale.
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { role } = body;
  if (!role || !["user", "admin", "trainer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Get user's actual role from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Validate permissions
  const canBeAdmin = user.role === "admin";
  const canBeTrainer = user.role === "trainer" || user.role === "admin";

  let allowed = false;
  if (role === "admin" && canBeAdmin) allowed = true;
  if (role === "trainer" && canBeTrainer) allowed = true;
  if (role === "user") allowed = true;

  if (!allowed) {
    return NextResponse.json(
      { error: `Cannot switch to role: ${role}` },
      { status: 403 }
    );
  }

  // Return redirect PATH (without locale prefix)
  const redirectPath =
    role === "admin" ? "admin" :
    role === "trainer" ? "trainer-dashboard" :
    "dashboard";

  return NextResponse.json({
    success: true,
    role,
    message: `Switched to ${role} role`,
    redirectPath,
  });
}
