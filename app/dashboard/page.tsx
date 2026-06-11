"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    User, Calendar, CheckSquare, Bell,
    ChevronRight, Check, LogOut, Plus, Loader2, Award
} from "lucide-react";
import { DocumentUpload, DocumentList } from "@/components/document-upload";

interface Trainer {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
}

interface Booking {
    id: string;
    createdAt: string;
    status: string;
    totalPrice: number;
    guestsCount: number;
    checkInDate: string | null;
    checkOutDate: string | null;
    package: {
        name: string;
        type: string;
        durationDays: number;
    } | null;
    trainer: Trainer | null;
    payment: {
        status: string;
        amount: number;
    } | null;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [notifications, setNotifications] = useState({
        raceUpdates: true,
        trainingTips: true,
        offers: false,
        reminders: true,
    });

    useEffect(() => {
        if (status === "authenticated") {
            fetchChecklist();
            fetchDocuments();
            fetchBookings();
        }
    }, [status]);

    const fetchChecklist = async () => {
        try {
            const res = await fetch("/api/checklist");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (e) {
            console.error("Failed to load checklist", e);
        }
    };

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/documents");
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (e) {
            console.error("Failed to load documents", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/bookings");
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (e) {
            console.error("Failed to load bookings", e);
        }
    };

    const handleDocumentUpload = (doc: any) => {
        setDocuments((prev) => [doc, ...prev]);
        setShowUpload(false);
    };

    const toggleItem = async (id: string) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const newCompleted = !item.completed;
        setItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, completed: newCompleted } : i
            )
        );

        try {
            await fetch(`/api/checklist/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: newCompleted }),
            });
        } catch {
            setItems((prev) =>
                prev.map((i) =>
                    i.id === id ? { ...i, completed: item.completed } : i
                )
            );
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/account");
        return null;
    }

    const completedCount = items.filter((i) => i.completed).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-400';
            case 'pending': return 'text-yellow-400';
            case 'cancelled': return 'text-red-400';
            default: return 'text-neutral-400';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/10 border-green-500/20';
            case 'pending': return 'bg-yellow-500/10 border-yellow-500/20';
            case 'cancelled': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-white/5 border-white/10';
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                        <p className="text-neutral-400">Manage your race preparation and bookings</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/account" })}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </motion.div>

                {/* Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-lg">Race Preparation</h2>
                            <p className="text-sm text-neutral-400">
                                {items.length > 0
                                    ? `${completedCount} of ${items.length} tasks completed`
                                    : "No tasks yet"}
                            </p>
                        </div>
                        <div className="text-2xl font-bold text-teal-400">{Math.round(progress)}%</div>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                        />
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bookings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-teal-400" />
                                    My Bookings
                                    {bookings.length > 0 && (
                                        <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-xs rounded-full">
                                            {bookings.length}
                                        </span>
                                    )}
                                </h2>
                                <Link
                                    href="/booking"
                                    className="text-sm bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    New Booking
                                </Link>
                            </div>

                            {bookings.length === 0 ? (
                                <div className="text-center py-8 text-neutral-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm mb-2">No bookings yet</p>
                                    <Link
                                        href="/booking"
                                        className="text-sm text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
                                    >
                                        Book your first package <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookings.map((b) => (
                                        <div 
                                            key={b.id} 
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${getStatusBg(b.status)}`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold flex items-center gap-2">
                                                    {b.package?.name || "Package"}
                                                    <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-neutral-400">
                                                        {b.guestsCount} {b.guestsCount === 1 ? 'guest' : 'guests'}
                                                    </span>
                                                </div>
                                                {/* Trainer info */}
                                                {b.trainer && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Award className="w-3 h-3 text-teal-400" />
                                                        <span className="text-xs text-teal-400">
                                                            Trainer: {b.trainer.firstName} {b.trainer.lastName}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-neutral-400 mt-1">
                                                    {new Date(b.createdAt).toLocaleDateString('en-GB', { 
                                                        day: 'numeric', 
                                                        month: 'short', 
                                                        year: 'numeric' 
                                                    })}
                                                    {b.package?.durationDays && (
                                                        <span> &bull; {b.package.durationDays} days</span>
                                                    )}
                                                    {b.checkInDate && b.checkOutDate && (
                                                        <span> &bull; {new Date(b.checkInDate).toLocaleDateString('en-GB')} - {new Date(b.checkOutDate).toLocaleDateString('en-GB')}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <div className="font-semibold text-lg">${Number(b.totalPrice).toLocaleString()}</div>
                                                <span className={`inline-flex items-center gap-1 text-xs capitalize ${getStatusColor(b.status)}`}>
                                                    <Check className="w-3 h-3" /> {b.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Documents */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Documents
                                </h2>
                                <button
                                    onClick={() => setShowUpload(!showUpload)}
                                    className="text-sm bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    {showUpload ? "Close" : "Upload"}
                                </button>
                            </div>

                            {showUpload && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <DocumentUpload onUpload={handleDocumentUpload} />
                                </motion.div>
                            )}

                            <DocumentList documents={documents} />
                        </motion.div>

                        {/* Checklist */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <h2 className="font-bold text-lg flex items-center gap-2 mb-6">
                                <CheckSquare className="w-5 h-5 text-teal-400" />
                                Preparation Checklist
                            </h2>

                            {items.length === 0 ? (
                                <div className="text-center py-8 text-neutral-500">
                                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Loading checklist...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((item: any) => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                item.completed
                                                    ? "bg-teal-500 border-teal-500"
                                                    : "border-neutral-600"
                                            }`}>
                                                {item.completed && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`text-sm ${item.completed ? "text-neutral-500 line-through" : ""}`}>
                                                {item.title}
                                            </span>
                                            <span className="ml-auto text-xs text-neutral-600 capitalize">{item.category}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Profile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center">
                                <User className="w-10 h-10 text-teal-400" />
                            </div>
                            <h3 className="font-bold">{session?.user?.name || "Runner"}</h3>
                            <p className="text-sm text-neutral-400 mb-4">{session?.user?.email || "runner@example.com"}</p>
                            <div className="flex justify-center gap-2">
                                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">Premium</span>
                                <span className="px-3 py-1 bg-white/10 text-neutral-300 text-xs rounded-full">42.2km</span>
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <h2 className="font-bold text-lg flex items-center gap-2 mb-6">
                                <Bell className="w-5 h-5 text-teal-400" />
                                Notifications
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                                        <button
                                            onClick={() => setNotifications((prev: any) => ({ ...prev, [key]: !value }))}
                                            className={`w-11 h-6 rounded-full transition-colors relative ${
                                                value ? "bg-teal-600" : "bg-white/10"
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                value ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                        >
                            <h2 className="font-bold text-lg mb-4">Quick Links</h2>
                            <div className="space-y-2">
                                {[
                                    { label: "Race Day Guide", href: "#" },
                                    { label: "Course Map", href: "#" },
                                    { label: "Training Plans", href: "#" },
                                    { label: "Travel Info", href: "#" },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-sm"
                                    >
                                        {link.label}
                                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
