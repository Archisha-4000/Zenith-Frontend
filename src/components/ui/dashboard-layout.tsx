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
  Bell,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const sidebarItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'employees', label: 'Employee & Manager Directory', icon: Users },
  { id: 'projects', label: 'Project Tracker', icon: FolderOpen },
  { id: 'ai-engine', label: 'Task Assignment AI Status', icon: Bot },
  { id: 'payments', label: 'Payments & Invoices', icon: CreditCard },
  { id: 'github', label: 'GitHub Integration', icon: Github },
  { id: 'blockchain', label: 'Blockchain Ledger', icon: Shield },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { id: 'audit', label: 'Activity Logs', icon: FileText },
]

export function DashboardLayout({ children, activeTab = 'overview', onTabChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [notifications] = React.useState(3) // Mock notification count

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="ml-3 text-lg font-semibold">Zenith Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange?.(item.id)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  activeTab === item.id
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <Settings size={18} className="mr-3" />
              Settings
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white mr-4"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-white">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">Organization Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
