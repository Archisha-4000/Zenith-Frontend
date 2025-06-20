"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showValue = false,
  size = 'md',
  variant = 'default'
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }
  
  const variantStyles = {
    default: "bg-rose-800",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    error: "bg-rose-800"
  }
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "bg-gray-800 rounded-full overflow-hidden",
        sizeStyles[size]
      )}>
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out rounded-full",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-xs text-gray-400 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function CircularProgress({
  value,
  max = 100,
  size = 100,
  strokeWidth = 8,
  className,
  showValue = true,
  variant = 'default'
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const variantStyles = {
    default: "stroke-rose-800",
    success: "stroke-green-600",
    warning: "stroke-yellow-600",
    error: "stroke-rose-800"
  }
  
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(31 41 55)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("transition-all duration-300", variantStyles[variant])}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
