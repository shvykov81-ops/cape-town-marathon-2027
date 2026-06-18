import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "raceWeek.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RaceWeekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
