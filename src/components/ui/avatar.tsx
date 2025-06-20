"use client"

import React from 'react'
import { cn, getInitials, generateColor } from '@/lib/utils'

interface AvatarProps {
  className?: string
  children?: React.ReactNode
}

export function Avatar({ className, children }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {children}
    </div>
  )
}

interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  const [imageError, setImageError] = React.useState(false)
  
  if (!src || imageError) {
    return null
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={() => setImageError(true)}
    />
  )
}

interface AvatarFallbackProps {
  children?: React.ReactNode
  className?: string
  name?: string
}

export function AvatarFallback({ children, className, name }: AvatarFallbackProps) {
  // If name is provided, generate initials and color
  if (name) {
    const initials = getInitials(name)
    const backgroundColor = generateColor(name)
    
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full font-medium text-white text-sm",
          className
        )}
        style={{ backgroundColor }}
      >
        {initials}
      </div>
    )
  }
  
  // Default fallback
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-rose-800 text-white font-medium text-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  className?: string
}

export function AvatarGroup({ children, max = 3, className }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children)
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray
  const remainingCount = childrenArray.length - max
  
  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className="h-10 w-10 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-gray-400">
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

// Utility component for simple usage (backward compatibility)
interface SimpleAvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function SimpleAvatar({ src, alt, name = '', size = 'md', className }: SimpleAvatarProps) {
  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }
  
  return (
    <Avatar className={cn(sizeStyles[size], className)}>
      {src && <AvatarImage src={src} alt={alt || name} />}
      <AvatarFallback name={name}>
        {name ? getInitials(name) : alt?.[0]?.toUpperCase() || '?'}
      </AvatarFallback>
    </Avatar>
  )
}
