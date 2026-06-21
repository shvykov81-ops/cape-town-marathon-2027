import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cape-town-marathon-2027.vercel.app";

// Отключаем статическую генерацию на build-time — sitemap генерируется динамически
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "", "/trainers", "/about-race", "/booking", "/contact", "/pricing",
  "/prep-camp", "/cape-town-guide", "/race-week", "/blog", "/faq",
  "/terms", "/privacy", "/refund", "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Статические маршруты для EN и RU
  for (const locale of ["en", "ru"]) {
    for (const route of STATIC_ROUTES) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Динамические маршруты тренеров — с graceful fallback, если БД недоступна
  try {
    const { prisma } = await import("@/lib/prisma");
    const { TrainerProfileStatus } = await import("@prisma/client");

    const trainers = await prisma.trainer.findMany({
      where: { status: TrainerProfileStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });

    for (const locale of ["en", "ru"]) {
      for (const trainer of trainers) {
        sitemapEntries.push({
          url: `${BASE_URL}/${locale}/trainers/${trainer.slug}`,
          lastModified: trainer.updatedAt,
          changeFrequency: "daily",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.warn("[sitemap] DB unavailable during build, serving static routes only");
  }

  return sitemapEntries;
}
