import { StatsCards } from "@/components/admin/stats-cards";
import { RecentBookings } from "@/components/admin/recent-bookings";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Overview of your marathon prep camp platform
        </p>
      </div>
      <StatsCards />
      <RecentBookings />
    </div>
  );
}
