"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { EmployeeDirectory } from "@/components/admin/employee-directory"
import { ProjectTracker } from "@/components/admin/project-tracker"
import { AIMonitor } from "@/components/admin/ai-monitor"
import { PaymentsPanel } from "@/components/admin/payments-panel"
import { GitHubIntegration } from "@/components/admin/github-integration"
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
      case "analytics":
        return <Analytics />
      case "logs":
        return <ActivityLogs />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSectionAction={setActiveSection}
        isOpen={sidebarOpen}
        onToggleAction={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 transition-all duration-300 ease-in-out relative z-10 ${
        sidebarOpen ? 'lg:pl-0' : 'pl-0'
      }`}>
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
