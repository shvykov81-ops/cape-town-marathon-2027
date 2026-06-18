import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { TrainerProfile } from "@/components/trainers/trainer-profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainersPage.metadata" });
  return {
    title: t("title"),
  };
}

export default function TrainerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TrainerProfile params={params} />
    </div>
  );
}
