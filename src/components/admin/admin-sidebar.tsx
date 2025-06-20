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
  collapsed?: boolean
  onCollapseToggleAction?: () => void
}

export function AdminSidebar({ 
  activeSection, 
  setActiveSectionAction, 
  isOpen, 
  onToggleAction,
  collapsed = false,
  onCollapseToggleAction 
}: AdminSidebarProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const handleItemSelect = (itemId: string) => {
    setActiveSectionAction(itemId)
  }

  return (
    <Sidebar
      isOpen={isOpen}
      onToggleAction={onToggleAction}
      activeItem={activeSection}
      onItemSelectAction={handleItemSelect}
      collapsed={collapsed}
      onCollapseToggle={onCollapseToggleAction}
      className="bg-black border-gray-800"
    />
  )
}
