"use server";

import { createOrganization, getOrganizationById, getAllOrganizations, updateOrganization, deleteOrganization } from "@/services/organizationService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { Organization } from "@/models/types";

export async function createOrgAction(formData: FormData): Promise<ActionResult<Organization>> {
  try {
    const name = formData.get("name") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const plan = formData.get("plan") as "basic" | "pro";
    
    // Validation
    const fieldErrors = validateRequired({ name, logoUrl, plan });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const org = await createOrganization({
      name,
      logoUrl,
      billing: {
        plan,
        status: "active"
      }
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    
    return { success: true, data: org };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function getOrgAction(id: string): Promise<ActionResult<Organization>> {
  try {
    const org = await getOrganizationById(id);
    
    if (!org) {
      return { success: false, error: "Organization not found" };
    }
    
    return { success: true, data: org };
  } catch (error) {
    console.error("Failed to get organization:", error);
    return { success: false, error: "Failed to get organization" };
  }
}

export async function getAllOrgsAction(): Promise<ActionResult<Organization[]>> {
  try {
    const orgs = await getAllOrganizations();
    return { success: true, data: orgs };
  } catch (error) {
    console.error("Failed to get organizations:", error);
    return { success: false, error: "Failed to get organizations" };
  }
}

export async function updateOrgAction(formData: FormData): Promise<ActionResult<Organization>> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const plan = formData.get("plan") as "basic" | "pro";
    const status = formData.get("status") as "active" | "past_due";

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (logoUrl) updates.logoUrl = logoUrl;
    if (plan || status) {
      updates.billing = {};
      if (plan) updates.billing.plan = plan;
      if (status) updates.billing.status = status;
    }

    const org = await updateOrganization(id, updates);
    
    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/organizations/${id}`);
    
    return { success: true, data: org };
  } catch (error) {
    console.error("Failed to update organization:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function deleteOrgAction(orgId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteOrganization(orgId);
    
    if (!result) {
      return { success: false, error: "Organization not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete organization:", error);
    return { success: false, error: "Failed to delete organization" };
  }
}
