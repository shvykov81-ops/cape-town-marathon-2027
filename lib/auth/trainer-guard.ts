import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Verify the current user owns a Trainer profile.
 * Returns the trainer record or throws a 403/401 response.
 * Note: We rely on the existence of a Trainer row linked to the user,
 * not on a "trainer" role string, to avoid TypeScript enum conflicts.
 */
export async function requireTrainer() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), trainer: null };
  }

  const trainer = await prisma.trainer.findUnique({
    where: { userId: session.user.id },
  });

  if (!trainer) {
    return { error: NextResponse.json({ error: "Trainer profile not found" }, { status: 403 }), trainer: null };
  }

  // Admins can also access trainer endpoints if they have a trainer profile
  return { error: null, trainer };
}

/**
 * Verify the current user has the 'admin' role.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 }) };
  }

  return { error: null, userId: session.user.id };
}

/**
 * Verify the current user is authenticated (any role).
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), userId: null };
  }
  return { error: null, userId: session.user.id, role: session.user.role };
}
