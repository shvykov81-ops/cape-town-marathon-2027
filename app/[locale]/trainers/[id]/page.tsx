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

// ─── Safe date serialization (handles both Date objects and strings from cache) ───
function serializeDate(date: Date | string | null | undefined): string {
  if (!date) return new Date().toISOString();
  if (typeof date === "string") return date;
  return date.toISOString();
}

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

  // Serialize dates for client component (safe for cache hits too)
  const serializedTrainer = {
    ...trainer,
    createdAt: serializeDate(trainer.createdAt),
    updatedAt: trainer.updatedAt ? serializeDate(trainer.updatedAt) : null,
    publishedAt: trainer.publishedAt ? serializeDate(trainer.publishedAt) : null,
    reviews: trainer.reviews.map((r) => ({
      ...r,
      createdAt: serializeDate(r.createdAt),
    })),
  };

  return <TrainerProfilePage trainer={serializedTrainer} locale={locale} />;
}