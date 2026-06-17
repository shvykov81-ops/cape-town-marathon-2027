import { TrainersList } from "@/components/trainers/trainers-list";

export const metadata = {
  title: "Our Trainers — RUN & Travel",
  description: "Meet our certified marathon trainers and guides for Cape Town Marathon 2027",
};

export default function TrainersPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Trainers</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Certified marathon coaches and local guides who will prepare you for 
            Cape Town Marathon 2027 and show you the best of South Africa.
          </p>
        </div>
        <TrainersList />
      </div>
    </div>
  );
}
