"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextType | null>(null)

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Close dropdown when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen])
  
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("relative", className)} data-dropdown>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export function DropdownMenuTrigger({ children, asChild, className }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu')
  
  const { isOpen, setIsOpen } = context
  
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
}

export function DropdownMenuContent({ children, className, side = 'bottom' }: DropdownMenuContentProps) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu')
  
  const { isOpen } = context
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [calculatedSide, setCalculatedSide] = React.useState<'top' | 'bottom' | 'left' | 'right'>('bottom')
  const [isPositioned, setIsPositioned] = React.useState(false)
  
  React.useEffect(() => {
    if (!isOpen || side !== 'auto') {
      setIsPositioned(side !== 'auto')
      return
    }
    
    // Use setTimeout to ensure element is rendered
    const timer = setTimeout(() => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      const parentElement = element.closest('[data-dropdown]')
      if (!parentElement) return
      
      const parentRect = parentElement.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Calculate available space in each direction
      const spaceBelow = viewportHeight - parentRect.bottom - 10 // 10px buffer
      const spaceAbove = parentRect.top - 10
      const spaceRight = viewportWidth - parentRect.right - 10
      const spaceLeft = parentRect.left - 10
      
      // Get actual or estimated content dimensions
      const rect = element.getBoundingClientRect()
      const contentHeight = rect.height || 200
      const contentWidth = rect.width || 250
      
      let newSide: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
      
      // Determine best position
      if (spaceBelow >= contentHeight) {
        newSide = 'bottom'
      } else if (spaceAbove >= contentHeight) {
        newSide = 'top'
      } else if (spaceRight >= contentWidth) {
        newSide = 'right'
      } else if (spaceLeft >= contentWidth) {
        newSide = 'left'
      } else {
        // Fallback to side with most space
        const spaces = { bottom: spaceBelow, top: spaceAbove, right: spaceRight, left: spaceLeft }
        newSide = Object.entries(spaces).reduce((a, b) => spaces[a[0] as keyof typeof spaces] > spaces[b[0] as keyof typeof spaces] ? a : b)[0] as 'top' | 'bottom' | 'left' | 'right'
      }
      
      setCalculatedSide(newSide)
      setIsPositioned(true)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [isOpen, side])
  
  if (!isOpen) return null
  
  const finalSide = side === 'auto' ? calculatedSide : side
  const shouldShow = side !== 'auto' || isPositioned
  
  return (
    <div 
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border right-full mr-1 bg-gray-800 border-gray-700 p-1 shadow-md",
        finalSide === 'top' && "bottom-full mb-1",
        finalSide === 'bottom' && "top-full mt-1",
        finalSide === 'left' && "right-full mr-1",
        finalSide === 'right' && "left-full ml-1",
        !shouldShow && "opacity-0", // Hide until positioned
        className
      )}
    >
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
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownMenuItem must be used within DropdownMenu')
  
  const { setIsOpen } = context
  
  const handleClick = () => {
    onClick?.()
    setIsOpen(false) // Close dropdown when item is clicked
  }
  
  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-700 hover:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}
