"use client"

import { useState } from "react"
import { EmployeeSidebar } from "@/components/employee/employee-sidebar"
import { EmployeeDashboardOverview } from "@/components/employee/dashboard-overview"
import { EmployeeMyTasks } from "@/components/employee/my-tasks"

export default function EmployeePage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <EmployeeDashboardOverview />
      case "my-tasks":
        return <EmployeeMyTasks />
      default:
        return <EmployeeDashboardOverview />
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
