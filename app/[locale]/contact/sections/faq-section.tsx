"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { KineticSectionTitle } from "@/components/effects/kinetic-section-title";

const FAQS = [
  {
    question: "How do I book a prep camp spot?",
    answer: "Navigate to our Prep Camp page, select your preferred dates, and complete the booking form. You'll receive a confirmation email within minutes. Our prep camps include accommodation, training sessions, and airport transfers."
  },
  {
    question: "Can I choose a specific trainer?",
    answer: "Yes! Visit our Trainers page, browse profiles with ratings and specialties, and click 'Book with [Name]' to secure your preferred coach. All our trainers are certified and experienced with marathon preparation."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, MasterCard, AmEx), PayPal, and bank transfers. Our Stripe-secured checkout ensures your payment data is fully encrypted and safe."
  },
  {
    question: "Is there a refund policy?",
    answer: "Full refund available up to 30 days before the event. 50% refund up to 14 days before. No refunds within 14 days of the marathon. Contact us for special circumstances — we're runners too, we understand."
  },
  {
    question: "How do I become a trainer?",
    answer: "Fill out the contact form above with subject 'Trainer' and include your certifications, experience, and specialties. Our team reviews applications within 48 hours. We're always looking for passionate coaches!"
  }
];

function FaqItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-neutral-800 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? "text-teal-400" : "text-white group-hover:text-teal-400"}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Quick Answers
          </div>
          <KineticSectionTitle title="COMMON QUESTIONS" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900/50 rounded-2xl p-6 md:p-8 border border-neutral-800"
        >
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
