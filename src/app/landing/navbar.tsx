"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { UserButton } from "@civic/auth/react"
import { GradientUserButton } from "@/components/ui/gradient-user-button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/30 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-display">
            Zenith
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-white/80 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
            How It Works
          </Link>          <Link href="#testimonials" className="text-white/80 hover:text-white transition-colors">
            Testimonials
          </Link>
          <GradientUserButton />
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <div className="inline-flex items-center justify-center border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 w-full px-4 py-2 rounded-lg transition-all duration-200 font-medium min-h-[40px] [&>*]:!bg-transparent [&>*]:!border-none [&>*]:!text-cyan-400 [&>*]:!p-0 [&>*]:!m-0 [&>*]:!font-medium [&>*]:!text-sm [&>*]:!leading-none [&>button]:!bg-transparent [&>button]:!border-none [&>button]:!text-cyan-400 [&>button]:!p-0 [&>button]:!m-0 [&>button]:!font-medium [&>button]:!text-sm [&>button]:!leading-none [&>button]:!min-h-0 [&>button]:!h-auto">
                <UserButton />
              </div>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white w-full px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
