import { StatsCards } from "@/components/admin/stats-cards";
import { RecentBookings } from "@/components/admin/recent-bookings";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-neutral-400 mt-1">
            Overview of your marathon prep camp platform
          </p>
        </div>
        <div className="text-sm text-neutral-500">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>
      <StatsCards />
      <RecentBookings />
    </div>
  );
}
