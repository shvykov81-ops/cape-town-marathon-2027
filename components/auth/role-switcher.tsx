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

  // Determine available roles
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

      // 2. Update client session (triggers JWT callback)
      // This ensures middleware sees the new role immediately
      await update({ activeRole: role });

      // 3. Navigate to new dashboard
      router.push(href);
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
          className="text-[#8b8b9a] hover:text-white hover:bg-[#1a1a25]"
          disabled={switching}
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          {switching ? "Switching..." : "Switch Role"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#111118] border-[#1e1e2e]">
        {otherRoles.map(({ role, label, icon: Icon, href }) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleSwitch(role, href)}
            className="text-[#8b8b9a] hover:text-white hover:bg-[#1a1a25] cursor-pointer"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
