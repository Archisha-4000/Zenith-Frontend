"use client"

import React from "react"
import Image from "next/image"
import {
  LayoutDashboard,
  CheckSquare,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EmployeeSidebarProps {
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
    id: 'my-tasks', 
    label: 'My Tasks', 
    icon: CheckSquare 
  }
]

export function EmployeeSidebar({ 
  activeSection, 
  setActiveSectionAction, 
  isOpen, 
  onToggleAction
}: EmployeeSidebarProps) {
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
          <span className="ml-3 text-lg font-semibold text-white">Zenith Employee</span>
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

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Employee</p>
            <p className="text-xs text-gray-400 truncate">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
