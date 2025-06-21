"use client"

import { UserButton } from "@civic/auth/react"

export function LogoutButton({ className }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <UserButton />
    </div>
  )
}
