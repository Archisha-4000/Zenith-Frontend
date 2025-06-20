
import { getUser } from "@civic/auth/nextjs";
import { redirect } from "next/navigation";
import { EmployeeDashboard } from "./employee-dashboard";
import { OrganizationNotFound } from "./organization-not-found";
import { getUserByEmail } from "@/services/userService";
import { getTasksByEmail } from "@/services/taskService";


export default async function EmployeePage() {
  const user = await getUser();
  
  if (!user || !user.email) {
    redirect('/');
  }

  // Check if user exists in the organization
  const orgUser = await getUserByEmail(user.email);
  
  if (!orgUser) {
    return <OrganizationNotFound userEmail={user.email} />;
  }

  // Get user's tasks
  const tasks = await getTasksByEmail(user.email);

  return <EmployeeDashboard user={orgUser} tasks={tasks} />;
}
