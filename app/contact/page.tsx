import type { Metadata } from "next";
import { ContactHero } from "./sections/contact-hero";
import { TelegramCtaSection } from "./sections/telegram-cta-section";
import { ContactFormSection } from "./sections/contact-form-section";
import { QuickContactCards } from "./sections/quick-contact-cards";
import { FaqSection } from "./sections/faq-section";
import { MapSection } from "./sections/map-section";

export const metadata: Metadata = {
  title: "Contact Us | Cape Town Marathon 2027",
  description: "Get in touch with the Cape Town Marathon 2027 team via Telegram. Book prep camps, connect with trainers, or ask questions about Africa's first Abbott World Marathon Majors candidate event.",
  keywords: ["Cape Town Marathon", "contact", "Telegram", "prep camp", "trainer", "Abbott World Marathon Majors", "South Africa", "running", "support"],
  openGraph: {
    title: "Contact Cape Town Marathon 2027",
    description: "Reach out via Telegram for prep camp bookings, trainer inquiries, and event information.",
    type: "website",
    locale: "en_ZA",
    siteName: "Cape Town Marathon 2027",
    images: [{
      url: "/images/og-contact.jpg",
      width: 1200,
      height: 630,
      alt: "Cape Town Marathon 2027 - Contact Team"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Cape Town Marathon 2027",
    description: "Get in touch with our team via Telegram for prep camp and trainer bookings."
  },
  alternates: {
    canonical: "https://capetownmarathon2027.com/contact"
  },
  robots: {
    index: true,
    follow: true
  }
};

// Schema.org JSON-LD
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Cape Town Marathon 2027",
  "description": "Contact page for Africa's first Abbott World Marathon Majors candidate event",
  "url": "https://capetownmarathon2027.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "Cape Town Marathon 2027",
    "url": "https://capetownmarathon2027.com",
    "sameAs": [
      "https://t.me/capetownmarathon2027"
    ],
    "location": {
      "@type": "Place",
      "name": "Green Point Stadium",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressCountry": "ZA"
      }
    }
  }
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactHero />
      <TelegramCtaSection />
      <QuickContactCards />
      <ContactFormSection />
      <FaqSection />
      <MapSection />
    </>
  );
}
