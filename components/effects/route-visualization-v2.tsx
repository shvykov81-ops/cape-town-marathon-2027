"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Mountain, Waves, Flag } from "lucide-react";
import { useTranslations } from "next-intl";

interface CheckpointData {
    km: number;
    label: string;
    description: string;
    icon: React.ReactNode;
    x: number;
    y: number;
}

const ROUTE_PATH =
    "M 50 400 Q 150 350 200 280 T 350 200 T 500 180 T 650 220 T 800 280 T 950 400";

function CheckpointMarker({
    checkpoint,
    index,
}: {
    checkpoint: CheckpointData;
    index: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            className="absolute"
            style={{
                left: `${checkpoint.x}%`,
                top: `${checkpoint.y}%`,
                transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + index * 0.2, type: "spring", stiffness: 200 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-teal-400/50"
                animate={
                    isHovered
                        ? { scale: [1, 2], opacity: [0.5, 0] }
                        : { scale: 1, opacity: 0 }
                }
                transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="relative w-10 h-10 rounded-full bg-neutral-900 border-2 border-teal-400 flex items-center justify-center cursor-pointer shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow">
                <span className="text-teal-400">{checkpoint.icon}</span>
            </div>
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl p-3 shadow-xl">
                    <div className="text-amber-400 text-xs font-bold mb-1">
                        KM {checkpoint.km}
                    </div>
                    <div className="text-white text-sm font-semibold">
                        {checkpoint.label}
                    </div>
                    <div className="text-neutral-400 text-xs mt-1">
                        {checkpoint.description}
                    </div>
                </div>
                <div className="w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
            </motion.div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-neutral-500 font-mono">
                {checkpoint.km}km
            </div>
        </motion.div>
    );
}

export function RouteVisualization() {
    const t = useTranslations("route");

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
    const pathOpacity = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0]
    );
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const checkpoints: CheckpointData[] = [
        {
            km: 0,
            label: t("checkpoints.start.label"),
            description: t("checkpoints.start.desc"),
            icon: <Flag className="w-4 h-4" />,
            x: 5,
            y: 85,
        },
        {
            km: 10,
            label: t("checkpoints.seaPoint.label"),
            description: t("checkpoints.seaPoint.desc"),
            icon: <Waves className="w-4 h-4" />,
            x: 25,
            y: 60,
        },
        {
            km: 21,
            label: t("checkpoints.halfway.label"),
            description: t("checkpoints.halfway.desc"),
            icon: <Waves className="w-4 h-4" />,
            x: 50,
            y: 40,
        },
        {
            km: 32,
            label: t("checkpoints.newlands.label"),
            description: t("checkpoints.newlands.desc"),
            icon: <Mountain className="w-4 h-4" />,
            x: 75,
            y: 55,
        },
        {
            km: 42.2,
            label: t("checkpoints.finish.label"),
            description: t("checkpoints.finish.desc"),
            icon: <Flag className="w-4 h-4" />,
            x: 95,
            y: 85,
        },
    ];

    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden">
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
                <svg
                    className="absolute bottom-0 w-full h-64 opacity-10"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#14b8a6"
                        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    />
                </svg>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-teal-400 text-sm tracking-[0.3em] uppercase font-medium">
                        {t("badge")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
                        {t("title")}{" "}
                        <span className="text-amber-400">{t("titleHighlight")}</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        {t("description")}
                    </p>
                </motion.div>

                <div className="relative h-[500px] md:h-[600px]">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 1000 500"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <motion.path
                            d={ROUTE_PATH}
                            fill="none"
                            stroke="#14b8a6"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            style={{ pathLength, opacity: pathOpacity }}
                        />
                        <motion.path
                            d={ROUTE_PATH}
                            fill="none"
                            stroke="url(#routeGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ pathLength, opacity: pathOpacity }}
                        />
                        <motion.path
                            d={ROUTE_PATH}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="10 20"
                            style={{ pathLength, opacity: pathOpacity }}
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="0"
                                to="-30"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </motion.path>
                        <defs>
                            <linearGradient
                                id="routeGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="#14b8a6" />
                                <stop offset="50%" stopColor="#2dd4bf" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                            <filter
                                id="glow"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                            >
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>

                    {checkpoints.map((cp, i) => (
                        <CheckpointMarker key={cp.km} checkpoint={cp} index={i} />
                    ))}

                    <motion.div
                        className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-64 bg-neutral-900/80 backdrop-blur-md rounded-xl p-4 border border-neutral-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            {t("elevation")}
                        </div>
                        <svg viewBox="0 0 200 60" className="w-full">
                            <path
                                d="M0,50 Q20,45 40,40 T80,35 T120,30 T160,25 T200,20"
                                fill="none"
                                stroke="#14b8a6"
                                strokeWidth="2"
                            />
                            <path
                                d="M0,50 Q20,45 40,40 T80,35 T120,30 T160,25 T200,20 L200,60 L0,60 Z"
                                fill="url(#elevationGradient)"
                                opacity="0.3"
                            />
                            <defs>
                                <linearGradient
                                    id="elevationGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
                            <span>0m</span>
                            <span>50m</span>
                            <span>100m</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}