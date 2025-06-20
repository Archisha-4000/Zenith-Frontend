"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  Menu,
  Bell,
  Search,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  User,
  Shield,
  LogOut,
  CreditCard
} from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClickAction: () => void
  className?: string
  showSearch?: boolean
}

export function Header({ 
  title, 
  subtitle, 
  onMenuClickAction, 
  className,
  showSearch = true 
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showProfileMenu, setShowProfileMenu] = React.useState(false)
  const [isDarkMode, setIsDarkMode] = React.useState(true)
  
  const notifications = [
    {
      id: 1,
      title: "New AI Task Assignment",
      message: "3 tasks assigned to Frontend Team",
      time: "2 min ago",
      type: "info"
    },
    {
      id: 2,
      title: "Payment Processed",
      message: "$2,500 paid to Backend Team",
      time: "5 min ago",
      type: "success"
    },
    {
      id: 3,
      title: "GitHub Integration",
      message: "New repositories connected",
      time: "10 min ago",
      type: "warning"
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '📄'
    }
  }

  return (
    <header className={cn(
      "bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 h-16 flex items-center justify-between px-6 relative",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center">        <button
          onClick={onMenuClickAction}
          className="lg:hidden text-gray-400 hover:text-white mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center Section - Search */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, projects, tasks..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-700">
                <button className="w-full text-sm text-red-400 hover:text-red-300 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-800 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">Organization Admin</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-800 to-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-gray-400">admin@zenith.com</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  <User size={16} className="mr-3" />
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  <Shield size={16} className="mr-3" />
                  Security
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  <CreditCard size={16} className="mr-3" />
                  Billing
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  <Settings size={16} className="mr-3" />
                  Admin Settings
                </button>
              </div>

              <div className="border-t border-gray-700 py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors flex items-center">
                  <LogOut size={16} className="mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowProfileMenu(false)
          }}
        />
      )}
    </header>
  )
}
