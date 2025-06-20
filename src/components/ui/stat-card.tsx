"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-red-800/30 transition-colors",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-red-500 ml-4">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-green-400" : "text-red-400"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  progress?: number
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  progress,
  color = 'red',
  className 
}: MetricCardProps) {
  const colorStyles = {
    red: "from-red-800 to-red-700",
    green: "from-green-600 to-green-700",
    blue: "from-blue-600 to-blue-700",
    yellow: "from-yellow-600 to-yellow-700",
    purple: "from-purple-600 to-purple-700"
  }
  
  return (
    <div className={cn(
      "relative overflow-hidden bg-gray-900 border border-gray-800 rounded-xl p-6",
      className
    )}>
      {/* Background gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full blur-2xl bg-gradient-radial",
        colorStyles[color]
      )} />
      
      <div className="relative">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mb-3">{description}</p>
        )}
        
        {progress !== undefined && (
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full bg-gradient-to-r", colorStyles[color])}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
