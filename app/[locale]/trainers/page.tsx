import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { TrainersList } from "@/components/trainers/trainers-list";

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
  const t = await getTranslations({ locale, namespace: "trainersPage" });

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("hero.title")}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
        <TrainersList />
      </div>
    </div>
  );
}
