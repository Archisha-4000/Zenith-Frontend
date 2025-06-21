"use client"

import { CivicAuthProvider } from "@civic/auth/react"

export function CivicProvider({ children }: { children: React.ReactNode }) {
  return (
    <CivicAuthProvider clientId={process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || "test-client-id"}>
      {children}
    </CivicAuthProvider>
  )
}
