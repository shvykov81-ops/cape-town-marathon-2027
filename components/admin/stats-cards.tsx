"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Calendar,
  FileText,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalPackages: number;
  totalTrainers: number;
  pendingDocuments: number;
  pendingBookings: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="bg-white/5 border-white/10 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-teal-400",
    },
    {
      label: "Packages",
      value: stats.totalPackages,
      icon: Package,
      color: "text-purple-400",
    },
    {
      label: "Trainers",
      value: stats.totalTrainers,
      icon: GraduationCap,
      color: "text-orange-400",
    },
    {
      label: "Pending Documents",
      value: stats.pendingDocuments,
      icon: FileText,
      color: "text-yellow-400",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">
                {item.label}
              </CardTitle>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
