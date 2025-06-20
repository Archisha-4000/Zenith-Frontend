"use client"

import { motion } from "framer-motion"
import { Shield, Brain, Network, Github, Eye, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Blockchain-backed Audit Trail",
    description:
      "Every task allocation is recorded on the blockchain, ensuring complete transparency and accountability.",
  },
  {
    icon: Brain,
    title: "AI-driven Smart Work Allocation",
    description: "Our AI analyzes employee skills and workloads to optimally distribute tasks for maximum efficiency.",
  },
  {
    icon: Network,
    title: "Employee Skill Graph Analysis",
    description: "Visualize and leverage your team's skills with our comprehensive skill mapping system.",
  },
  {
    icon: Github,
    title: "GitHub Issue Syncing",
    description: "Automatically import and prioritize GitHub issues for seamless project management.",
  },
  {
    icon: Eye,
    title: "Transparent Decision Making",
    description: "Understand why tasks are assigned to specific team members with clear AI reasoning.",
  },
  {
    icon: BarChart3,
    title: "Real-time Work Status Dashboard",
    description: "Monitor project progress and team workloads with intuitive, real-time dashboards.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Zenith combines blockchain security with AI intelligence to revolutionize how work is distributed within
            your organization.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-3 rounded-lg inline-block">
                <feature.icon className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
