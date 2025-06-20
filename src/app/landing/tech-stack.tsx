"use client"

import { motion } from "framer-motion"

const technologies = [
  { name: "Ethereum", logo: "ETH" },
  { name: "IPFS", logo: "IPFS" },
  { name: "OpenAI", logo: "AI" },
  { name: "TensorFlow", logo: "TF" },
  { name: "GitHub", logo: "GH" },
  { name: "Solidity", logo: "SOL" },
]

export function TechStack() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Powered by Cutting-Edge Technology
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We combine the best of blockchain and AI technologies to deliver a secure, transparent, and intelligent
            platform.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center hover:border-cyan-500/50 transition-all duration-300 w-32 h-32"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-cyan-400">{tech.logo}</span>
              </div>
              <span className="text-white font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
