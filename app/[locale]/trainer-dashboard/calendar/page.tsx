"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, addMonths, subMonths,
  startOfWeek, endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilityRecord {
  id: string;
  date: string;
  isAvailable: boolean;
  note: string | null;
}

export default function CalendarPage() {
  const t = useTranslations("trainerDashboard");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, AvailabilityRecord>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("DRAFT");
  const [updating, setUpdating] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trainer/me/availability?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((data: AvailabilityRecord[]) => {
        const map: Record<string, AvailabilityRecord> = {};
        data.forEach((a) => { map[a.date.split("T")[0]] = a; });
        setAvailability(map); setLoading(false);
      }).catch(() => setLoading(false));
    fetch("/api/trainer/me").then((r) => r.json()).then((data) => setStatus(data.status));
  }, [year, month]);

  const toggleDate = async (date: Date) => {
    if (status === "PENDING") return;
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = availability[dateStr];
    const newAvailable = existing ? !existing.isAvailable : true;
    setUpdating(dateStr);
    try {
      const res = await fetch("/api/trainer/me/availability", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, isAvailable: newAvailable }),
      });
      if (res.ok) { const data = await res.json(); setAvailability((prev) => ({ ...prev, [dateStr]: data })); }
    } catch { /* ignore */ } finally { setUpdating(null); }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const isReadOnly = status === "PENDING";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">{t("calendar.title")}</h1><p className="text-[#8b8b9a]">{t("calendar.subtitle")}</p></div>
      {isReadOnly && <div className="p-4 rounded-xl bg-blue-400/10 border border-blue-400/20 text-blue-400 text-sm">{t("calendar.readOnly")}</div>}

      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg bg-[#111118] border border-[#1e1e2e] text-[#8b8b9a] hover:text-white hover:bg-[#1a1a25] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-lg font-semibold text-white">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg bg-[#111118] border border-[#1e1e2e] text-[#8b8b9a] hover:text-white hover:bg-[#1a1a25] transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {loading ? <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#ff6b35] animate-spin" /></div> : (
        <div className="rounded-xl bg-[#111118] border border-[#1e1e2e] p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => <div key={day} className="text-center text-xs font-medium text-[#5a5a6a] py-2">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const record = availability[dateStr];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const isAvailable = record?.isAvailable ?? null;
              return (
                <motion.button key={dateStr} whileHover={!isReadOnly ? { scale: 1.05 } : undefined} whileTap={!isReadOnly ? { scale: 0.95 } : undefined}
                  onClick={() => !isReadOnly && toggleDate(day)} disabled={isReadOnly || updating === dateStr}
                  className={cn("relative aspect-square rounded-lg p-2 text-sm transition-all", !isCurrentMonth && "opacity-30", isToday && "ring-1 ring-[#ff6b35]",
                    isAvailable === true && "bg-emerald-400/10 text-emerald-400", isAvailable === false && "bg-red-400/10 text-red-400",
                    isAvailable === null && "bg-[#0a0a0f] text-[#8b8b9a] hover:bg-[#1a1a25]", updating === dateStr && "opacity-50")}>
                  <span className="font-medium">{format(day, "d")}</span>
                  {isAvailable !== null && <div className={cn("absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full", isAvailable ? "bg-emerald-400" : "bg-red-400")} />}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#1e1e2e]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400" /><span className="text-xs text-[#8b8b9a]">{t("calendar.available")}</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-xs text-[#8b8b9a]">{t("calendar.busy")}</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0a0a0f] border border-[#1e1e2e]" /><span className="text-xs text-[#8b8b9a]">{t("calendar.noData")}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
