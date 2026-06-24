"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  UserCircle,
  CalendarDays,
  Star,
  Eye,
  MessageSquare,
  CalendarCheck,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  TrendingUp,
  Clock,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  DRAFT: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "Черновик" },
  PENDING: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "На проверке" },
  PUBLISHED: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "Опубликован" },
  REJECTED: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "Отклонён" },
  SUSPENDED: { color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", label: "Приостановлен" },
};

export default function TrainerDashboardPage() {
  const t = useTranslations("trainerDashboard");
  const locale = useLocale();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "photos">("overview");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [addingPhoto, setAddingPhoto] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, profileRes] = await Promise.all([
        fetch("/api/trainer/me/stats"),
        fetch("/api/trainer/me"),
      ]);
      const statsData = await statsRes.json();
      const profileData = await profileRes.json();
      setStats(statsData);
      setProfile(profileData);
    } catch {
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/trainer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          headline: profile.headline,
          bio: profile.bio,
          credentials: profile.credentials,
          experienceYears: profile.experienceYears ? parseInt(profile.experienceYears) : null,
          specialties: profile.specialties,
          languages: profile.languages,
          instagramUrl: profile.instagramUrl,
          stravaUrl: profile.stravaUrl,
          tripsterUrl: profile.tripsterUrl,
          websiteUrl: profile.websiteUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setMessage({ type: "success", text: t("profile.saved") });
      fetchData();
    } catch {
      setMessage({ type: "error", text: t("profile.saveError") });
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    setAddingPhoto(true);
    try {
      const res = await fetch("/api/trainer/me/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newPhotoUrl }),
      });
      if (!res.ok) throw new Error("Failed to add photo");
      setNewPhotoUrl("");
      fetchData();
      setMessage({ type: "success", text: "Photo added" });
    } catch {
      setMessage({ type: "error", text: "Failed to add photo" });
    } finally {
      setAddingPhoto(false);
    }
  };

  const deletePhoto = async (url: string) => {
    try {
      const res = await fetch("/api/trainer/me/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchData();
      setMessage({ type: "success", text: "Photo deleted" });
    } catch {
      setMessage({ type: "error", text: "Failed to delete photo" });
    }
  };

  const setMainPhoto = async (url: string) => {
    try {
      const res = await fetch("/api/trainer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!res.ok) throw new Error("Failed to set main photo");
      fetchData();
      setMessage({ type: "success", text: "Main photo updated" });
    } catch {
      setMessage({ type: "error", text: "Failed to update main photo" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00d4aa] animate-spin" />
      </div>
    );
  }

  if (!stats || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60">
        {t("overview.noProfile")}
      </div>
    );
  }

  const status = statusConfig[stats.status as keyof typeof statusConfig] || statusConfig.DRAFT;
  const allPhotos = profile.photoUrl
    ? [profile.photoUrl, ...profile.photos.filter((p: string) => p !== profile.photoUrl)]
    : profile.photos;

  const statCards = [
    { key: "views", value: stats.profileViews || 0, icon: Eye, color: "text-[#4a9eff]", label: locale === "ru" ? "Просмотры" : "Views" },
    { key: "inquiries", value: stats.bookingInquiries || 0, icon: MessageSquare, color: "text-[#ff6b35]", label: locale === "ru" ? "Запросы" : "Inquiries" },
    { key: "rating", value: (stats.rating || 0).toFixed(1), icon: Star, color: "text-yellow-400", label: locale === "ru" ? "Рейтинг" : "Rating" },
    { key: "bookings", value: stats.totalBookings || 0, icon: CalendarCheck, color: "text-[#00d4aa]", label: locale === "ru" ? "Бронирования" : "Bookings" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{t("nav.brand")}</h1>
                <p className="text-sm text-white/40">{t("nav.subtitle")}</p>
              </div>
            </div>
            <div className={cn("px-3 py-1.5 rounded-full text-xs font-semibold", status.bg, status.color, status.border, "border")}>
              {status.label}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: "overview", label: t("nav.overview"), icon: TrendingUp },
              { id: "profile", label: t("nav.profile"), icon: UserCircle },
              { id: "photos", label: t("nav.photos"), icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === tab.id
                    ? "text-[#00d4aa] border-[#00d4aa]"
                    : "text-white/40 border-transparent hover:text-white/60"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mb-6 p-4 rounded-xl flex items-center gap-3",
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              )}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                  >
                    <Icon className={cn("w-6 h-6 mb-3", card.color)} />
                    <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                    <div className="text-sm text-white/40">{card.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Profile Preview */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/[0.06]">
              <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/[0.05] flex-shrink-0">
                  {profile.photoUrl ? (
                    <Image src={profile.photoUrl} alt={profile.displayName} fill className="object-cover" />
                  ) : (
                    <UserCircle className="w-full h-full p-4 text-white/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">{profile.displayName}</h3>
                  <p className="text-white/40 text-sm mb-3">{profile.headline || (locale === "ru" ? "Без заголовка" : "No headline")}</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.slice(0, 3).map((s: string) => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/${locale}/trainers/${profile.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {locale === "ru" ? "Просмотр" : "View"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{t("profile.title")}</h2>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4aa] hover:bg-[#00b894] text-[#0a0a0f] font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t("profile.saveDraft")}
              </button>
            </div>

            <div className="space-y-5">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.displayName")}</label>
                <input
                  type="text"
                  value={profile.displayName || ""}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.headline")}</label>
                <input
                  type="text"
                  value={profile.headline || ""}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  placeholder={locale === "ru" ? "Краткое описание вашей экспертизы..." : "Brief description of your expertise..."}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.bio")}</label>
                <textarea
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors resize-none"
                  placeholder={t("profile.bioPlaceholder")}
                />
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.credentials")}</label>
                <input
                  type="text"
                  value={profile.credentials || ""}
                  onChange={(e) => setProfile({ ...profile, credentials: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  placeholder={locale === "ru" ? "Сертификаты, достижения..." : "Certificates, achievements..."}
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.experienceYears")}</label>
                <input
                  type="number"
                  value={profile.experienceYears || ""}
                  onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.specialties")}</label>
                <input
                  type="text"
                  value={Array.isArray(profile.specialties) ? profile.specialties.join(", ") : profile.specialties || ""}
                  onChange={(e) => setProfile({ ...profile, specialties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  placeholder={t("profile.commaSeparated")}
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">{t("profile.languages")}</label>
                <input
                  type="text"
                  value={Array.isArray(profile.languages) ? profile.languages.join(", ") : profile.languages || ""}
                  onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                  placeholder={t("profile.commaSeparated")}
                />
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-lg font-semibold text-white mb-4">{t("settings.socialLinks")}</h3>
                <div className="space-y-4">
                  {[
                    { key: "instagramUrl", label: "Instagram", placeholder: "https://instagram.com/..." },
                    { key: "stravaUrl", label: "Strava", placeholder: "https://strava.com/..." },
                    { key: "tripsterUrl", label: "Tripster", placeholder: "https://tripster.com/..." },
                    { key: "websiteUrl", label: t("settings.website"), placeholder: "https://..." },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-white/60 mb-2">{field.label}</label>
                      <input
                        type="url"
                        value={profile[field.key] || ""}
                        onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── PHOTOS TAB ─── */}
        {activeTab === "photos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{t("photos.title")}</h2>
              <p className="text-white/40 text-sm">{t("photos.subtitle")}</p>
            </div>

            {/* Add Photo */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/[0.06]">
              <label className="block text-sm font-medium text-white/60 mb-3">
                {locale === "ru" ? "Добавить фото по ссылке" : "Add photo by URL"}
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder={t("photos.placeholder")}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
                />
                <button
                  onClick={addPhoto}
                  disabled={addingPhoto || !newPhotoUrl.trim()}
                  className="px-6 py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00b894] text-[#0a0a0f] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {addingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {locale === "ru" ? "Добавить" : "Add"}
                </button>
              </div>
              <p className="text-white/30 text-xs mt-2">
                {locale === "ru" ? "Максимум 20 фото. Первое фото будет на обложке профиля." : "Max 20 photos. First photo will be the profile cover."}
              </p>
            </div>

            {/* Photo Grid */}
            {allPhotos.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-30" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <p>{t("photos.empty")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {allPhotos.map((url: string, i: number) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-white/[0.05]"
                  >
                    <Image
                      src={url}
                      alt={`Photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {i !== 0 && (
                        <button
                          onClick={() => setMainPhoto(url)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                          title={locale === "ru" ? "Сделать главным" : "Set as main"}
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deletePhoto(url)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Main badge */}
                    {i === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#00d4aa]/20 border border-[#00d4aa]/30 text-[#00d4aa] text-xs font-medium">
                        {locale === "ru" ? "Главное" : "Main"}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}


