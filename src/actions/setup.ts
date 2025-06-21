//src/actions/setup.ts

"use server";

import { createOrganization } from "@/services/organizationService";
import { createUser } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";

export async function setupOrganizationAndUser(formData: FormData): Promise<ActionResult<{ organizationId: string; userId: string }>> {
  try {
    // Extract organization data
    const orgName = formData.get("orgName") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const plan = formData.get("plan") as string;
    
    // Extract user data
    const employeeId = formData.get("employeeId") as string;
    const userName = formData.get("userName") as string;
    const role = formData.get("role") as "admin" | "manager" | "employee";
    const providerUserId = formData.get("providerUserId") as string;

    // Validation
    const fieldErrors = validateRequired({ 
      orgName, 
      logoUrl, 
      plan, 
      employeeId, 
      userName, 
      role, 
      providerUserId 
    });
    
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    // First, create the organization
    const organization = await createOrganization({
      name: orgName,
      logoUrl,
      billing: {
        plan,
        status: "active"
      }
    });

    // Then create the admin user
    const user = await createUser({
      org_id: organization._id,
      employee_id: employeeId,
      name: userName,
      auth_provider: {
        type: "civic",
        provider_user_id: providerUserId
      },
      role,
      is_on_leave: false
    });

    // Revalidate relevant paths
    revalidatePath("/admin/dashboard");
    
    // Return serializable data - just the IDs as strings
    return { 
      success: true, 
      data: { 
        organizationId: organization._id.toString(),
        userId: user._id.toString()
      } 
    };
  } catch (error) {
    console.error("Failed to setup organization and user:", error);
    return { success: false, error: "Failed to complete setup. Please try again." };
  }
}
