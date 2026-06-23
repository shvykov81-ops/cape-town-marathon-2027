"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { updateRoleAction } from "@/app/actions/role-switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, Dumbbell, User, ChevronDown, Loader2 } from "lucide-react";

const roleConfig = {
  admin: { label: "Admin", icon: Shield, color: "text-amber-400" },
  trainer: { label: "Trainer", icon: Dumbbell, color: "text-teal-400" },
  user: { label: "User", icon: User, color: "text-white" },
};

export function RoleSwitcher() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const currentRole = (session?.user?.role as keyof typeof roleConfig) || "user";
  const originalRole = (session?.user as any)?.originalRole || currentRole;

  const availableRoles: string[] = ["user"];
  if (originalRole === "trainer" || originalRole === "admin") {
    availableRoles.push("trainer");
  }
  if (originalRole === "admin") {
    availableRoles.push("admin");
  }

  const handleSwitch = useCallback(async (role: string) => {
    if (role === currentRole) return;
    setIsLoading(true);

    try {
      // Use Server Action to directly update the JWT cookie
      // This bypasses the unstable_update issue completely
      const result = await updateRoleAction(role);

      if (!result.success) {
        console.error("Role switch failed:", result.error);
        alert("Cannot switch role: " + result.error);
        setIsLoading(false);
        return;
      }

      // Build redirect URL with locale
      const locale = pathname.startsWith("/ru") ? "ru" : "en";
      const redirectUrl = `/${locale}${result.redirectUrl}?_t=${Date.now()}`;

      console.log("[RoleSwitcher] Switched to:", role, "→", redirectUrl);

      // Hard reload — middleware will see the new cookie immediately
      window.location.href = redirectUrl;

    } catch (error) {
      console.error("Role switch error:", error);
      alert("Role switch failed. Please try again.");
      setIsLoading(false);
    }
  }, [currentRole, pathname]);

  if (status !== "authenticated" || availableRoles.length <= 1) {
    return null;
  }

  const config = roleConfig[currentRole] || roleConfig.user;
  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 ${config.color} hover:bg-white/5`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
          <span className="capitalize hidden sm:inline">{config.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#171717] border-neutral-700 min-w-[160px]"
      >
        {availableRoles.map((role) => {
          const rc = roleConfig[role as keyof typeof roleConfig];
          const RIcon = rc.icon;
          const isActive = role === currentRole;

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleSwitch(role)}
              disabled={isLoading || isActive}
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 ${
                isActive 
                  ? "bg-neutral-800/50 opacity-60" 
                  : "hover:bg-neutral-800"
              }`}
            >
              <RIcon className={`h-4 w-4 ${rc.color}`} />
              <span className={rc.color}>{rc.label}</span>
              {isActive && (
                <span className="ml-auto text-xs text-neutral-500 font-medium">
                  Active
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
