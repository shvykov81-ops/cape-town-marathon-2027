import { Metadata } from "next";
import { TrainersContainer } from "@/components/trainers/trainers-container";

export const metadata: Metadata = {
  title: "Elite Running Coaches | Cape Town Marathon 2027",
  description: "Train with world-class marathon coaches for the Cape Town Marathon 2027. Find your perfect coach.",
};

export default async function TrainersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <TrainersContainer locale={locale} />
    </main>
  );
}