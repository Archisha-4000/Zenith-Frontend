import { AnimatedBackground } from "@/app/landing/animated-background";
import LandingNavbar from "@/app/landing/navbar";
import Hero from "@/app/landing/hero";
import Features from "@/app/landing/features";
import { HowItWorks } from "@/app/landing/how-it-works";
import { TechStack } from "@/app/landing/tech-stack";
import { Testimonials } from "@/app/landing/testimonials";
import { CTA } from "@/app/landing/cta";
import { Footer } from "@/app/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <AnimatedBackground />
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
