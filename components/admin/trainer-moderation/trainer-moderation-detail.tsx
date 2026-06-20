"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Star, Eye, Globe, Instagram, ExternalLink, MapPin, Calendar, Users,
  ArrowLeft, Trash2, Loader2, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ModerationPanel } from "./moderation-panel";
import { HistoryTimeline } from "./history-timeline";
import { DiffViewer } from "./diff-viewer";
import { TrainerProfileStatus } from "@prisma/client";

interface TrainerDetailProps {
  trainer: {
    id: string;
    displayName: string | null;
    firstName: string;
    lastName: string;
    slug: string;
    headline: string | null;
    bio: string | null;
    bioHtml: string | null;
    credentials: string | null;
    photoUrl: string | null;
    photos: string[];
    videoUrl: string | null;
    videoThumbnail: string | null;
    stravaUrl: string | null;
    websiteUrl: string | null;
    instagramUrl: string | null;
    tripsterUrl: string | null;
    specialties: string[];
    languages: string[];
    experienceYears: number | null;
    maxClientsPerMonth: number | null;
    rating: number;
    reviewCount: number;
    status: TrainerProfileStatus;
    moderationNote: string | null;
    moderatedBy: string | null;
    moderatedAt: string | null;
    profileViews: number;
    bookingInquiries: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    user: { id: string; email: string | null; name: string | null } | null;
    changeHistory: Array<{
      id: string;
      changeType: string;
      fieldName: string | null;
      oldValue: string | null;
      newValue: string | null;
      changedBy: string;
      createdAt: string;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      text: string | null;
      createdAt: string;
      user: { name: string | null };
    }>;
  };
}

export function TrainerModerationDetail({ trainer }: TrainerDetailProps) {
  const t = useTranslations("adminModeration");
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(trainer.status);
  const [deleting, setDeleting] = useState(false);

  const handleModerate = useCallback(async (action: "APPROVE" | "REJECT" | "SUSPEND", reason: string) => {
    const res = await fetch(`/api/admin/trainers/${trainer.id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    setCurrentStatus(data.status);
    router.refresh();
  }, [trainer.id, router]);

  const handleDelete = async () => {
    if (!confirm(t("action.deleteConfirm"))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/trainers/${trainer.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/trainers");
    } finally {
      setDeleting(false);
    }
  };

  // Build diff from latest history entry
  const latestChange = trainer.changeHistory[0];
  const diffs = latestChange && latestChange.fieldName
    ? [{ field: latestChange.fieldName, oldValue: latestChange.oldValue, newValue: latestChange.newValue }]
    : [];

  const fullName = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-teal-900/20 to-emerald-900/10">
          {trainer.videoThumbnail && (
            <Image src={trainer.videoThumbnail} alt="" fill className="object-cover opacity-30" unoptimized />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/[0.08] bg-[#0a0a0a] shrink-0">
              {trainer.photoUrl ? (
                <Image src={trainer.photoUrl} alt={fullName} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <Users className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-white truncate">{fullName}</h2>
                <StatusBadge status={currentStatus} />
              </div>
              <p className="text-sm text-neutral-400 truncate">{trainer.headline || trainer.slug}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {trainer.rating.toFixed(1)} ({trainer.reviewCount})</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {trainer.profileViews} views</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(trainer.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/${trainer.slug}`)}
                className="border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/5"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Public View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">{t("detail.about")}</h3>
            <div className="space-y-3 text-sm">
              {trainer.bio && (
                <div className="text-neutral-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: trainer.bioHtml || trainer.bio }} />
              )}
              {trainer.credentials && (
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs text-neutral-500 mb-1">{t("detail.credentials")}</p>
                  <p className="text-neutral-300">{trainer.credentials}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">{t("detail.details")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-neutral-500">{t("detail.experience")}</span>
                <span className="text-white">{trainer.experienceYears ? `${trainer.experienceYears} years` : "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-neutral-500">{t("detail.maxClients")}</span>
                <span className="text-white">{trainer.maxClientsPerMonth || "—"}/month</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-neutral-500">{t("detail.languages")}</span>
                <span className="text-white">{trainer.languages.join(", ") || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-neutral-500">{t("detail.specialties")}</span>
                <span className="text-white">{trainer.specialties.join(", ") || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-neutral-500">{t("detail.bookingInquiries")}</span>
                <span className="text-white">{trainer.bookingInquiries}</span>
              </div>
              {trainer.user && (
                <div className="flex justify-between py-2 border-b border-white/[0.04]">
                  <span className="text-neutral-500">{t("detail.owner")}</span>
                  <span className="text-white">{trainer.user.name || trainer.user.email || "—"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">{t("detail.links")}</h3>
            <div className="space-y-2">
              {trainer.websiteUrl && (
                <a href={trainer.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors">
                  <Globe className="w-4 h-4" /> {t("detail.website")}
                </a>
              )}
              {trainer.instagramUrl && (
                <a href={trainer.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              )}
              {trainer.stravaUrl && (
                <a href={trainer.stravaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Strava
                </a>
              )}
              {trainer.tripsterUrl && (
                <a href={trainer.tripsterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Tripster
                </a>
              )}
            </div>

            {trainer.moderationNote && (
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-xs text-red-400/70 mb-1">{t("detail.moderationNote")}</p>
                <p className="text-sm text-red-300/80">{trainer.moderationNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Moderation / History / Reviews */}
      <Tabs defaultValue="moderation" className="space-y-4">
        <TabsList className="bg-white/[0.02] border border-white/[0.06]">
          <TabsTrigger value="moderation" className="data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-400">{t("tabs.moderation")}</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-400">{t("tabs.history")} ({trainer.changeHistory.length})</TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-400">{t("tabs.reviews")} ({trainer.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <ModerationPanel
              trainerId={trainer.id}
              currentStatus={currentStatus}
              onModerate={handleModerate}
            />
            {diffs.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <DiffViewer changes={diffs} title="Latest Changes" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <HistoryTimeline changes={trainer.changeHistory} />
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
            {trainer.reviews.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">{t("reviews.noReviews")}</p>
            ) : (
              trainer.reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-700")} />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">{review.user.name || "Anonymous"}</span>
                    <span className="text-xs text-neutral-600">·</span>
                    <span className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>
                  <p className="text-sm text-neutral-300">{review.text || "No comment"}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
