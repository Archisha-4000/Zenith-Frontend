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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <ManagerSidebar 
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
