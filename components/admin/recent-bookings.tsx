"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  status: string;
  totalPrice: string;
  createdAt: string;
  user: { name: string | null; email: string };
  package: { name: string };
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.slice(0, 5)));
  }, []);

  const statusColor = (s: string) => {
    if (s === "confirmed")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s === "pending")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div>
                <p className="font-medium">
                  {b.user.name || b.user.email}
                </p>
                <p className="text-sm text-neutral-400">{b.package.name}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={statusColor(b.status)}>
                  {b.status}
                </Badge>
                <p className="text-sm font-medium text-teal-400 mt-1">
                  ${parseFloat(b.totalPrice).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
