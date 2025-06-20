"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Beams from "@/components/ui/Beams";

const testimonials = [
  {
    quote:
      "Zenith has transformed how we allocate tasks across our engineering teams. The AI-driven assignments have increased our productivity by 70%.",
    author: "Sarah Johnson",
    role: "CTO, TechNova",
    company: "TechNova",
  },
  {
    quote:
      "The blockchain integration gives us complete transparency in our workflow. Our team members appreciate understanding why they're assigned specific tasks.",
    author: "Michael Chen",
    role: "Engineering Manager",
    company: "BlockChain Solutions",
  },
  {
    quote:
      "Integrating with our GitHub repositories was seamless. Zenith's AI accurately matches tasks to our developers based on their past contributions and expertise.",
    author: "Priya Sharma",
    role: "Lead Developer",
    company: "CodeCraft Inc.",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section id="testimonials" className="py-24 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#2563eb"
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
            className="text-3xl md:text-4xl font-bold mb-4 font-['Poppins']"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className=" text-white font-['Kagitingan'] bg-clip-text text-5xl">
              What Our Clients Say
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Organizations are achieving remarkable results with Zenith's
            intelligent work allocation platform.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12 relative"
          >
            <Quote className="absolute top-8 left-8 h-12 w-12 text-cyan-500/20 " />
            <div className="text-center font-['Poppins']">
              <p className="text-xl md:text-2xl text-gray-200 mb-8 relative z-10">
                "{testimonials[currentIndex].quote}"
              </p>
              <div>
                <p className="text-lg font-semibold text-white">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-cyan-400">
                  {testimonials[currentIndex].role},{" "}
                  {testimonials[currentIndex].company}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-gray-700 hover:border-cyan-500 text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-cyan-500" : "bg-gray-700"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-gray-700 hover:border-cyan-500 text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
