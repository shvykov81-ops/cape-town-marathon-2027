"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Calendar,
  GraduationCap,
  FileText,
  Clock,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
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
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      gradient: "from-teal-500 to-emerald-500",
      bgColor: "bg-teal-500/10",
      textColor: "text-teal-400",
    },
    {
      label: "Packages",
      value: stats.totalPackages,
      icon: Package,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      label: "Trainers",
      value: stats.totalTrainers,
      icon: GraduationCap,
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
    {
      label: "Pending Documents",
      value: stats.pendingDocuments,
      icon: FileText,
      gradient: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      gradient: "from-red-500 to-rose-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm hover:border-white/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${item.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-400">{item.label}</div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
