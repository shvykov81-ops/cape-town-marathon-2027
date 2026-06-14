"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Calendar, User } from "lucide-react";

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

  const statusConfig = (s: string) => {
    switch (s) {
      case "confirmed":
        return {
          bg: "bg-emerald-500/15",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      case "pending":
        return {
          bg: "bg-amber-500/15",
          text: "text-amber-400",
          border: "border-amber-500/30",
          dot: "bg-amber-400",
        };
      default:
        return {
          bg: "bg-red-500/15",
          text: "text-red-400",
          border: "border-red-500/30",
          dot: "bg-red-400",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
    >
      <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Latest 5 bookings across all packages
          </p>
        </div>
        <button className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
          View all
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {bookings.map((b, index) => {
          const status = statusConfig(b.status);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-teal-400 transition-colors">
                    {b.user.name || b.user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-neutral-400">{b.package.name}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(b.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-white">
                  ${parseFloat(b.totalPrice).toLocaleString()}
                </div>
                <Badge
                  variant="outline"
                  className={`${status.bg} ${status.text} ${status.border} border mt-1`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`} />
                  {b.status}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <div className="p-12 text-center text-neutral-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No bookings yet</p>
        </div>
      )}
    </motion.div>
  );
}
