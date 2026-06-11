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

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
}

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
  trainer: Trainer | null;
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then(setBookings);
  }, []);

  const statusColor = (s: string) => {
    if (s === "confirmed")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s === "pending")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-neutral-400">ID</TableHead>
            <TableHead className="text-neutral-400">User</TableHead>
            <TableHead className="text-neutral-400">Package</TableHead>
            <TableHead className="text-neutral-400">Trainer</TableHead>
            <TableHead className="text-neutral-400">Dates</TableHead>
            <TableHead className="text-neutral-400">Guests</TableHead>
            <TableHead className="text-neutral-400">Total</TableHead>
            <TableHead className="text-neutral-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow
              key={b.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="font-mono text-xs text-neutral-500">
                {b.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {b.user.name || b.user.email}
                </div>
                {b.user.phone && (
                  <div className="text-xs text-neutral-400">
                    {b.user.phone}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">{b.package.name}</div>
                <div className="text-xs text-neutral-400">
                  {b.package.type}
                </div>
              </TableCell>
              <TableCell>
                {b.trainer ? (
                  <span className="text-teal-400 text-sm">
                    {b.trainer.firstName} {b.trainer.lastName}
                  </span>
                ) : (
                  <span className="text-neutral-500 text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-neutral-400">
                {new Date(b.checkInDate).toLocaleDateString()} →{" "}
                {new Date(b.checkOutDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{b.guestsCount}</TableCell>
              <TableCell className="text-teal-400 font-medium">
                ${parseFloat(b.totalPrice).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColor(b.status)}
                >
                  {b.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
