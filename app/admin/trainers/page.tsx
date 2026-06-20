import { Suspense } from "react";
import { TrainerModerationList } from "@/components/admin/trainer-moderation/trainer-moderation-list";

export default function AdminTrainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Trainers</h1>
        <p className="text-neutral-400 mt-1">Manage trainer profiles and moderation workflow</p>
      </div>
      <Suspense fallback={<div className="h-96 bg-white/[0.02] rounded-xl border border-white/[0.06] animate-pulse" />}>
        <TrainerModerationList />
      </Suspense>
    </div>
  );
}
