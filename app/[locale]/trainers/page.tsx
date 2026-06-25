import { getTranslations } from "next-intl/server";
import { BentoGridContainer } from "@/components/trainers/bento-grid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainersPage" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default function TrainersPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium border border-teal-500/20 mb-4">
            Elite Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Meet Your Coach
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            World-class running coaches ready to prepare you for Cape Town Marathon 2027
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGridContainer />
      </div>
    </main>
  );
}
