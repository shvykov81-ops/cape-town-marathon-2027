import { Suspense } from "react";
import { Preloader } from "@/components/effects/preloader";
import { HeroSection } from "@/components/effects/hero-section-v2";
import { GlassmorphismFeatureCard } from "@/components/effects/glassmorphism-feature-card";
import { TrainersTeaser } from "@/components/effects/trainers-teaser";
import { PrepCampTeaser } from "./prep-camp-teaser";
import { RouteVisualization } from "@/components/effects/route-visualization-v2";
import { NewsletterSection } from "./newsletter-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Preloader />

      {/* Hero: WebGL grain + kinetic text + video scrub */}
      <HeroSection />

      {/* Glassmorphism feature card (replaces StatsSection) */}
      <GlassmorphismFeatureCard />

      {/* Trainers teaser with standard cards */}
      <TrainersTeaser />

      {/* Prep camp teaser */}
      <PrepCampTeaser />

      {/* Animated SVG route visualization */}
      <RouteVisualization />

      {/* Newsletter signup */}
      <NewsletterSection />
    </>
  );
}
