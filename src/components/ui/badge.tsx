"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({ 
  variant = 'default', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full font-medium"
  
  const variants = {
    outline: "border border-gray-500 text-gray-500 bg-transparent",
    default: "bg-gray-800 text-gray-300 border border-gray-700",
    success: "bg-green-900/20 text-green-400 border border-green-800",
    warning: "bg-yellow-900/20 text-yellow-400 border border-yellow-800",
    error: "bg-red-900/20 text-red-400 border border-red-800",
    info: "bg-blue-900/20 text-blue-400 border border-blue-800"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  
  return (
    <div
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}
