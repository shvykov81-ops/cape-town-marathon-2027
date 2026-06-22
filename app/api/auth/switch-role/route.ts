import { NextRequest, NextResponse } from "next/server";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/switch-role
 * Switch active role during session (admin can switch to trainer and back).
 * Updates JWT token via unstable_update.
 * Requires valid session.
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

  // Get user's actual role and trainer profile from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { trainerProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Validate role switch permissions
  const canBeAdmin = user.role === "admin";
  // Admin can ALWAYS be trainer (even without profile — can create later)
  const canBeTrainer = user.role === "trainer" || user.role === "admin";
  const canBeUser = true; // Everyone can be user

  let allowed = false;
  if (role === "admin" && canBeAdmin) allowed = true;
  if (role === "trainer" && canBeTrainer) allowed = true;
  if (role === "user" && canBeUser) allowed = true;

  if (!allowed) {
    return NextResponse.json(
      { error: `Cannot switch to role: ${role}. Insufficient permissions.` },
      { status: 403 }
    );
  }

  // ─── CRITICAL FIX: Update JWT token ───
  // unstable_update triggers the JWT callback with trigger: "update"
  // This updates the role in the session token
  try {
    await unstable_update({ activeRole: role as "user" | "admin" | "trainer" });
  } catch (error) {
    console.error("Failed to update session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }

  const redirectUrl =
    role === "admin" ? "/admin" :
    role === "trainer" ? "/trainer-dashboard" :
    "/dashboard";

  return NextResponse.json({
    success: true,
    role,
    message: `Switched to ${role} role`,
    redirectUrl,
  });
}
