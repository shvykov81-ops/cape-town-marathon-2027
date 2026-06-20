import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TrainerDashboardNav } from "@/components/trainer-dashboard/trainer-dashboard-nav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("trainerDashboard");
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function TrainerDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${locale}/account`);
  }

  // Allow trainers and admins
  if (session.user.role !== "trainer" && session.user.role !== "admin") {
    redirect(`/${locale}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { trainerProfile: true },
  });

  const status = user?.trainerProfile?.status || "DRAFT";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <TrainerDashboardNav status={status} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
