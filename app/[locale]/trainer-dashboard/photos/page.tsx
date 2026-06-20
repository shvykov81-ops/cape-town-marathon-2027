"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PhotosPage() {
  const t = useTranslations("trainerDashboard");
  const [photos, setPhotos] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<string>("DRAFT");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/trainer/me").then((r) => r.json()).then((data) => { setPhotos(data.photos || []); setStatus(data.status); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setAdding(true); setMessage(null);
    try {
      const res = await fetch("/api/trainer/me/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: newUrl.trim() }) });
      if (res.ok) { const data = await res.json(); setPhotos(data.photos); setNewUrl(""); setMessage({ type: "success", text: "Photo added" }); }
      else { const err = await res.json(); setMessage({ type: "error", text: err.error || "Failed to add photo" }); }
    } catch { setMessage({ type: "error", text: "Failed to add photo" }); }
    finally { setAdding(false); }
  };

  const handleRemove = async (url: string) => {
    setMessage(null);
    try {
      const res = await fetch("/api/trainer/me/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      if (res.ok) { const data = await res.json(); setPhotos(data.photos); }
      else { const err = await res.json(); setMessage({ type: "error", text: err.error || "Failed to remove photo" }); }
    } catch { setMessage({ type: "error", text: "Failed to remove photo" }); }
  };

  const isReadOnly = status === "PENDING";

  if (loading) return <div className="space-y-4"><div className="h-8 w-40 bg-[#1e1e2e] rounded-lg animate-pulse" /><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-[#111118] rounded-xl border border-[#1e1e2e] animate-pulse" />)}</div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">{t("photos.title")}</h1><p className="text-[#8b8b9a]">{t("photos.subtitle")}</p></div>
      {isReadOnly && <div className="p-4 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 text-sm">{t("photos.readOnly")}</div>}
      {message && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-4 rounded-xl text-sm", message.type === "success" ? "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border border-red-400/20 text-red-400")}>{message.text}</motion.div>}

      {!isReadOnly && (
        <div className="flex gap-3">
          <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder={t("photos.placeholder")}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#111118] border border-[#1e1e2e] text-white text-sm placeholder-[#5a5a6a] focus:outline-none focus:border-[#ff6b35]/50" />
          <button onClick={handleAdd} disabled={adding || !newUrl.trim()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#ff6b35]/90 transition-colors disabled:opacity-50">
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{t("photos.add")}
          </button>
        </div>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-[#111118] border border-[#1e1e2e] border-dashed">
          <ImageIcon className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" /><p className="text-[#8b8b9a]">{t("photos.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {photos.map((url, index) => (
              <motion.div key={url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-[#111118] border border-[#1e1e2e]">
                <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                {!isReadOnly && <button onClick={() => handleRemove(url)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"><X className="w-4 h-4" /></button>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
