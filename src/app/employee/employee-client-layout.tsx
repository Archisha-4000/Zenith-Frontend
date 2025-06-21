"use client"

import { useState } from "react"
import { EmployeeSidebar } from "@/components/employee/employee-sidebar"
import { EmployeeDashboardOverview } from "@/components/employee/dashboard-overview"
import { EmployeeMyTasks } from "@/components/employee/my-tasks"

interface EmployeeClientLayoutProps {
  user: any
  tasks: any[]
}

export function EmployeeClientLayout({ user, tasks }: EmployeeClientLayoutProps) {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <EmployeeDashboardOverview user={user} tasks={tasks} />
      case "my-tasks":
        return <EmployeeMyTasks user={user} tasks={tasks} />
      default:
        return <EmployeeDashboardOverview user={user} tasks={tasks} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <EmployeeSidebar 
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
