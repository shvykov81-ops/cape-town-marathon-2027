import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";

const DEFAULT_CHECKLIST = [
  { title: "Book flights to Cape Town", category: "travel" },
  { title: "Arrange accommodation", category: "travel" },
  { title: "Apply for travel insurance", category: "travel" },
  { title: "Upload passport copy", category: "documents" },
  { title: "Upload medical certificate", category: "documents" },
  { title: "Complete 30km long run", category: "training" },
  { title: "Complete 35km long run", category: "training" },
  { title: "Get race day nutrition plan", category: "health" },
  { title: "Schedule sports massage", category: "health" },
  { title: "Confirm airport transfer", category: "travel" },
];

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let items = await prisma.checklistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (items.length === 0) {
    await prisma.checklistItem.createMany({
      data: DEFAULT_CHECKLIST.map((item) => ({
        ...item,
        userId: user.id,
      })),
    });
    items = await prisma.checklistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
  }

  return NextResponse.json(items);
}
