"use client";

import { Nav } from "../components/landing/Nav";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { BentoGrid } from "../components/landing/BentoGrid";
import { MetricsBand } from "../components/landing/MetricsBand";
import { CtaBand } from "../components/landing/CtaBand";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-canvas selection:bg-primary selection:text-on-primary">
      <Nav />
      <HeroSection />
      <MetricsBand />
      <BentoGrid />
      <HowItWorks />
      <CtaBand />
      <Footer />
    </div>
  );
}
