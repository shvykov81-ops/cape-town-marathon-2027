"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Dumbbell,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

const roleConfig = {
  admin: {
    label: "Administrator",
    dashboardLabel: "Admin Panel",
    dashboardHref: "/admin",
    icon: Shield,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  trainer: {
    label: "Coach / Trainer",
    dashboardLabel: "Trainer Dashboard",
    dashboardHref: "/trainer-dashboard",
    icon: Dumbbell,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  user: {
    label: "Runner / Traveler",
    dashboardLabel: "User Dashboard",
    dashboardHref: "/dashboard",
    icon: User,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
};

export function ProfileButton() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  // Not authenticated — show Sign In button
  if (status === "unauthenticated") {
    return (
      <Link href={`/${locale}/account`}>
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-300 hover:text-white hover:bg-white/5"
        >
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  // Loading state
  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled className="opacity-50">
        <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  const user = session?.user;
  if (!user) return null;

  const role = (user.role as "admin" | "trainer" | "user") || "user";
  const config = roleConfig[role];
  const RoleIcon = config.icon;

  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-neutral-300 hover:text-white hover:bg-white/5 px-2"
        >
          <Avatar className="w-7 h-7 border border-white/10">
            <AvatarImage src={user.image || undefined} alt={displayName} />
            <AvatarFallback className="bg-neutral-800 text-neutral-400 text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
            {displayName}
          </span>
          <ChevronDown className="w-3 h-3 text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-neutral-900 border-white/10 p-2"
      >
        {/* User info header */}
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={user.image || undefined} alt={displayName} />
            <AvatarFallback className="bg-neutral-800 text-neutral-400 text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {displayName}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Current role badge */}
        <div className={`mx-2 px-2 py-1 rounded-md ${config.bgColor} mb-2`}>
          <div className="flex items-center gap-2">
            <RoleIcon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/5" />

        {/* Dashboard link — PRIMARY ACTION */}
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}${config.dashboardHref}`}
            className="flex items-center gap-2 px-2 py-2 text-sm text-white hover:bg-white/5 cursor-pointer rounded-md"
          >
            <LayoutDashboard className={`w-4 h-4 ${config.color}`} />
            <span className="font-medium">{config.dashboardLabel}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/5" />

        {/* Account settings */}
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/account`}
            className="flex items-center gap-2 px-2 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer rounded-md"
          >
            <Settings className="w-4 h-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        {/* Sign out */}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer rounded-md"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
