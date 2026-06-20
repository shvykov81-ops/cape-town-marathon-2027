import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "RUN & Travel — Cape Town Marathon 2027",
  description: "Africa's first Abbott World Marathon Majors Candidate. Train with world-class coaches, travel with purpose.",
  keywords: ["Cape Town Marathon", "running", "marathon", "South Africa", "training camp", "running coach"],
  authors: [{ name: "RUN & Travel" }],
  openGraph: {
    title: "RUN & Travel — Cape Town Marathon 2027",
    description: "Africa's first Abbott World Marathon Majors Candidate.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ru_RU"],
    url: "https://cape-town-marathon-2027.vercel.app",
    siteName: "RUN & Travel",
  },
  twitter: {
    card: "summary_large_image",
    title: "RUN & Travel — Cape Town Marathon 2027",
    description: "Africa's first Abbott World Marathon Majors Candidate.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
