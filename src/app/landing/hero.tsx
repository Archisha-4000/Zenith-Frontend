//@ts-nocheck

"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/moving-border";
import Beams from "@/components/ui/Beams";
import RotatingText from "@/components/ui/RotatingText";
import { LayoutGroup } from "framer-motion";
import { Play, Pause } from "lucide-react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Beams Background */}
      <motion.div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={14}
          lightColor="#E11D48"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
          className="w-full h-full"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 z-10" />

      <motion.div
        style={{ y: textY }}
        className="relative z-20 mx-auto flex h-screen max-w-5xl flex-col justify-center px-4 py-8 text-center sm:px-6 md:px-16 lg:px-24"
      >
        <LayoutGroup>
          <motion.h1
            className="font-['Poppins'] text-7xl leading-snug text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div layout className="inline-flex items-baseline space-x-2">
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              >
                You&nbsp;
              </motion.span>
              <motion.span layout>
                <div
                  className="
                  inline-flex items-center justify-center
                  w-[22rem]
                  bg-white   
                  whitespace-nowrap
                  border border-white rounded-lg
                  overflow-hidden
                  px-3 py-3
                  "
                  style={{ color: "#b91c1c" }}
                >
                  <RotatingText
                    texts={["Plan", "Build", "Deploy"]}
                    mainClassName="font-['Poppins'] text-7xl font-bold"
                    style={{ color: "#E11D48" }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>
              </motion.span>
              &nbsp;
            </motion.div>

            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              Under One Roof
            </motion.div>
          </motion.h1>
        </LayoutGroup>

        <div className="mt-8 sm:mt-12 text-lg text-white font-['Poppins']">
          <span>Unified planning, building, testing, and deployment</span>
          <br />
          <span>
            AI‑native, blockchain‑secure, audit‑ready workflow for your teams.
          </span>
        </div>

        <motion.div
          className="absolute bottom-20 inset-x-0 flex justify-center space-x-4 sm:space-x-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Button className="rounded-lg border border-white/10 bg-[#E11D48] px-6 py-3 text-lg font-['Poppins'] backdrop-blur-3xl hover:cursor-pointer">
            Get Started
          </Button>
          <Link href="#features">
            <Button className="rounded-lg border border-white/20 px-6 py-3 text-lg font-['Poppins'] backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:cursor-pointer hover:bg-white hover:text-black">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
