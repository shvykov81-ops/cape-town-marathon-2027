import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { PrepHero } from "./sections/prep-hero";
import { ProgramSection } from "./sections/program-section";
import { CoachesSection } from "./sections/coaches-section";
import { AccommodationSection } from "./sections/accommodation-section";
import { ScheduleSection } from "./sections/schedule-section";
import { PricingSection } from "./sections/pricing-section";
import { PrepCta } from "./sections/prep-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prepCampPage.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrepCampPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <main className="min-h-screen bg-neutral-950">
      <PrepHero />
      <ProgramSection />
      <CoachesSection />
      <AccommodationSection />
      <ScheduleSection />
      <PricingSection />
      <PrepCta />
    </main>
  );
}
