import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const documents = await prisma.document.findMany({
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
}
