"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Bot, 
  CreditCard,
  Github, 
  Shield, 
  BarChart3, 
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: number | null
}

interface SidebarProps {
  isOpen: boolean
  onToggleAction: () => void
  activeItem: string
  onItemSelectAction: (itemId: string) => void
  className?: string
  collapsed?: boolean
  onCollapseToggle?: () => void
}

const sidebarItems: SidebarItem[] = [
  { 
    id: 'overview', 
    label: 'Dashboard Overview', 
    icon: LayoutDashboard 
  },
  { 
    id: 'employees', 
    label: 'Employee Directory', 
    icon: Users,
    badge: 4
  },
  { 
    id: 'projects', 
    label: 'Project Tracker', 
    icon: FolderOpen,
    badge: 5
  },
  { 
    id: 'ai-monitor', 
    label: 'AI Task Engine', 
    icon: Bot,
    badge: 1
  },
  { 
    id: 'payments', 
    label: 'Payments & Invoices', 
    icon: CreditCard
  },
  { 
    id: 'github', 
    label: 'GitHub Integration', 
    icon: Github,
    badge: 5
  },
  { 
    id: 'analytics', 
    label: 'Analytics & Insights', 
    icon: BarChart3 
  },
  { 
    id: 'logs', 
    label: 'Activity Logs', 
    icon: FileText 
  },
]

export function Sidebar({ 
  isOpen, 
  onToggleAction, 
  activeItem, 
  onItemSelectAction, 
  className,
  collapsed = false,
  onCollapseToggle
}: SidebarProps) {

  const [items, setItems] = React.useState<SidebarItem[]>(sidebarItems)

  const handleItemClick = (item: SidebarItem) => {
    // Clear the badge when item is clicked
    if (item.badge && item.badge > 0) {
      setItems(prevItems => 
        prevItems.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, badge: null }
            : prevItem
        )
      )
    }
    onItemSelectAction(item.id)
  }

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = activeItem === item.id

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
            isActive
              ? "bg-rose-800 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50",
            collapsed && "justify-center px-2"
          )}
        >          <div className="flex items-center min-w-0 flex-1">
            {React.createElement(item.icon, {
              size: 18,
              className: cn(
                "flex-shrink-0",
                !collapsed && "mr-3",
                isActive ? "text-white" : "text-gray-400"
              )
            })}
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </div>
          
          {!collapsed && item.badge && item.badge > 0 && (
            <span className={cn(
              "px-2 py-0.5 text-xs rounded-full font-medium",
              isActive
                ? "bg-white/20 text-white"
                : "bg-rose-800 text-white"
            )}>
              {item.badge}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleAction}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-16" : "w-64",
        className
      )}>        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/web-app-manifest-512x512.png"
                  alt="Zenith Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white">Zenith</h1>
                <p className="text-xs text-gray-400">Admin Portal</p>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg mx-auto overflow-hidden">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="Zenith Logo"
                width={32}
                height={32}
                className="object-contain rounded-lg"
              />
            </div>
          )}

          {/* Collapse Toggle (Desktop) */}
          {onCollapseToggle && (
            <button
              onClick={onCollapseToggle}
              className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"            >
              {collapsed ? React.createElement(ChevronRight, { size: 16 }) : React.createElement(ChevronLeft, { size: 16 })}
            </button>
          )}
        </div>        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map(item => renderSidebarItem(item))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <div className="mb-4 p-3 bg-red-900/20 border border-rose-800 rounded-lg">              <div className="flex items-center">
                {React.createElement(Bell, { size: 16, className: "text-red-400 mr-2" })}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-red-400">System Alert</p>
                  <p className="text-xs text-gray-400 truncate">AI engine running optimally</p>
                </div>
              </div>
            </div>
          )}

          <div className={cn("space-y-2", collapsed && "space-y-1")}>
            <button className={cn(
              "w-full flex items-center text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200",
              collapsed ? "justify-center p-2" : "px-3 py-2"            )}>
              {React.createElement(Settings, { size: 18, className: cn(!collapsed && "mr-3") })}
              {!collapsed && "Settings"}
            </button>
            
            <button className={cn(
              "w-full flex items-center text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors duration-200",
              collapsed ? "justify-center p-2" : "px-3 py-2"            )}>
              {React.createElement(LogOut, { size: 18, className: cn(!collapsed && "mr-3") })}
              {!collapsed && "Logout"}
            </button>
          </div>

          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-rose-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">Admin User</p>
                  <p className="text-xs text-gray-400 truncate">Organization Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Context and Provider for Sidebar
interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  defaultCollapsed?: boolean
}

export function SidebarProvider({ children, defaultOpen = true, defaultCollapsed = false }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  
  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsed, setCollapsed }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

interface SidebarInsetProps {
  children: React.ReactNode
  className?: string
}

export function SidebarInset({ children, className }: SidebarInsetProps) {
  return (
    <div className={cn("flex-1", className)}>
      {children}
    </div>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}
