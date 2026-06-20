import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { TrainerProfileStatus } from "@prisma/client";

const BASE_URL = "https://cape-town-marathon-2027.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published trainers
  const trainers = await prisma.trainer.findMany({
    where: { status: TrainerProfileStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
  });

  // Static routes for both locales
  const staticRoutes = [
    "", "/trainers", "/about-race", "/booking", "/contact", "/pricing",
    "/prep-camp", "/cape-town-guide", "/race-week", "/blog", "/faq",
    "/terms", "/privacy", "/refund", "/cookies",
  ];

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

  // Add trainer profiles for both locales
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

  return sitemapEntries;
}
