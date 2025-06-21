"use client"

import React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  History,
  Bot,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Activity,
  Zap,
  Building,
  UserCog
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ManagerSidebarProps {
  activeSection: string
  setActiveSectionAction: (section: string) => void
  isOpen: boolean
  onToggleAction: () => void
}

const sidebarItems = [
  { 
    id: 'overview', 
    label: 'Dashboard Overview', 
    icon: LayoutDashboard 
  },
  { 
    id: 'upload-task', 
    label: 'Upload Task', 
    icon: PlusCircle 
  },
  { 
    id: 'team-overview', 
    label: 'Team Overview', 
    icon: Users 
  },
  { 
    id: 'task-history', 
    label: 'Task History', 
    icon: History 
  },
  { 
    id: 'ai-logs', 
    label: 'AI Allocation Logs', 
    icon: Bot 
  }
]

export function ManagerSidebar({ 
  activeSection, 
  setActiveSectionAction, 
  isOpen, 
  onToggleAction
}: ManagerSidebarProps) {
  const handleItemSelect = (itemId: string) => {
    setActiveSectionAction(itemId)
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Zenith Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="ml-3 text-lg font-semibold text-white">Zenith Manager</span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemSelect(item.id)}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                activeSection === item.id
                  ? "bg-rose-800 text-white"
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

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleAction}
        />
      )}
    </div>
  )
}
