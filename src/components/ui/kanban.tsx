"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  children: React.ReactNode
  className?: string
}

export function KanbanBoard({ children, className }: KanbanBoardProps) {
  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {children}
    </div>
  )
}

interface KanbanColumnProps {
  title: string
  count?: number
  children: React.ReactNode
  className?: string
  color?: 'gray' | 'blue' | 'yellow' | 'green' | 'red'
}

export function KanbanColumn({ 
  title, 
  count, 
  children, 
  className,
  color = 'gray'
}: KanbanColumnProps) {
  const colorStyles = {
    gray: "border-gray-600 bg-gray-800/30",
    blue: "border-blue-600 bg-blue-900/20",
    yellow: "border-yellow-600 bg-yellow-900/20",
    green: "border-green-600 bg-green-900/20",
    red: "border-red-600 bg-red-900/20"
  }
  
  return (
    <div className={cn(
      "flex-shrink-0 w-80 rounded-lg border-2 border-dashed p-4",
      colorStyles[color],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{title}</h3>
        {count !== undefined && (
          <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

interface KanbanCardProps {
  title: string
  description?: string
  assignee?: {
    name: string
    avatar?: string
  }
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  dueDate?: string
  className?: string
  onClick?: () => void
}

export function KanbanCard({ 
  title, 
  description, 
  assignee, 
  priority,
  tags = [],
  dueDate,
  className,
  onClick
}: KanbanCardProps) {
  const priorityColors = {
    low: "bg-green-900/20 text-green-400 border-green-800",
    medium: "bg-yellow-900/20 text-yellow-400 border-yellow-800",
    high: "bg-red-900/20 text-red-400 border-red-800"
  }
  
  return (
    <div
      className={cn(
        "bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-600/50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <h4 className="font-medium text-white mb-2">{title}</h4>
      
      {description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {priority && (
            <span className={cn(
              "px-2 py-1 text-xs rounded-full border",
              priorityColors[priority]
            )}>
              {priority}
            </span>
          )}
          {dueDate && (
            <span className="text-xs text-gray-400">{dueDate}</span>
          )}
        </div>
        
        {assignee && (
          <div className="flex items-center gap-2">
            {assignee.avatar ? (
              <img
                src={assignee.avatar}
                alt={assignee.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs text-white">
                {assignee.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
