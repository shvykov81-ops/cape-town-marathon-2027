import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { TrainersContainer } from "@/components/trainers/trainers-container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainersPage.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TrainersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <TrainersContainer locale={locale} />
    </div>
  );
}
