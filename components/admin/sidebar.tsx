"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/trainers", label: "Trainers", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/documents", label: "Documents", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-white/10 bg-[#0f0f0f] flex flex-col fixed h-full z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">RUN & Travel</h1>
            <p className="text-xs text-neutral-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1 flex-1">
        <div className="px-4 mb-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-teal-600/20 to-emerald-600/10 text-teal-400 border border-teal-600/20 shadow-lg shadow-teal-900/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                isActive ? "bg-teal-600/20" : "bg-white/5 group-hover:bg-white/10"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-red-500/10 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
