import { MetadataRoute } from "next";

const BASE_URL = "https://cape-town-marathon-2027.vercel.app";

// Static routes for both locales
const staticRoutes = [
  "", "/trainers", "/about-race", "/booking", "/contact", "/pricing",
  "/prep-camp", "/cape-town-guide", "/race-week", "/blog", "/faq",
  "/terms", "/privacy", "/refund", "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes for EN and RU
  for (const locale of ["en", "ru"]) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // NOTE: Trainer profiles are commented out because they require DB access
  // which is blocked by VPN during build. Uncomment after deployment.
  /*
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
  */

  return sitemapEntries;
}
