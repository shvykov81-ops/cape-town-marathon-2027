"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Registration",
    items: [
      { q: "How do I register for the marathon?", a: "Click the 'Book Now' button on our website and complete the 5-step registration process. You will receive a confirmation email within minutes." },
      { q: "What is the registration deadline?", a: "Early bird registration closes June 30, 2027. Standard registration closes September 15, 2027. Late registration (if available) closes October 1, 2027 with a surcharge." },
      { q: "Can I transfer my entry to someone else?", a: "Yes, entries can be transferred up to 30 days before the event for a $25 transfer fee. Both parties must complete the transfer form in their account dashboard." },
      { q: "What payment methods are accepted?", a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for group bookings of 10+ runners." },
    ],
  },
  {
    category: "Race Day",
    items: [
      { q: "What time does the race start?", a: "The marathon starts at 06:00 SAST. Half marathon at 06:30, 10K at 07:00, and 5K fun run at 08:00." },
      { q: "Where is the start/finish line?", a: "Both start and finish are at Green Point Stadium, Fritz Sonnenberg Road, Cape Town." },
      { q: "What is the course time limit?", a: "The course closes 6 hours after the marathon start (12:00). All runners must maintain approximately 8:30 min/km pace." },
      { q: "Are there pacers?", a: "Yes! We provide pacers for 3:00, 3:15, 3:30, 3:45, 4:00, 4:15, 4:30, 5:00, and 5:30 finish times." },
    ],
  },
  {
    category: "Travel & Accommodation",
    items: [
      { q: "Do I need a visa for South Africa?", a: "Most visitors receive a 90-day visa on arrival. Check with your local South African embassy for specific requirements. US, UK, EU, and most Commonwealth citizens do not need a visa." },
      { q: "What is the best area to stay?", a: "Green Point and Sea Point are ideal - walking distance to the start. V&A Waterfront offers luxury options. Camps Bay is scenic but requires transport." },
      { q: "Is there a shuttle service?", a: "Yes, we provide free shuttle buses from major hotels to the start line on race morning. Book through your account dashboard." },
    ],
  },
  {
    category: "Training & Health",
    items: [
      { q: "What training plan do you recommend?", a: "We offer free beginner, intermediate, and advanced training plans. Download them from the Resources section or join our Prep Camp for personalized coaching." },
      { q: "Do I need a medical certificate?", a: "Yes, all runners must provide a medical certificate dated within 12 months of race day. Upload it to your account dashboard." },
      { q: "What if I get injured before the race?", a: "Contact us immediately. Depending on timing, we may defer your entry to 2028 or provide a partial refund per our refund policy." },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-teal-500/20 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Everything you need to know about the Cape Town Marathon. Can not find your answer? Contact us directly.
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-2xl font-bold mb-6 text-teal-400">{category.category}</h2>
                <div className="space-y-3">
                  {category.items.map((item, i) => {
                    const key = `${category.category}-${i}`;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="font-semibold pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-teal-400 flex-shrink-0 transition-transform ${
                              openItems[key] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openItems[key] && (
                          <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
