import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { TrainerProfilePage } from "@/components/trainers/trainer-profile-page";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const getTrainer = unstable_cache(
  async (slug: string) => {
    return prisma.trainer.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            rating: true,
            text: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        },
      },
    });
  },
  ["trainer-profile"],
  { revalidate: 300, tags: ["trainers"] }
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "trainersPage.metadata" });
  const trainer = await getTrainer(slug);

  if (!trainer) {
    return {
      title: t("title"),
      description: t("description"),
    };
  }

  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  return {
    title: `${name} — ${t("title")}`,
    description: trainer.headline || trainer.bio?.substring(0, 160) || t("description"),
    openGraph: {
      images: trainer.photoUrl ? [trainer.photoUrl] : undefined,
    },
  };
}

export default async function TrainerSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const trainer = await getTrainer(slug);

  if (!trainer) {
    notFound();
  }

  // Increment profile views (fire and forget)
  prisma.trainer.update({
    where: { id: trainer.id },
    data: { profileViews: { increment: 1 } },
  }).catch(() => {});

  // Serialize dates for client component
  const serializedTrainer = {
    ...trainer,
    createdAt: trainer.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: trainer.updatedAt?.toISOString() || null,
    publishedAt: trainer.publishedAt?.toISOString() || null,
    reviews: trainer.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
    })),
  };

  return <TrainerProfilePage trainer={serializedTrainer} locale={locale} />;
}
