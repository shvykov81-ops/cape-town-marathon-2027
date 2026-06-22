"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Dumbbell, LogIn } from "lucide-react";

interface RoleSelectorProps {
  availableRoles: Array<{
    role: "user" | "admin" | "trainer";
    label: string;
    description: string;
  }>;
  onSelectRole: (role: string) => void;
  isLoading?: boolean;
}

const roleConfig = {
  user: { icon: User, color: "bg-blue-500/20 text-blue-400 border-blue-500/30", hover: "hover:bg-blue-500/30" },
  admin: { icon: Shield, color: "bg-purple-500/20 text-purple-400 border-purple-500/30", hover: "hover:bg-purple-500/30" },
  trainer: { icon: Dumbbell, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", hover: "hover:bg-emerald-500/30" },
};

export function RoleSelector({ availableRoles, onSelectRole, isLoading }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-[#8b8b9a] text-sm text-center">
        Your account has multiple roles. Select how you want to continue:
      </p>

      <div className="grid gap-3">
        {availableRoles.map(({ role, label, description }) => {
          const config = roleConfig[role];
          const Icon = config.icon;
          const isSelected = selectedRole === role;

          return (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                isSelected 
                  ? `${config.color} border-current` 
                  : "bg-[#111118] border-[#1e1e2e] hover:border-[#2e2e3e]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${config.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{label}</h3>
                    <Badge variant="outline" className={`text-xs ${config.color}`}>
                      {role}
                    </Badge>
                  </div>
                  <p className="text-[#5a5a6a] text-sm mt-1">{description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:opacity-90 text-white font-semibold py-6"
        onClick={() => selectedRole && onSelectRole(selectedRole)}
        disabled={!selectedRole || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Continue as {selectedRole || "..."}
          </span>
        )}
      </Button>
    </div>
  );
}
