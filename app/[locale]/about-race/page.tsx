import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { AboutHero } from "./sections/about-hero";
import { HistoryTimeline } from "./sections/history-timeline";
import { WmmSection } from "./sections/wmm-section";
import { CourseSection } from "./sections/course-section";
import { RecordsSection } from "./sections/records-section";
import { AboutCta } from "./sections/about-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutRace.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutRacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen bg-neutral-950">
      <AboutHero />
      <HistoryTimeline />
      <WmmSection />
      <CourseSection />
      <RecordsSection />
      <AboutCta />
    </main>
  );
}
