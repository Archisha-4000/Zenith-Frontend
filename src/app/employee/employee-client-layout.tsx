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
    <div className="min-h-screen bg-black text-white flex">
      <EmployeeSidebar 
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
