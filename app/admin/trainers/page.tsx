import { TrainerManager } from "@/components/admin/trainers-manager";

export default function AdminTrainersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trainers</h1>
        <p className="text-neutral-400 mt-1">Manage camp trainers and coaches</p>
      </div>
      <TrainerManager />
    </div>
  );
}
