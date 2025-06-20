"use client"

import React from 'react'
import { cn } from '@/lib/utils'
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
  Bell,
  Activity,
  Zap,
  Building,
  UserCog,
  Wallet
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: number
  subItems?: SidebarItem[]
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
    label: 'Employee & Managers', 
    icon: Users,
    badge: 23,
    subItems: [
      { id: 'employees-list', label: 'All Employees', icon: Users },
      { id: 'managers', label: 'Managers', icon: UserCog },
      { id: 'departments', label: 'Departments', icon: Building },
    ]
  },
  { 
    id: 'projects', 
    label: 'Project Tracker', 
    icon: FolderOpen,
    badge: 8,
    subItems: [
      { id: 'active-projects', label: 'Active Projects', icon: Activity },
      { id: 'completed-projects', label: 'Completed', icon: Shield },
      { id: 'pending-projects', label: 'Pending', icon: FileText },
    ]
  },
  { 
    id: 'ai-engine', 
    label: 'AI Task Engine', 
    icon: Bot,
    badge: 1,
    subItems: [
      { id: 'ai-status', label: 'Engine Status', icon: Zap },
      { id: 'ai-assignments', label: 'Task Assignments', icon: Bot },
      { id: 'ai-optimization', label: 'Optimization', icon: BarChart3 },
    ]
  },
  { 
    id: 'payments', 
    label: 'Payments & Invoices', 
    icon: CreditCard,
    subItems: [
      { id: 'pending-payments', label: 'Pending Payments', icon: CreditCard },
      { id: 'payment-history', label: 'Payment History', icon: FileText },
      { id: 'invoices', label: 'Invoices', icon: Wallet },
    ]
  },
  { 
    id: 'github', 
    label: 'GitHub Integration', 
    icon: Github,
    badge: 5
  },
  { 
    id: 'blockchain', 
    label: 'Blockchain Ledger', 
    icon: Shield,
    badge: 2
  },
  { 
    id: 'analytics', 
    label: 'Analytics & Insights', 
    icon: BarChart3 
  },
  { 
    id: 'audit', 
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
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleItemClick = (item: SidebarItem) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleExpanded(item.id)
    } else {
      onItemSelectAction(item.id)
    }
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isActive = activeItem === item.id
    const isSubItemActive = item.subItems?.some(subItem => activeItem === subItem.id)

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
            level > 0 && "ml-4 pl-8",
            isActive || isSubItemActive
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50",
            collapsed && level === 0 && "justify-center px-2"
          )}
        >
          <div className="flex items-center min-w-0 flex-1">
            <item.icon 
              size={18} 
              className={cn(
                "flex-shrink-0",
                !collapsed && "mr-3",
                isActive || isSubItemActive ? "text-white" : "text-gray-400"
              )} 
            />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </div>
          
          {!collapsed && (
            <div className="flex items-center space-x-2">
              {item.badge && item.badge > 0 && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full font-medium",
                  isActive || isSubItemActive
                    ? "bg-white/20 text-white"
                    : "bg-red-600 text-white"
                )}>
                  {item.badge}
                </span>
              )}
              
              {hasSubItems && (
                <ChevronRight 
                  size={14} 
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )} 
                />
              )}
            </div>
          )}
        </button>

        {/* Sub Items */}
        {hasSubItems && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map(subItem => renderSidebarItem(subItem, level + 1))}
          </div>
        )}
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
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white">Zenith</h1>
                <p className="text-xs text-gray-400">Admin Portal</p>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg mx-auto">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
          )}

          {/* Collapse Toggle (Desktop) */}
          {onCollapseToggle && (
            <button
              onClick={onCollapseToggle}
              className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="flex items-center">
                <Bell size={16} className="text-red-400 mr-2" />
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
              collapsed ? "justify-center p-2" : "px-3 py-2"
            )}>
              <Settings size={18} className={cn(!collapsed && "mr-3")} />
              {!collapsed && "Settings"}
            </button>
            
            <button className={cn(
              "w-full flex items-center text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors duration-200",
              collapsed ? "justify-center p-2" : "px-3 py-2"
            )}>
              <LogOut size={18} className={cn(!collapsed && "mr-3")} />
              {!collapsed && "Logout"}
            </button>
          </div>

          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
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
  const context = React.useContext(SidebarContext)
  const collapsed = context?.collapsed || false
  
  return (
    <div className={cn(
      "flex-1 transition-all duration-300",
      collapsed ? "lg:ml-16" : "lg:ml-64",
      className
    )}>
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
