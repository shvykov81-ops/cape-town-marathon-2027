"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, Music, Utensils, Camera, PartyPopper } from "lucide-react";

const schedule = [
  {
    day: "Wednesday",
    date: "May 14",
    events: [
      { time: "10:00", title: "Expo Opens", desc: "Collect your race bib, timing chip, and welcome pack", icon: Users },
      { time: "14:00", title: "Course Briefing", desc: "Official race briefing with course director", icon: MapPin },
      { time: "18:00", title: "Welcome Party", desc: "Live music and local cuisine at V&A Waterfront", icon: Music },
    ],
  },
  {
    day: "Thursday",
    date: "May 15",
    events: [
      { time: "07:00", title: "Shake-out Run", desc: "Easy 3km jog with pacers along Sea Point", icon: Users },
      { time: "11:00", title: "Nutrition Workshop", desc: "Race day fueling strategies with sports nutritionist", icon: Utensils },
      { time: "16:00", title: "Photo Walk", desc: "Guided tour of Cape Town's most Instagrammable spots", icon: Camera },
    ],
  },
  {
    day: "Friday",
    date: "May 16",
    events: [
      { time: "10:00", title: "Expo Final Day", desc: "Last chance for race merchandise and gear checks", icon: Users },
      { time: "14:00", title: "Elite Press Conference", desc: "Meet the elite field and race ambassadors", icon: Users },
      { time: "19:00", title: "Pasta Dinner", desc: "Carb-loading dinner for all registered runners", icon: Utensils },
    ],
  },
  {
    day: "Saturday",
    date: "May 17 - RACE DAY",
    events: [
      { time: "04:30", title: "Gates Open", desc: "Arrive early for bag drop and warm-up", icon: Clock },
      { time: "06:00", title: "Race Start", desc: "42.2km of pure beauty begins", icon: Users },
      { time: "12:00", title: "Awards Ceremony", desc: "Celebrate finishers at Green Point Stadium", icon: PartyPopper },
      { time: "14:00", title: "After Party", desc: "Live music, food trucks, and victory celebrations", icon: Music },
    ],
  },
];

const safariOptions = [
  { name: "Table Mountain Safari", duration: "Half Day", price: "$89", desc: "Cable car up Table Mountain with guided hike" },
  { name: "Cape Point Tour", duration: "Full Day", price: "$149", desc: "Visit the Cape of Good Hope and Boulders Beach penguins" },
  { name: "Winelands Experience", duration: "Full Day", price: "$179", desc: "Stellenbosch and Franschhoek wine tasting tour" },
  { name: "Big Five Safari", duration: "2 Days", price: "$599", desc: "Aquila Game Reserve - lion, elephant, buffalo, rhino, leopard" },
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
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="pt-20">
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/images/about-hero1.jpg"
            alt="Cape Town Marathon runners along the coast with Table Mountain"
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
              Race Week
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-6 drop-shadow-lg">
              The Week of <span className="text-teal-400">Champions</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Four days of excitement, preparation, and celebration leading up to race day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Event Schedule</h2>
            <p className="text-neutral-400">Plan your race week experience</p>
          </FadeIn>

          <div className="space-y-12">
            {schedule.map((day, i) => (
              <FadeIn key={day.day} delay={i * 0.1}>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{day.day}</h3>
                      <p className="text-teal-400 text-sm">{day.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-7 border-l-2 border-white/10 pl-8">
                    {day.events.map((event, j) => {
                      const Icon = event.icon;
                      return (
                        <motion.div
                          key={event.title}
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
                                <span className="text-teal-400 font-mono text-sm bg-teal-500/10 px-2 py-0.5 rounded">{event.time}</span>
                                <h4 className="font-semibold">{event.title}</h4>
                              </div>
                              <p className="text-sm text-neutral-400">{event.desc}</p>
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

      {/* Safari Options */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Post-Race</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Extend Your Adventure</h2>
            <p className="text-neutral-400">Celebrate your finish with an unforgettable South African experience</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safariOptions.map((safari, i) => (
              <FadeIn key={safari.name} delay={i * 0.1}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] h-full flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{safari.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-neutral-400">{safari.duration}</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4 flex-1">{safari.desc}</p>
                  <div className="text-2xl font-bold text-teal-400">{safari.price}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
