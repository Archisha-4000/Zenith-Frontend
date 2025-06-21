// src/app/landing/features/page.tsx

"use client";

import { motion } from "framer-motion";
import { Audiowide } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState } from "react";

import { AnimateOnView } from "@/components/AnimateOnView";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function FeaturesPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  const featuresSectionRef = useIntersectionObserver({ threshold: 0.2 });

  return (
    <>
      {/* Features Section */}
      <AnimateOnView stagger={0.03} delay={0.02}>
        <section
          ref={featuresSectionRef}
          className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:py-16 bg-black"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" />
            <div className="absolute inset-0" />
            <div className="absolute inset-0 opacity-5 mix-blend-overlay" />
          </div>
          <motion.div className="relative z-10 max-w-4xl w-full text-center mb-8 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-gray-200 text-black rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              Why Choose Zenith
            </span>
            <h2 className="text-4xl md:text-5xl font-['Kagitingan'] mb-4 bg-clip-text text-transparent">
              <span className="text-gray-200">Straight</span>{" "}
              <span className="text-rose-800">Talk.</span>
              <br className="hidden md:block" />{" "}
              <span className="text-rose-800">No</span>{" "}
              <span className="text-gray-200">Nonsense.</span>
            </h2>
            <p className="text-lg font-['Poppins'] text-medhive-300 mx-auto max-w-2xl text-white">
              Zenith unites AI-driven workflows with serverless‑secure
              auditability for truly seamless development.
            </p>
          </motion.div>
          <div className="relative z-10 flex-grow font-['Poppins'] flex items-center justify-center w-full max-w-7xl">
            <AnimatedTabs className="px-3" />
          </div>
        </section>
      </AnimateOnView>
    </>
  );
}
