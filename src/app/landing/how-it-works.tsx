//@ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Link, Cpu, Share2 } from "lucide-react";
import Beams from "@/components/ui/Beams";

const steps = [
  {
    icon: Link,
    title: "Connect",
    description:
      "Integrate employee data and GitHub repositories to create a comprehensive knowledge base.",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Cpu,
    title: "Analyze",
    description:
      "AI scans project requirements and employee skills to determine optimal task allocation.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Share2,
    title: "Distribute",
    description:
      "Tasks are automatically assigned with transparency and auditability via serverless.",
    color: "from-red-500 to-rose-600",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#E11D48"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
          className="w-full h-full"
        />{" "}
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-['Kagitingan'] text-white bg-clip-text text-5xl">
              How Zenith Works
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto font-['Poppins']"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our streamlined process ensures efficient work distribution with
            complete transparency.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center text-['Poppins']">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex-1 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 h-full relative z-10 hover:border-red-500/50 transition-all duration-300">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 mx-auto`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-['Kagitingan'] mb-4 text-center text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-center font-['Poppins']">{step.description}</p>
              </div>

              {/* Connection line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-red-500 to-red-500 z-0"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
