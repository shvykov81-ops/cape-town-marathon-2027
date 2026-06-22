"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleSelector } from "@/components/auth/role-selector";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react";

interface UserRoleInfo {
  role: "user" | "admin" | "trainer";
  hasTrainerProfile: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "role-select">("login");
  const [userRoles, setUserRoles] = useState<UserRoleInfo[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "trainer") router.push("/trainer-dashboard");
      else router.push("/dashboard");
    }
  }, [session, status, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First, check what roles this user has
      const checkRes = await fetch("/api/auth/check-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      if (!checkRes.ok) {
        const data = await checkRes.json();
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      const { roles } = await checkRes.json();

      if (roles.length === 1) {
        // Single role - login directly
        await performSignIn(roles[0].role);
      } else {
        // Multiple roles - show selector
        setUserRoles(roles);
        setStep("role-select");
        setLoading(false);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  }

  async function performSignIn(role: string) {
    setLoading(true);
    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      activeRole: role,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Redirect based on role
    if (role === "admin") router.push("/admin");
    else if (role === "trainer") router.push("/trainer-dashboard");
    else router.push("/dashboard");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Cape Town <span className="text-[#ff6b35]">Marathon</span>
          </h1>
          <p className="text-[#5a5a6a] mt-2">2027 RUN & Travel Platform</p>
        </div>

        <Card className="bg-[#111118] border-[#1e1e2e]">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              {step === "login" ? "Sign In" : "Select Your Role"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#8b8b9a]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a6a]" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="coach@example.com"
                      className="pl-10 bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-[#3a3a4a]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#8b8b9a]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a6a]" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-[#0a0a0f] border-[#1e1e2e] text-white placeholder:text-[#3a3a4a]"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:opacity-90 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setStep("login")}
                  className="flex items-center gap-2 text-[#5a5a6a] hover:text-[#8b8b9a] text-sm mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>

                <RoleSelector
                  availableRoles={userRoles.map(r => ({
                    role: r.role,
                    label: r.role === "admin" ? "Administrator" : r.role === "trainer" ? "Coach / Trainer" : "Runner / Traveler",
                    description: r.role === "admin" 
                      ? "Manage applications, trainers, and platform settings"
                      : r.role === "trainer" 
                        ? "Manage your profile, calendar, and athlete bookings"
                        : "Book camps, view trainers, and plan your trip",
                  }))}
                  onSelectRole={(role) => performSignIn(role)}
                  isLoading={loading}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
