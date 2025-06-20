"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  return <div className={cn("relative", className)}>{children}</div>
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export function DropdownMenuTrigger({ children, asChild, className }: DropdownMenuTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn("cursor-pointer", className)}
      >
        {children}
      </div>
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function DropdownMenuContent({ children, className, side = 'bottom' }: DropdownMenuContentProps) {
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-gray-800 border-gray-700 p-1 shadow-md",
      side === 'top' && "bottom-full mb-1",
      side === 'bottom' && "top-full mt-1",
      side === 'left' && "right-full mr-1",
      side === 'right' && "left-full ml-1",
      className
    )}>
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function DropdownMenuItem({ children, className, onClick }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-700 hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}
