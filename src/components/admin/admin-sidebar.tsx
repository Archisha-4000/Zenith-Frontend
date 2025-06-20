"use client"

import React from "react"
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
  User,
  ChevronDown,
  Activity,
  Zap,
  Building,
  UserCog,
  Wallet
} from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"

interface AdminSidebarProps {
  activeSection: string
  setActiveSectionAction: (section: string) => void
  isOpen: boolean
  onToggleAction: () => void
}

export function AdminSidebar({ 
  activeSection, 
  setActiveSectionAction, 
  isOpen, 
  onToggleAction
}: AdminSidebarProps) {
  const handleItemSelect = (itemId: string) => {
    setActiveSectionAction(itemId)
  }

  return (
    <Sidebar
      isOpen={isOpen}
      onToggleAction={onToggleAction}
      activeItem={activeSection}
      onItemSelectAction={handleItemSelect}
      className="bg-black border-gray-800"
    />
  )
}
