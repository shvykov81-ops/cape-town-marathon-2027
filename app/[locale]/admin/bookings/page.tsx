import { BookingsTable } from "@/components/admin/bookings-table";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-neutral-400 mt-1">All camp bookings and reservations</p>
      </div>
      <BookingsTable />
    </div>
  );
}
