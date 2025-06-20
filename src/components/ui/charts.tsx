"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface ChartData {
  name: string
  value: number
  color?: string
}

interface BarChartProps {
  data: ChartData[]
  height?: number
  className?: string
  showValues?: boolean
}

export function BarChart({ data, height = 200, className, showValues = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center relative group">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all duration-300 hover:opacity-80",
                  item.color || "bg-red-800"
                )}
                style={{
                  height: `${(item.value / maxValue) * (height - 40)}px`,
                  minHeight: '4px'
                }}
              />
              {showValues && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center truncate w-full">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface PieChartProps {
  data: ChartData[]
  size?: number
  className?: string
  showLegend?: boolean
}

export function PieChart({ data, size = 200, className, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  
  const colors = [
    '#DC143C', '#8B0000', '#B22222', '#CD5C5C', '#F08080',
    '#FF6347', '#FF4500', '#FF8C00', '#FFA500', '#FFD700'
  ]
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    currentAngle += angle
    
    const x1 = Math.cos((startAngle - 90) * Math.PI / 180) * (size / 2 - 10)
    const y1 = Math.sin((startAngle - 90) * Math.PI / 180) * (size / 2 - 10)
    const x2 = Math.cos((currentAngle - 90) * Math.PI / 180) * (size / 2 - 10)
    const y2 = Math.sin((currentAngle - 90) * Math.PI / 180) * (size / 2 - 10)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M ${size / 2} ${size / 2}`,
      `L ${size / 2 + x1} ${size / 2 + y1}`,
      `A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${size / 2 + x2} ${size / 2 + y2}`,
      'Z'
    ].join(' ')
    
    return {
      ...item,
      pathData,
      percentage,
      color: item.color || colors[index % colors.length]
    }
  })
  
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.pathData}
            fill={segment.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>
      
      {showLegend && (
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-400">
                {segment.name} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface LineChartProps {
  data: { name: string; value: number }[]
  height?: number
  className?: string
  color?: string
}

export function LineChart({ data, height = 200, className, color = "#DC143C" }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className={cn("w-full", className)}>
      <svg width="100%" height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - ((item.value - minValue) / range) * 100
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        {data.map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </div>
    </div>
  )
}

interface HeatmapProps {
  data: { name: string; value: number }[]
  rows: number
  cols: number
  className?: string
}

export function Heatmap({ data, rows, cols, className }: HeatmapProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className={cn("inline-block", className)}>
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {data.slice(0, rows * cols).map((item, index) => {
          const intensity = item.value / maxValue
          const opacity = Math.max(0.1, intensity)
          
          return (
            <div
              key={index}
              className="w-4 h-4 rounded-sm bg-red-800 hover:scale-110 transition-transform cursor-pointer"
              style={{ opacity }}
              title={`${item.name}: ${item.value}`}
            />
          )
        })}
      </div>
    </div>
  )
}
