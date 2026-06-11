"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, FileText, Download, ChevronDown, Check, AlertCircle } from "lucide-react";

const faqs = [
    { q: "How do I register for the marathon?", a: "Click the 'Book Now' button and follow the 5-step registration process. You'll receive a confirmation email within minutes." },
    { q: "What is the refund policy?", a: "Full refund available up to 60 days before the event. 50% refund up to 30 days. No refunds within 30 days, but you can transfer your entry to another runner." },
    { q: "Can I change my race category?", a: "Yes, you can change your category up to 14 days before the event through your account dashboard at no extra cost." },
    { q: "Is there a time limit to finish?", a: "The course closes 6 hours after the start. All runners must maintain a pace of approximately 8:30 min/km or faster." },
    { q: "What COVID-19 measures are in place?", a: "We follow all local health guidelines. Current protocols include hand sanitizing stations, optional mask zones, and enhanced medical support." },
];

const documents = [
    { name: "Race Day Guide 2027", size: "2.4 MB", type: "PDF" },
    { name: "Course Map & Elevation", size: "1.8 MB", type: "PDF" },
    { name: "Travel & Visa Information", size: "890 KB", type: "PDF" },
    { name: "Training Plan - Beginner", size: "1.2 MB", type: "PDF" },
    { name: "Training Plan - Intermediate", size: "1.3 MB", type: "PDF" },
    { name: "Training Plan - Advanced", size: "1.5 MB", type: "PDF" },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage("Message sent! We'll get back to you soon.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                throw new Error(data.error || "Something went wrong");
            }
        } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Failed to send message");
        }
    }

    return (
        <div className="pt-20">
            {/* Hero */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Contact</span>
                        <h1 className="text-5xl font-bold mt-4 mb-6">Get in Touch</h1>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Have questions? We are here to help you every step of the way.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={status === "loading"}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={status === "loading"}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        disabled={status === "loading"}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="registration">Registration Help</option>
                                        <option value="payment">Payment Issues</option>
                                        <option value="travel">Travel & Accommodation</option>
                                        <option value="training">Training Questions</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        disabled={status === "loading"}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors resize-none disabled:opacity-50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-semibold rounded-full transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:hover:scale-100"
                                >
                                    {status === "loading" ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : status === "success" ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>

                            {status === "success" && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-teal-400 mt-4 flex items-center gap-1"
                                >
                                    <Check className="w-4 h-4" />
                                    {message}
                                </motion.p>
                            )}

                            {status === "error" && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-400 mt-4 flex items-center gap-1"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email Us</h3>
                                        <p className="text-sm text-neutral-400">info@capetownmarathon.com</p>
                                        <p className="text-sm text-neutral-400">support@capetownmarathon.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Call Us</h3>
                                        <p className="text-sm text-neutral-400">+27 21 555 0123</p>
                                        <p className="text-sm text-neutral-400">+27 21 555 0124</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Office</h3>
                                        <p className="text-sm text-neutral-400">Cape Town Stadium</p>
                                        <p className="text-sm text-neutral-400">Fritz Sonnenberg Road</p>
                                        <p className="text-sm text-neutral-400">Green Point, Cape Town 8001</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Office Hours</h3>
                                        <p className="text-sm text-neutral-400">Mon - Fri: 08:00 - 17:00 SAST</p>
                                        <p className="text-sm text-neutral-400">Sat: 09:00 - 13:00 SAST</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/27215550123"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-green-600/20 border border-green-500/30 rounded-2xl hover:bg-green-600/30 transition-colors"
                            >
                                <MessageCircle className="w-6 h-6 text-green-400" />
                                <div>
                                    <div className="font-semibold text-green-400">Chat on WhatsApp</div>
                                    <div className="text-sm text-green-300/70">Usually replies within minutes</div>
                                </div>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-neutral-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-neutral-400">Quick answers to common questions</p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold pr-4">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-teal-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documents */}
            <section className="py-24 bg-neutral-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Documents & Resources</h2>
                        <p className="text-neutral-400">Download essential race information</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {documents.map((doc, i) => (
                            <motion.div
                                key={doc.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-teal-500/30 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{doc.name}</div>
                                    <div className="text-xs text-neutral-500">{doc.type} • {doc.size}</div>
                                </div>
                                <Download className="w-5 h-5 text-neutral-500 group-hover:text-teal-400 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}