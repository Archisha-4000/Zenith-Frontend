"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Beams from "@/components/ui/Beams";
import {
  Eye,
  Zap,
  BarChart2,
  GitMerge,
  Lightbulb,
  Monitor,
  Play,
  Pause,
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  content: React.ReactNode;
  title: React.ReactNode;
  description: string;
  image: string;
}

interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
  className?: string;
}

const features = [
  {
    title: "serverless-backed Audit Trail",
    description:
      "Every task allocation is recorded on the serverless, ensuring complete transparency and accountability",
    icon: <Eye className="h-8 w-8 text-deepRed" />,
    label: "Transparency",
    image: "/feature1.png",
  },
  {
    title: "AI-driven Smart Work Allocation",
    description:
      "Our AI analyzes employee skills and workloads to optimally distribute tasks for maximum efficiency.",
    icon: <Zap className="h-8 w-8 text-deepRed" />,
    label: "Efficiency",
    image: "/feature2.png",
  },
  {
    title: "Employee Skill Graph Analysis",
    description:
      "Visualize and leverage your team's skills with our comprehensive skill mapping system.",
    icon: <BarChart2 className="h-8 w-8 text-deepRed" />,
    label: "Visualization",
    image: "/feature3.png",
  },
  {
    title: "GitHub Issue Syncing",
    description:
      "Automatically import and prioritize GitHub issues for seamless project management.",
    icon: <GitMerge className="h-8 w-8 text-deepRed" />,
    label: "Sync",
    image: "/feature4.png",
  },
  {
    title: "Transparent Decision Making",
    description:
      "Understand why tasks are assigned to specific team members with clear AI reasoning.",
    icon: <Lightbulb className="h-8 w-8 text-deepRed" />,
    label: "Clarity",
    image: "/feature5.png",
  },
  {
    title: "Real-time Work Status Dashboard",
    description:
      "Monitor project progress and team workloads with intuitive, real-time dashboards.",
    icon: <Monitor className="h-7 w-7 text-deepRed" />,
    label: "Monitoring",
    image: "/feature6.png",
  },
].map((feature) => ({
  ...feature,
  title: <span className="font-['Kagitingan'] text-3xl">{feature.title}</span>,
}));

const defaultTabs: Tab[] = features.map((feature, index) => ({
  id: `tab${index + 1}`,
  label: feature.label,
  icon: feature.icon,
  tooltip: feature.label,
  title: feature.title,
  description: feature.description,
  image: feature.image,
  content: (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[320px]">
      <div className="relative w-full h-full md:h-full rounded-2xl overflow-hidden shadow-[0_0_32px_rgba(0,255,255,0.13)] cursor-zoom-in flex items-center justify-center bg-black/40">
        <Image
          src={feature.image}
          alt={
            typeof feature.title === "string" ? feature.title : "Feature Image"
          }
          fill
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-5 text-white">
        <div className="flex items-center gap-3">
          {feature.icon}
          <h3 className="text-2xl font-bold tracking-wide">{feature.title}</h3>
        </div>
        <p className="text-lg text-gray-300 text-center md:text-left">
          {feature.description}
        </p>
      </div>
    </div>
  ),
}));

const AnimatedTabs = ({
  tabs = defaultTabs,
  defaultTab,
  className,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);
  const [autoScroll, setAutoScroll] = useState<boolean>(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll, activeTab, tabs]);

  // Handle image hover events
  const handleImageHover = (image: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredImage(image);
  };

  const handleImageLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredImage(null);
    }, 300);
  };

  const handleModalEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  return (
    <div
      className={cn("w-full max-w-5xl mx-auto flex flex-col gap-1", className)}
    >
      {/* Tab Buttons */}
      <div className="relative flex gap-1 flex-wrap items-center justify-between bg-gradient-to-br from-[#1b1b2f]/80 via-[#0e0e20]/80 to-[#0a0a14]/90 p-3 rounded-xl border border-red-400/20 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.08)] overflow-hidden">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.tooltip}
              className={cn(
                "relative px-4 py-2 flex items-center gap-1 text-sm font-semibold rounded-md transition z-10 hover:text-deepRed text-white",
                activeTab === tab.id ? "text-deepRed" : "text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-red-400/10 border border-red-300/20 backdrop-blur-sm rounded-md shadow-[0_0_20px_#E11D48]"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-0.5">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setAutoScroll((prev) => !prev)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-deepRed transition ml-0 md:ml-auto"
        >
          {autoScroll ? <Pause size={16} /> : <Play size={16} />}
          {autoScroll ? "Stop Auto-Slide" : "Start Auto-Slide"}
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative p-6 rounded-xl bg-gradient-to-br from-[#0e0e1a] via-[#121222] to-[#0c0c18] border border-red-400/20 backdrop-blur-xl overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,255,0.03),transparent_60%)] before:blur-xl before:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_bottom_right,_rgba(0,136,255,0.03),transparent_60%)] after:blur-2xl after:content-[''] min-h-[200px]">
        <motion.div className="absolute inset-0 z-0">
          <Beams
            beamWidth={5}
            beamHeight={15}
            beamNumber={12}
            lightColor="#E11D48"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={0}
          />
        </motion.div>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  x: -15,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, x: -15, filter: "blur(10px)" }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  type: "spring",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div
                    onMouseEnter={() => handleImageHover(tab.image)}
                    onMouseLeave={handleImageLeave}
                    className="relative w-full h-54 md:h-64 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.1)] cursor-zoom-in"
                  >
                    <Image
                      src={tab.image}
                      alt={
                        typeof tab.title === "string"
                          ? tab.title
                          : "Feature Image"
                      }
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 text-white">
                    <div className="flex items-center gap-2">
                      {tab.icon}
                      <h3 className="text-xl font-bold tracking-wide">
                        {tab.title}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-300 text-center md:text-left">
                      {tab.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </div>

      {/* Image Modal Overlay */}
      {hoveredImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onMouseEnter={handleModalEnter}
          onMouseLeave={handleImageLeave}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-full max-w-4xl h-[80vh]"
          >
            <Image
              src={hoveredImage}
              alt="Enlarged preview"
              fill
              className="object-contain"
              quality={100}
            />
          </motion.div>

          {/* Close hint */}
          <div className="absolute bottom-8 text-red-300/80 text-sm animate-pulse">
            Move cursor away to close
          </div>
        </div>
      )}
    </div>
  );
};

export { AnimatedTabs };
