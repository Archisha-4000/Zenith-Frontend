"use client"

import { useState } from "react"
import { ManagerSidebar } from "@/components/manager/manager-sidebar"
import { DashboardOverview } from "@/components/manager/dashboard-overview"
import { TaskUpload } from "@/components/manager/task-upload"
import { TeamOverview } from "@/components/manager/team-overview"
import { TaskHistory } from "@/components/manager/task-history"
import { AIAllocationLogs } from "@/components/manager/ai-allocation-logs"

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "upload-task":
        return <TaskUpload />
      case "team-overview":
        return <TeamOverview />
      case "task-history":
        return <TaskHistory />
      case "ai-logs":
        return <AIAllocationLogs />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <ManagerSidebar 
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
