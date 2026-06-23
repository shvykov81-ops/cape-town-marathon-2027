"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Eye, CheckCircle, XCircle, AlertTriangle, Loader2,
  Filter, ArrowRight, Star, Users, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { TrainerProfileStatus } from "@prisma/client";

interface TrainerListItem {
  id: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  slug: string;
  headline: string | null;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  status: TrainerProfileStatus;
  profileViews: number;
  bookingInquiries: number;
  publishedAt: string | null;
  createdAt: string;
  userId: string | null;
}

type StatusFilter = "ALL" | TrainerProfileStatus;

export function TrainerModerationList() {
  const t = useTranslations("adminModeration");
  const router = useRouter();
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [moderating, setModerating] = useState<string | null>(null);

  const fetchTrainers = useCallback(() => {
    setLoading(true);
    const url = statusFilter === "ALL"
      ? "/api/admin/trainers"
      : `/api/admin/trainers?status=${statusFilter}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // FIX: API returns { trainers: [...], pagination: {...} }
        const trainerList = Array.isArray(data?.trainers) ? data.trainers : [];
        setTrainers(trainerList);
        setLoading(false);
      })
      .catch(() => {
        setTrainers([]);
        setLoading(false);
      });
  }, [statusFilter]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleModerate = async (id: string, action: "APPROVE" | "REJECT" | "SUSPEND") => {
    setModerating(id);
    try {
      const res = await fetch(`/api/admin/trainers/${id}/moderate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: action === "APPROVE" ? "" : "Admin action" }),
      });
      if (res.ok) fetchTrainers();
    } finally {
      setModerating(null);
    }
  };

  const filtered = trainers.filter((t) =>
    `${t.firstName} ${t.lastName} ${t.displayName || ""} ${t.headline || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusCounts = {
    ALL: trainers.length,
    DRAFT: trainers.filter((t) => t.status === "DRAFT").length,
    PENDING: trainers.filter((t) => t.status === "PENDING").length,
    PUBLISHED: trainers.filter((t) => t.status === "PUBLISHED").length,
    REJECTED: trainers.filter((t) => t.status === "REJECTED").length,
    SUSPENDED: trainers.filter((t) => t.status === "SUSPENDED").length,
  };

  const tabs: { key: StatusFilter; label: string; icon: React.ElementType; count: number }[] = [
    { key: "ALL", label: t("list.allTab"), icon: Users, count: statusCounts.ALL },
    { key: "PENDING", label: t("list.pendingTab"), icon: Clock, count: statusCounts.PENDING },
    { key: "PUBLISHED", label: t("list.publishedTab"), icon: CheckCircle, count: statusCounts.PUBLISHED },
    { key: "REJECTED", label: t("list.rejectedTab"), icon: XCircle, count: statusCounts.REJECTED },
    { key: "SUSPENDED", label: t("list.suspendedTab"), icon: AlertTriangle, count: statusCounts.SUSPENDED },
    { key: "DRAFT", label: t("list.draftTab"), icon: Filter, count: statusCounts.DRAFT },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-white/[0.02] rounded-lg animate-pulse" />
        <div className="h-96 bg-white/[0.02] rounded-xl border border-white/[0.06] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "bg-white/[0.02] text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <Badge variant="outline" className={cn(
                "ml-1 text-xs",
                isActive ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-white/[0.03] text-neutral-500 border-white/[0.06]"
              )}>
                {tab.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("list.searchPlaceholder")}
          className="pl-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-neutral-600 focus:border-teal-500/30"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-neutral-500 font-medium">{t("list.colTrainer")}</TableHead>
              <TableHead className="text-neutral-500 font-medium">{t("list.colStatus")}</TableHead>
              <TableHead className="text-neutral-500 font-medium">{t("list.colRating")}</TableHead>
              <TableHead className="text-neutral-500 font-medium">{t("list.colSpecialties")}</TableHead>
              <TableHead className="text-neutral-500 font-medium">{t("list.colStats")}</TableHead>
              <TableHead className="text-neutral-500 font-medium text-right">{t("list.colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.map((trainer) => (
                <motion.tr
                  key={trainer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-white/[0.06] hover:bg-white/[0.02] transition-colors group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.08]">
                        {trainer.photoUrl ? (
                          <Image src={trainer.photoUrl} alt="" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {trainer.displayName || `${trainer.firstName} ${trainer.lastName}`}
                        </p>
                        <p className="text-xs text-neutral-500">{trainer.headline || trainer.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={trainer.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-white">{trainer.rating.toFixed(1)}</span>
                      <span className="text-xs text-neutral-500">({trainer.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {trainer.specialties.slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="bg-teal-500/5 text-teal-400/70 border-teal-500/10 text-[10px]">
                          {s}
                        </Badge>
                      ))}
                      {trainer.specialties.length > 3 && (
                        <span className="text-[10px] text-neutral-600">+{trainer.specialties.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-neutral-500 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {trainer.profileViews} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> {trainer.bookingInquiries} inquiries
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/trainers/${trainer.id}`)}
                        className="text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {trainer.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModerate(trainer.id, "APPROVE")}
                            disabled={moderating === trainer.id}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            {moderating === trainer.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModerate(trainer.id, "REJECT")}
                            disabled={moderating === trainer.id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {trainer.status === "PUBLISHED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerate(trainer.id, "SUSPEND")}
                          disabled={moderating === trainer.id}
                          className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-neutral-500">
                  {search ? t("list.noSearchResults") : t("list.noTrainers")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
