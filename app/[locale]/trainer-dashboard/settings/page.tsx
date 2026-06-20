"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Save, Loader2, AlertCircle, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinks {
  stravaUrl: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  tripsterUrl: string | null;
}

export default function SettingsPage() {
  const t = useTranslations("trainerDashboard");
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/trainer/me").then((r) => r.json()).then((data) => {
      setLinks({ stravaUrl: data.stravaUrl || null, websiteUrl: data.websiteUrl || null, instagramUrl: data.instagramUrl || null, tripsterUrl: data.tripsterUrl || null });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!links) return;
    setSaving(true); setMessage(null);
    try {
      const res = await fetch("/api/trainer/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stravaUrl: links.stravaUrl, websiteUrl: links.websiteUrl, instagramUrl: links.instagramUrl, tripsterUrl: links.tripsterUrl }) });
      if (res.ok) setMessage({ type: "success", text: t("settings.saved") });
      else { const err = await res.json(); setMessage({ type: "error", text: err.error || t("settings.saveError") }); }
    } catch { setMessage({ type: "error", text: t("settings.saveError") }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="space-y-4"><div className="h-8 w-40 bg-[#1e1e2e] rounded-lg animate-pulse" /><div className="h-64 bg-[#111118] rounded-xl border border-[#1e1e2e] animate-pulse" /></div>;
  if (!links) return <div className="text-center py-12"><AlertCircle className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" /><p className="text-[#8b8b9a]">{t("profile.noProfile")}</p></div>;

  const fields = [
    { key: "strava", label: t("settings.strava"), value: links.stravaUrl, setter: (v: string) => setLinks({ ...links, stravaUrl: v }) },
    { key: "website", label: t("settings.website"), value: links.websiteUrl, setter: (v: string) => setLinks({ ...links, websiteUrl: v }) },
    { key: "instagram", label: t("settings.instagram"), value: links.instagramUrl, setter: (v: string) => setLinks({ ...links, instagramUrl: v }) },
    { key: "tripster", label: t("settings.tripster"), value: links.tripsterUrl, setter: (v: string) => setLinks({ ...links, tripsterUrl: v }) },
  ] as const;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">{t("settings.title")}</h1><p className="text-[#8b8b9a]">{t("settings.subtitle")}</p></div>
      {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-4 rounded-xl text-sm", message.type === "success" ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border border-red-400/20 text-red-400")}>{message.text}</motion.div>}
      <div className="rounded-xl bg-[#111118] border border-[#1e1e2e] p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4"><Link2 className="w-4 h-4 text-[#ff6b35]" /><h2 className="text-sm font-semibold text-white uppercase tracking-wider">{t("settings.socialLinks")}</h2></div>
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-[#8b8b9a] mb-2">{field.label}</label>
            <input type="url" value={field.value || ""} onChange={(e) => field.setter(e.target.value)} placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50" />
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#ff6b35]/90 transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{t("settings.save")}
        </button>
      </div>
    </div>
  );
}
