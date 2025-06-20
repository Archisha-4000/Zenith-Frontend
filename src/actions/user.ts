"use server";

import { createUser, getUserById, getUsersByOrgId, updateUser, deleteUser } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { User } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createUserAction(formData: FormData): Promise<ActionResult<User>> {
  try {
    const orgId = formData.get("orgId") as string;
    const employeeId = formData.get("employeeId") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "admin" | "manager" | "employee";
    const providerUserId = formData.get("providerUserId") as string;
    const isOnLeave = formData.get("isOnLeave") === "true";

    // Validation
    const fieldErrors = validateRequired({ orgId, employeeId, name, role, providerUserId });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const user = await createUser({
      org_id: new ObjectId(orgId),
      employee_id: employeeId,
      name,
      auth_provider: {
        type: "civic",
        provider_user_id: providerUserId
      },
      role,
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

export async function getUsersByOrgAction(orgId: string): Promise<ActionResult<User[]>> {
  try {
    const users = await getUsersByOrgId(orgId);
    return { success: true, data: users };
  } catch (error) {
    console.error("Failed to get users:", error);
    return { success: false, error: "Failed to get users" };
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
