"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { EmployeeDirectory } from "@/components/admin/employee-directory"
import { ProjectTracker } from "@/components/admin/project-tracker"
import { AIMonitor } from "@/components/admin/ai-monitor"
import { PaymentsPanel } from "@/components/admin/payments-panel"
import { GitHubIntegration } from "@/components/admin/github-integration"
import { BlockchainLedger } from "@/components/admin/blockchain-ledger"
import { Analytics } from "@/components/admin/analytics"
import { ActivityLogs } from "@/components/admin/activity-logs"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "employees":
        return <EmployeeDirectory />
      case "projects":
        return <ProjectTracker />
      case "ai-monitor":
        return <AIMonitor />
      case "payments":
        return <PaymentsPanel />
      case "github":
        return <GitHubIntegration />
      case "blockchain":
        return <BlockchainLedger />
      case "analytics":
        return <Analytics />
      case "logs":
        return <ActivityLogs />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSectionAction={setActiveSection}
        isOpen={sidebarOpen}
        onToggleAction={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
        {renderContent()}
      </main>
    </div>
  )
}
