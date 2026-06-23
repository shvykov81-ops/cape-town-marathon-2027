"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, Dumbbell, User, ChevronDown } from "lucide-react";

const roleConfig = {
  admin: { label: "Admin", icon: Shield, color: "text-amber-400" },
  trainer: { label: "Trainer", icon: Dumbbell, color: "text-teal-400" },
  user: { label: "User", icon: User, color: "text-white" },
};

export function RoleSwitcher() {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const currentRole = session?.user?.role as keyof typeof roleConfig;
  const originalRole = (session?.user as any)?.originalRole;

  // Determine available roles based on originalRole
  const availableRoles: string[] = ["user"];
  if (originalRole === "trainer" || originalRole === "admin") {
    availableRoles.push("trainer");
  }
  if (originalRole === "admin") {
    availableRoles.push("admin");
  }

  const handleSwitch = async (role: string) => {
    if (role === currentRole) return;
    setIsLoading(true);

    try {
      // 1. Validate via API
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        console.error("Role switch validation failed");
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      // 2. Update session (triggers JWT callback)
      await update({ activeRole: role });

      // 3. Build redirect URL WITH locale
      const locale = pathname.startsWith("/ru") ? "ru" : "en";
      const redirectPath = data.redirectUrl || "/";
      const redirectUrl = `/${locale}${redirectPath}`;

      // 4. Full page reload — middleware will see the new cookie
      // Small delay to ensure cookie is written
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 300);
    } catch (error) {
      console.error("Role switch error:", error);
      setIsLoading(false);
    }
  };

  if (!session || availableRoles.length <= 1) return null;

  const config = roleConfig[currentRole] || roleConfig.user;
  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 ${config.color}`}
          disabled={isLoading}
        >
          <Icon className="h-4 w-4" />
          <span className="capitalize">{config.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#171717] border-neutral-700">
        {availableRoles.map((role) => {
          const rc = roleConfig[role as keyof typeof roleConfig];
          const RIcon = rc.icon;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              className={`cursor-pointer ${
                role === currentRole ? "bg-neutral-800" : "hover:bg-neutral-800"
              }`}
            >
              <RIcon className={`h-4 w-4 mr-2 ${rc.color}`} />
              <span className={rc.color}>{rc.label}</span>
              {role === currentRole && (
                <span className="ml-auto text-xs text-neutral-500">Active</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
