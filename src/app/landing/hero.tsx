"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 500
    canvas.height = 500

    // Node class
    class Node {
      x: number
      y: number
      size: number
      color: string
      type: string

      constructor(x: number, y: number, type: string) {
        this.x = x
        this.y = y
        this.type = type

        if (type === "person") {
          this.size = 8
          this.color = "#64ffda"
        } else if (type === "task") {
          this.size = 6
          this.color = "#ff79c6"
        } else {
          this.size = 10
          this.color = "#bd93f9"
        }
      }

      draw() {
        ctx!.fillStyle = this.color
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.strokeStyle = this.color
        ctx!.lineWidth = 2
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size + 3, 0, Math.PI * 2)
        ctx!.stroke()
      }
    }

    // Create nodes
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const aiNode = new Node(centerX, centerY, "ai")

    const personNodes: Node[] = []
    const taskNodes: Node[] = []
    const radius = 150

    // Create person nodes in a circle
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      personNodes.push(new Node(x, y, "person"))
    }

    // Create task nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const distance = Math.random() * 50 + 70
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      taskNodes.push(new Node(x, y, "task"))
    }

    // Animation variables
    let animationFrame: number
    let time = 0

    // Animation loop
    function animate() {
      if (!canvas) return;
      ctx!.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between AI and people
      personNodes.forEach((person, index) => {
        ctx!.strokeStyle = `rgba(100, 255, 218, ${0.3 + Math.sin(time + index) * 0.2})`
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(aiNode.x, aiNode.y)
        ctx!.lineTo(person.x, person.y)
        ctx!.stroke()
      })

      // Draw connections between AI and tasks
      taskNodes.forEach((task, index) => {
        // Animate task movement
        task.x = centerX + Math.cos(time * 0.5 + index) * (70 + (index % 3) * 20)
        task.y = centerY + Math.sin(time * 0.5 + index) * (70 + (index % 3) * 20)

        ctx!.strokeStyle = `rgba(255, 121, 198, ${0.4 + Math.sin(time * 0.8 + index) * 0.2})`
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(aiNode.x, aiNode.y)
        ctx!.lineTo(task.x, task.y)
        ctx!.stroke()
      })

      // Randomly connect tasks to people
      if (Math.random() > 0.95) {
        const taskIndex = Math.floor(Math.random() * taskNodes.length)
        const personIndex = Math.floor(Math.random() * personNodes.length)

        ctx!.strokeStyle = "rgba(189, 147, 249, 0.6)"
        ctx!.lineWidth = 2
        ctx!.beginPath()
        ctx!.moveTo(taskNodes[taskIndex].x, taskNodes[taskIndex].y)
        ctx!.lineTo(personNodes[personIndex].x, personNodes[personIndex].y)
        ctx!.stroke()

        // Draw a small animation at the person node
        ctx!.fillStyle = "rgba(189, 147, 249, 0.3)"
        ctx!.beginPath()
        ctx!.arc(personNodes[personIndex].x, personNodes[personIndex].y, 15, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw all nodes
      aiNode.draw()
      personNodes.forEach((node) => node.draw())
      taskNodes.forEach((node) => node.draw())

      time += 0.01
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center">
        <motion.div
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Redefining Work Allocation
            </span>{" "}
            <br />
            <span className="text-white">with AI and Blockchain</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
            Connect your teams, automate task distribution, and build with transparency using Zenith's intelligent work
            allocation platform.
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg py-3 px-8 rounded-lg transition-all duration-200 font-medium">
              Request Demo
            </button>
            <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 text-lg py-3 px-8 rounded-lg transition-all duration-200 font-medium">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          className="lg:w-1/2 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <canvas ref={canvasRef} className="w-full h-auto relative z-10" width="500" height="500"></canvas>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
