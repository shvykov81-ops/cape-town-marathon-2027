import { PackageManager } from "@/components/admin/packages-manager";

export default function AdminPackagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Packages</h1>
        <p className="text-neutral-400 mt-1">Manage prep camp packages</p>
      </div>
      <PackageManager />
    </div>
  );
}
