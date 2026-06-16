import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { documentSchema } from "@/lib/validations/document";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = documentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, type, url } = parsed.data;

    const document = await prisma.document.create({
      data: { userId: user.id, name, type, url },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Document create error:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
