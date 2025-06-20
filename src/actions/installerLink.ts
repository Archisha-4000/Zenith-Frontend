"use server";

import { 
  createInstallerLink, 
  getInstallerLinkById, 
  getInstallerLinksByOrgId, 
  updateInstallerLink, 
  revokeInstallerLink,
  deleteInstallerLink 
} from "@/services/installerLinkService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { InstallerLink } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createInstallerLinkAction(formData: FormData): Promise<ActionResult<InstallerLink>> {
  try {
    const orgId = formData.get("orgId") as string;
    const url = formData.get("url") as string;
    const expiresInDays = parseInt(formData.get("expiresInDays") as string) || 7;

    // Validation
    const fieldErrors = validateRequired({ orgId, url });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const installerLink = await createInstallerLink({
      org_id: new ObjectId(orgId),
      url,
      expiresInDays
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/installer-links");
    revalidatePath(`/dashboard/organizations/${orgId}`);
    
    return { success: true, data: installerLink };
  } catch (error) {
    console.error("Failed to create installer link:", error);
    return { success: false, error: "Failed to create installer link" };
  }
}

export async function getInstallerLinkAction(id: string): Promise<ActionResult<InstallerLink>> {
  try {
    const installerLink = await getInstallerLinkById(id);
    
    if (!installerLink) {
      return { success: false, error: "Installer link not found" };
    }
    
    return { success: true, data: installerLink };
  } catch (error) {
    console.error("Failed to get installer link:", error);
    return { success: false, error: "Failed to get installer link" };
  }
}

export async function getInstallerLinksByOrgAction(orgId: string): Promise<ActionResult<InstallerLink[]>> {
  try {
    const installerLinks = await getInstallerLinksByOrgId(orgId);
    return { success: true, data: installerLinks };
  } catch (error) {
    console.error("Failed to get installer links:", error);
    return { success: false, error: "Failed to get installer links" };
  }
}

export async function updateInstallerLinkAction(formData: FormData): Promise<ActionResult<InstallerLink>> {
  try {
    const id = formData.get("id") as string;
    const url = formData.get("url") as string;
    const expiresAt = formData.get("expiresAt") as string;

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (url) updates.url = url;
    if (expiresAt) updates.expires_at = new Date(expiresAt);

    const installerLink = await updateInstallerLink(id, updates);
    
    if (!installerLink) {
      return { success: false, error: "Installer link not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/installer-links");
    revalidatePath(`/dashboard/installer-links/${id}`);
    
    return { success: true, data: installerLink };
  } catch (error) {
    console.error("Failed to update installer link:", error);
    return { success: false, error: "Failed to update installer link" };
  }
}

export async function revokeInstallerLinkAction(linkId: string): Promise<ActionResult<InstallerLink>> {
  try {
    const installerLink = await revokeInstallerLink(linkId);
    
    if (!installerLink) {
      return { success: false, error: "Installer link not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/installer-links");
    revalidatePath(`/dashboard/installer-links/${linkId}`);
    
    return { success: true, data: installerLink };
  } catch (error) {
    console.error("Failed to revoke installer link:", error);
    return { success: false, error: "Failed to revoke installer link" };
  }
}

export async function deleteInstallerLinkAction(linkId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteInstallerLink(linkId);
    
    if (!result) {
      return { success: false, error: "Installer link not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/installer-links");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete installer link:", error);
    return { success: false, error: "Failed to delete installer link" };
  }
}
