"use server";

import { createUser, getUserById, getUsersByOrgId, updateUser, deleteUser, getUserByEmail } from "@/services/userService";
import { getCollections } from "@/lib/db/collections";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { User, ClientUser } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createUserAction(formData: FormData): Promise<ActionResult<ClientUser>> {
  try {
    const orgId = formData.get("orgId") as string;
    const employeeId = formData.get("employeeId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as "admin" | "manager" | "employee";
    const jobRole = formData.get("jobRole") as string;
    const seniority = formData.get("seniority") as "junior" | "mid" | "senior";
    const skills = formData.get("skills") as string;
    const currentWorkload = formData.get("currentWorkload") as string;
    const hourlyRate = formData.get("hourlyRate") as string;
    const performanceRating = formData.get("performanceRating") as string;
    const providerUserId = formData.get("providerUserId") as string;
    const isOnLeave = formData.get("isOnLeave") === "true";

    // Validation - only require the essential fields
    const fieldErrors = validateRequired({ orgId, employeeId, name });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const user = await createUser({
      org_id: new ObjectId(orgId),
      employee_id: employeeId,
      name,
      email,
      auth_provider: {
        type: "civic",
        provider_user_id: providerUserId || ""
      },
      role,
      job_role: jobRole,
      seniority,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      current_workload: currentWorkload ? parseInt(currentWorkload) : undefined,
      hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      performance_rating: performanceRating ? parseFloat(performanceRating) : undefined,
      is_on_leave: isOnLeave
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/organizations/${orgId}`);
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUserAction(id: string): Promise<ActionResult<User>> {
  try {
    const user = await getUserById(id);
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to get user:", error);
    return { success: false, error: "Failed to get user" };
  }
}

export async function updateUserAction(formData: FormData): Promise<ActionResult<User>> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "admin" | "manager" | "employee";
    const isOnLeave = formData.get("isOnLeave") === "true";

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (formData.has("isOnLeave")) updates.is_on_leave = isOnLeave;

    const user = await updateUser(id, updates);
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUserAction(userId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteUser(userId);
    
    if (!result) {
      return { success: false, error: "User not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function updateUserRoleAction(userId: string, role: User["role"]): Promise<ActionResult<User>> {
  try {
    const user = await updateUser(userId, { role });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

export async function createUserFromDataAction(userData: {
  orgId: string;
  employeeId: string;
  name: string;
  [key: string]: any; // Allow any additional fields from CSV
}): Promise<ActionResult<ClientUser>> {
  try {
    // Validation - only require the essential fields
    const fieldErrors = validateRequired({ 
      orgId: userData.orgId, 
      employeeId: userData.employeeId, 
      name: userData.name 
    });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }    // Determine the org_id to use
    let orgIdToUse: ObjectId;
    
    // If CSV has org_id in ObjectId format, use that
    if (userData.org_id && typeof userData.org_id === 'object' && userData.org_id.$oid) {
      orgIdToUse = new ObjectId(userData.org_id.$oid);
    } else {
      // Otherwise use the provided orgId (from current user)
      if (!ObjectId.isValid(userData.orgId)) {
        return { success: false, error: `Invalid organization ID format: ${userData.orgId}` };
      }
      orgIdToUse = new ObjectId(userData.orgId);
    }

    // Prepare the user data, extracting known fields and preserving all others
    const userInput = {
      org_id: orgIdToUse,
      employee_id: userData.employeeId,
      name: userData.name,
      email: userData.email,
      auth_provider: {
        type: "civic" as const,
        provider_user_id: userData.providerUserId || ""
      },
      role: userData.role as "admin" | "manager" | "employee" | undefined,
      job_role: userData.jobRole,
      seniority: userData.seniority as "junior" | "mid" | "senior" | undefined,
      skills: userData.skills,
      current_workload: userData.currentWorkload,
      hourly_rate: userData.hourlyRate,
      performance_rating: userData.performanceRating,
      is_on_leave: userData.isOnLeave,
      // Include all additional fields from CSV
      ...Object.keys(userData).reduce((acc, key) => {
        // Skip fields we've already mapped to avoid duplicates and internal ObjectId fields
        if (!['orgId', 'employeeId', 'name', 'email', 'role', 'jobRole', 
              'seniority', 'skills', 'currentWorkload', 'hourlyRate', 
              'performanceRating', 'providerUserId', 'isOnLeave', 'org_id'].includes(key)) {
          acc[key] = userData[key];
        }
        return acc;
      }, {} as Record<string, any>)
    };    const user = await createUser(userInput);

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/organizations/${orgIdToUse.toString()}`);
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
  }
}

export async function getCurrentUserAction(): Promise<ActionResult<ClientUser>> {
  try {
    // This would typically get the current user from session/auth
    // For demo purposes, we'll get the first user from the database
    // TODO: Replace with actual authentication logic
    
    const { users } = await getCollections();
    const user = await users.findOne({});
    
    if (!user) {
      return { success: false, error: "No users found in database" };
    }    // Convert to ClientUser format
    const clientUser: ClientUser = {
      ...user,
      _id: user._id.toString(),
      org_id: user.org_id instanceof ObjectId ? user.org_id.toHexString() : String(user.org_id),
      created_at: user.created_at
    };
    
    return { success: true, data: clientUser };
  } catch (error) {
    console.error("Failed to get current user:", error);
    return { success: false, error: "Failed to get current user" };
  }
}

export async function getUsersByOrgAction(orgId: string): Promise<ActionResult<ClientUser[]>> {
  try {
    const users = await getUsersByOrgId(orgId);
      // Convert all users to ClientUser format
    const clientUsers: ClientUser[] = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      org_id: user.org_id instanceof ObjectId ? user.org_id.toHexString() : String(user.org_id),
      created_at: user.created_at
    }));
    
    return { success: true, data: clientUsers };
  } catch (error) {
    console.error("Failed to get users by organization:", error);
    return { success: false, error: "Failed to get users by organization" };
  }
}
