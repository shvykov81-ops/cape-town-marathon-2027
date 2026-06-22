"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Shield, Dumbbell, ArrowLeftRight } from "lucide-react";

export function RoleSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  if (!session?.user) return null;

  const currentRole = session.user.role;
  const originalRole = (session.user as any).originalRole || currentRole;

  // Determine available roles based on originalRole
  const availableRoles: Array<{ role: string; label: string; icon: React.ElementType; href: string }> = [];

  if (originalRole === "admin") {
    availableRoles.push(
      { role: "admin", label: "Admin Panel", icon: Shield, href: "/admin" },
      { role: "trainer", label: "Trainer Dashboard", icon: Dumbbell, href: "/trainer-dashboard" },
      { role: "user", label: "User Dashboard", icon: User, href: "/dashboard" }
    );
  } else if (originalRole === "trainer") {
    availableRoles.push(
      { role: "trainer", label: "Trainer Dashboard", icon: Dumbbell, href: "/trainer-dashboard" },
      { role: "user", label: "User Dashboard", icon: User, href: "/dashboard" }
    );
  }

  // Filter out current role
  const otherRoles = availableRoles.filter(r => r.role !== currentRole);
  if (otherRoles.length === 0) return null;

  async function handleSwitch(role: string, href: string) {
    setSwitching(true);
    try {
      // 1. Validate role switch on server
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Role switch failed:", data.error);
        return;
      }

      // 2. Update client session via NextAuth update()
      // This triggers JWT callback with trigger: "update"
      await update({ activeRole: role });

      // 3. Force refresh server components and middleware
      router.refresh();

      // 4. Small delay to let session propagate, then navigate
      setTimeout(() => {
        window.location.href = href;  // Full reload ensures middleware sees new role
      }, 100);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-400 hover:text-white hover:bg-white/5"
          disabled={switching}
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          {switching ? "Switching..." : "Switch Role"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-neutral-900 border-white/10">
        {otherRoles.map(({ role, label, icon: Icon, href }) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleSwitch(role, href)}
            className="text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
