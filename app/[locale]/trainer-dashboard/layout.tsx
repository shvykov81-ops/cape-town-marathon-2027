import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/trainer-dashboard`);
  }

  // Check if user has trainer role OR a trainer profile (any status)
  const [user, trainer] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
    prisma.trainer.findFirst({
      where: { userId: session.user.id },
      select: { id: true, status: true },
    }),
  ]);

  const hasTrainerAccess =
    user?.role === "trainer" ||
    user?.role === "admin" ||
    trainer !== null;

  if (!hasTrainerAccess) {
    redirect(`/${locale}/trainers`);
  }

  // If user has a trainer profile but role is still "user", update it
  if (trainer && user?.role === "user") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "trainer" },
    });
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  );
}
