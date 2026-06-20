import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function requireTrainer() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null, trainer: null, user: null };
  }

  if (session.user.role !== "trainer" && session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Trainer role required" }, { status: 403 }), session: null, trainer: null, user: null };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { trainerProfile: true },
  });

  if (!user) {
    return { error: NextResponse.json({ error: "User not found" }, { status: 404 }), session: null, trainer: null, user: null };
  }

  return { error: null, session, trainer: user.trainerProfile, user };
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null, userId: null };
  }

  if (session.user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 }), session: null, userId: null };
  }

  return { error: null, session, userId: session.user.id };
}
