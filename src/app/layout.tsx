import type React from "react"
import { CivicAuthProvider } from "@civic/auth/nextjs";
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import  ChatUI from "@/components/Chat"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Zenith - AI-Powered Blockchain Work Distribution",
  description:
    "Redefining work allocation with AI and blockchain technology. Connect your teams, automate task distribution, and build with transparency.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <CivicAuthProvider>
          {children}
          <ChatUI />
        </CivicAuthProvider>

      </body>
    </html>
  )
}
