"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SUBJECTS = [
  { value: "GENERAL", label: "General Inquiry" },
  { value: "PREP_CAMP", label: "Prep Camp Booking" },
  { value: "TRAINER", label: "Trainer Inquiry" },
  { value: "PARTNERSHIP", label: "Partnership / Sponsorship" },
  { value: "MEDIA", label: "Media Request" }
];

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "GENERAL",
    message: "",
    website: "" // honeypot
  });
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ 
          type: "success", 
          message: "Thank you! We'll get back to you within 24 hours." 
        });
        setFormData({ name: "", email: "", phone: "", subject: "GENERAL", message: "", website: "" });
        setCharCount(0);
      } else {
        setStatus({ 
          type: "error", 
          message: data.error || "Something went wrong. Please try again." 
        });
      }
    } catch {
      setStatus({ 
        type: "error", 
        message: "Network error. Please check your connection and try again." 
      });
    }
  };

  return (
    <section id="contact-form" className="relative py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(20,184,166,0.05) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 80px rgba(20,184,166,0.1)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
              Send us a Message
            </h2>
            <p className="text-neutral-400 text-center mb-8">
              Fill out the form below and we'll respond as soon as possible
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <input 
                type="text" 
                name="website" 
                value={formData.website}
                onChange={handleChange}
                className="hidden" 
                tabIndex={-1} 
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">
                    Phone <span className="text-neutral-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                    placeholder="+1 555 0199"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors appearance-none cursor-pointer"
                  >
                    {SUBJECTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${charCount > 1800 ? "text-amber-400" : "text-neutral-500"}`}>
                    {charCount}/2000
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status.type === "loading"}
                className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-400 text-black font-semibold px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {status.type === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </button>

              <AnimatePresence mode="wait">
                {status.type === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-teal-400 font-medium">Message sent successfully!</p>
                      <p className="text-neutral-400 text-sm mt-1">{status.message}</p>
                    </div>
                  </motion.div>
                )}

                {status.type === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium">Something went wrong</p>
                      <p className="text-neutral-400 text-sm mt-1">{status.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
