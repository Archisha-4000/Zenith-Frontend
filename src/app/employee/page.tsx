import { getUser } from "@civic/auth/nextjs"
import { redirect } from "next/navigation"
import { EmployeeSidebar } from "@/components/employee/employee-sidebar"
import { EmployeeDashboardOverview } from "@/components/employee/dashboard-overview"
import { EmployeeMyTasks } from "@/components/employee/my-tasks"
import { OrganizationNotFound } from "./organization-not-found"
import { getUserByEmail } from "@/services/userService"
import { getTasksByEmail } from "@/services/taskService"
import { EmployeeClientLayout } from "./employee-client-layout"

export default async function EmployeePage() {
  const user = await getUser()

  if (!user || !user.email) {
    redirect("/")
  }

  const orgUser = await getUserByEmail(user.email)

  if (!orgUser) {
    return <OrganizationNotFound userEmail={user.email} />
  }

  const tasks = await getTasksByEmail(user.email)

  return (
    <EmployeeClientLayout 
      user={orgUser} 
      tasks={tasks}
    />
  )
}
