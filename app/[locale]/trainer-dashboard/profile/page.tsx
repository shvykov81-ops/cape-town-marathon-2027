"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Save, Send, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainerProfile {
  id: string;
  displayName: string | null;
  headline: string | null;
  bio: string | null;
  credentials: string | null;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  maxClientsPerMonth: number | null;
  videoUrl: string | null;
  photoUrl: string | null;
  status: string;
}

export default function ProfileEditorPage() {
  const t = useTranslations("trainerDashboard");
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/trainer/me")
      .then((r) => r.json())
      .then((data) => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true); setMessage(null);
    try {
      const res = await fetch("/api/trainer/me", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName, headline: profile.headline, bio: profile.bio,
          credentials: profile.credentials, specialties: profile.specialties, languages: profile.languages,
          experienceYears: profile.experienceYears, maxClientsPerMonth: profile.maxClientsPerMonth,
          videoUrl: profile.videoUrl, photoUrl: profile.photoUrl,
        }),
      });
      if (res.ok) setMessage({ type: "success", text: t("profile.saved") });
      else { const err = await res.json(); setMessage({ type: "error", text: err.error || t("profile.saveError") }); }
    } catch { setMessage({ type: "error", text: t("profile.saveError") }); }
    finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (!profile) return;
    setSubmitting(true); setMessage(null);
    try {
      const res = await fetch("/api/trainer/me/submit", { method: "POST" });
      if (res.ok) { setMessage({ type: "success", text: t("profile.submitted") }); setProfile({ ...profile, status: "PENDING" }); }
      else { const err = await res.json(); setMessage({ type: "error", text: err.error || t("profile.submitError") }); }
    } catch { setMessage({ type: "error", text: t("profile.submitError") }); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="space-y-4"><div className="h-8 w-40 bg-[#1e1e2e] rounded-lg animate-pulse" /><div className="h-96 bg-[#111118] rounded-xl border border-[#1e1e2e] animate-pulse" /></div>;
  if (!profile) return <div className="text-center py-12"><AlertCircle className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" /><p className="text-[#8b8b9a]">{t("profile.noProfile")}</p></div>;

  const isReadOnly = profile.status === "PENDING";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">{t("profile.title")}</h1><p className="text-[#8b8b9a]">{t("profile.subtitle")}</p></div>
        {!isReadOnly && (
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a25] text-white text-sm font-medium hover:bg-[#2a2a3e] transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{t("profile.saveDraft")}
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#ff6b35]/90 transition-colors disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{t("profile.submitForReview")}
            </button>
          </div>
        )}
      </div>

      {isReadOnly && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 text-sm">{t("profile.pendingWarning")}</motion.div>}

      {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-4 rounded-xl text-sm", message.type === "success" ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border border-red-400/20 text-red-400")}>{message.text}</motion.div>}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.photoUrl")}</label>
          <input type="url" value={profile.photoUrl || ""} onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })} disabled={isReadOnly}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.displayName")}</label>
          <input type="text" value={profile.displayName || ""} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} disabled={isReadOnly}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.headline")}</label>
          <input type="text" value={profile.headline || ""} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} disabled={isReadOnly}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.bio")}</label>
          <textarea value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} disabled={isReadOnly} rows={6}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50 resize-none" placeholder={t("profile.bioPlaceholder")} />
          <p className="text-xs text-[#5a5a6a] mt-1">{t("profile.bioHint")}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.credentials")}</label>
          <textarea value={profile.credentials || ""} onChange={(e) => setProfile({ ...profile, credentials: e.target.value })} disabled={isReadOnly} rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50 resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.specialties")}</label>
            <input type="text" value={profile.specialties?.join(", ") || ""} onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} disabled={isReadOnly}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" placeholder={t("profile.commaSeparated")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.languages")}</label>
            <input type="text" value={profile.languages?.join(", ") || ""} onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} disabled={isReadOnly}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" placeholder={t("profile.commaSeparated")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.experienceYears")}</label>
            <input type="number" value={profile.experienceYears || ""} onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value ? parseInt(e.target.value) : null })} disabled={isReadOnly}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.maxClients")}</label>
            <input type="number" value={profile.maxClientsPerMonth || ""} onChange={(e) => setProfile({ ...profile, maxClientsPerMonth: e.target.value ? parseInt(e.target.value) : null })} disabled={isReadOnly}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{t("profile.videoUrl")}</label>
          <input type="url" value={profile.videoUrl || ""} onChange={(e) => setProfile({ ...profile, videoUrl: e.target.value })} disabled={isReadOnly}
            className="w-full px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50 disabled:opacity-50" placeholder="https://..." />
        </div>
      </div>
    </div>
  );
}
