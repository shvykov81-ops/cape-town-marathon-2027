"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, Music, Utensils, Camera, PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";

const iconMap: Record<string, React.ElementType> = {
  Users,
  MapPin,
  Music,
  Utensils,
  Camera,
  Clock,
  PartyPopper,
};

const scheduleKeys = [
  {
    dayKey: "wednesday",
    events: ["expoOpens", "courseBriefing", "welcomeParty"],
    icons: ["Users", "MapPin", "Music"],
  },
  {
    dayKey: "thursday",
    events: ["shakeOutRun", "nutritionWorkshop", "photoWalk"],
    icons: ["Users", "Utensils", "Camera"],
  },
  {
    dayKey: "friday",
    events: ["expoFinalDay", "elitePressConference", "pastaDinner"],
    icons: ["Users", "Users", "Utensils"],
  },
  {
    dayKey: "saturday",
    events: ["gatesOpen", "raceStart", "awardsCeremony", "afterParty"],
    icons: ["Clock", "Users", "PartyPopper", "Music"],
  },
];

const safariKeys = [
  { key: "tableMountain" },
  { key: "capePoint" },
  { key: "winelands" },
  { key: "bigFive" },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function RaceWeekPage() {
  const t = useTranslations("raceWeek");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="pt-20">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/images/about-hero1.jpg"
            alt={t("hero.badge")}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase bg-teal-950/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              {t("hero.badge")}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-6 drop-shadow-lg">
              {t("hero.title")} <span className="text-teal-400">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("schedule.title")}</h2>
            <p className="text-neutral-400">{t("schedule.subtitle")}</p>
          </FadeIn>

          <div className="space-y-12">
            {scheduleKeys.map((day, i) => (
              <FadeIn key={day.dayKey} delay={i * 0.1}>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t(`schedule.days.${day.dayKey}.day`)}</h3>
                      <p className="text-teal-400 text-sm">{t(`schedule.days.${day.dayKey}.date`)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-7 border-l-2 border-white/10 pl-8">
                    {day.events.map((eventKey, j) => {
                      const Icon = iconMap[day.icons[j]];
                      return (
                        <motion.div
                          key={eventKey}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.08, duration: 0.5 }}
                          className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                              <Icon className="w-5 h-5 text-teal-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <span className="text-teal-400 font-mono text-sm bg-teal-500/10 px-2 py-0.5 rounded">
                                  {t(`schedule.days.${day.dayKey}.events.${eventKey}.time`)}
                                </span>
                                <h4 className="font-semibold">{t(`schedule.days.${day.dayKey}.events.${eventKey}.title`)}</h4>
                              </div>
                              <p className="text-sm text-neutral-400">{t(`schedule.days.${day.dayKey}.events.${eventKey}.desc`)}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">{t("safari.badge")}</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">{t("safari.title")}</h2>
            <p className="text-neutral-400">{t("safari.subtitle")}</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safariKeys.map((safari, i) => (
              <FadeIn key={safari.key} delay={i * 0.1}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] h-full flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{t(`safari.options.${safari.key}.name`)}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-neutral-400">{t(`safari.options.${safari.key}.duration`)}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4 flex-1">{t(`safari.options.${safari.key}.desc`)}</p>
                  <div className="text-2xl font-bold text-teal-400">{t(`safari.options.${safari.key}.price`)}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
