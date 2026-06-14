"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface Booking {
  id: string;
  status: string;
  totalPrice: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  createdAt: string;
  user: { name: string | null; email: string; phone: string | null };
  package: { name: string; type: string };
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then(setBookings);
  }, []);

  const filtered = bookings.filter(b => 
    (b.user.name || b.user.email).toLowerCase().includes(search.toLowerCase()) ||
    b.package.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusConfig = (s: string) => {
    switch (s) {
      case "confirmed":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-neutral-400 hover:text-white transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-neutral-500 font-medium">ID</TableHead>
              <TableHead className="text-neutral-500 font-medium">User</TableHead>
              <TableHead className="text-neutral-500 font-medium">Package</TableHead>
              <TableHead className="text-neutral-500 font-medium">Dates</TableHead>
              <TableHead className="text-neutral-500 font-medium">Guests</TableHead>
              <TableHead className="text-neutral-500 font-medium">
                <span className="flex items-center gap-1">
                  Total
                  <ArrowUpDown className="w-3 h-3" />
                </span>
              </TableHead>
              <TableHead className="text-neutral-500 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow
                key={b.id}
                className="border-white/[0.06] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="font-mono text-xs text-neutral-600">
                  {b.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">
                    {b.user.name || b.user.email}
                  </div>
                  {b.user.phone && (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {b.user.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-white">{b.package.name}</div>
                  <div className="text-xs text-neutral-500">{b.package.type}</div>
                </TableCell>
                <TableCell className="text-sm text-neutral-400">
                  {new Date(b.checkInDate).toLocaleDateString()} →{" "}
                  {new Date(b.checkOutDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-white">{b.guestsCount}</TableCell>
                <TableCell className="text-teal-400 font-semibold">
                  ${parseFloat(b.totalPrice).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusConfig(b.status)} border`}
                  >
                    {b.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
