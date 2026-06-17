import { TrainerProfile } from "@/components/trainers/trainer-profile";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Trainer Profile — RUN & Travel`,
  };
}

export default function TrainerPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <TrainerProfile params={params} />
    </div>
  );
}
