"use client"

import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/20 pointer-events-none"></div>
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-950/50 to-blue-950/50 backdrop-blur-sm border border-cyan-800/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 font-display relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Empower Your Workforce
            </span>
            <br />
            <span className="text-white">with Intelligence and Trust</span>
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join the organizations that are revolutionizing their workflow with Zenith's AI-powered blockchain solution.
          </motion.p>          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg py-3 px-8 rounded-lg transition-all duration-200 font-medium">
              Get Started Now
            </button>
            <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-lg py-3 px-8 rounded-lg transition-all duration-200 font-medium">
              Schedule a Demo
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
