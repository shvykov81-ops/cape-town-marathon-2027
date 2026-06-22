"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrainerApplicationsList } from "@/components/admin/trainer-applications-list";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Application {
  id: string;
  user: { name: string | null; email: string; image: string | null };
  status: "PENDING" | "APPROVED" | "REJECTED";
  note: string | null;
  createdAt: string;
}

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminApplicationsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session || session.user.role !== "admin") { router.push("/"); return; }
    fetchApplications();
  }, [session, sessionStatus, filter]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const url = new URL("/api/admin/trainer-applications", window.location.origin);
      if (filter !== "ALL") url.searchParams.set("status", filter);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/admin/trainer-applications/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve");
      await fetchApplications();
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to approve"); }
  }

  async function handleReject(id: string, reason: string) {
    try {
      const res = await fetch(`/api/admin/trainer-applications/${id}/reject`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      await fetchApplications();
    } catch (err) { alert(err instanceof Error ? err.message : "Failed to reject"); }
  }

  if (sessionStatus === "loading" || loading) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-red-400 text-center"><p className="text-lg font-medium">Error loading applications</p><p className="text-sm text-[#5a5a6a] mt-2">{error}</p></div></div>;
  }

  const pendingCount = applications.filter(a => a.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trainer <span className="text-[#ff6b35]">Applications</span></h1>
          <p className="text-[#8b8b9a]">Review and manage trainer applications</p>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as StatusFilter[]).map((status) => (
            <button key={status} onClick={() => setFilter(status)}
              className={`p-4 rounded-xl border transition-all text-left ${filter === status ? "bg-[#1a1a25] border-[#ff6b35]/50" : "bg-[#111118] border-[#1e1e2e] hover:border-[#2e2e3e]"}`}>
              <p className="text-[#5a5a6a] text-xs uppercase tracking-wider mb-1">{status === "ALL" ? "All" : status.toLowerCase()}</p>
              <p className="text-2xl font-bold text-white">{status === "ALL" ? applications.length : applications.filter(a => a.status === status).length}</p>
            </button>
          ))}
        </div>
        {pendingCount > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-yellow-400 text-sm"><strong>{pendingCount}</strong> application{pendingCount !== 1 ? "s" : ""} awaiting review</p>
          </div>
        )}
        <TrainerApplicationsList applications={applications} onApprove={handleApprove} onReject={handleReject} />
      </div>
    </div>
  );
}
