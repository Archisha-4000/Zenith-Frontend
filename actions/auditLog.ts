"use server";

import { 
  createAuditLog, 
  getAuditLogById, 
  getAuditLogsByOrgId, 
  getAuditLogsByUserId,
  getAuditLogsByAction,
  updateAuditLog,
  deleteAuditLog 
} from "@/services/auditLogService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { AuditLog } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createAuditLogAction(formData: FormData): Promise<ActionResult<AuditLog>> {
  try {
    const orgId = formData.get("orgId") as string;
    const userId = formData.get("userId") as string;
    const action = formData.get("action") as "QuestCreated" | "TaskAssigned" | "TaskCompleted";
    const metaString = formData.get("meta") as string;
    const chainTxHash = formData.get("chainTxHash") as string;

    // Validation
    const fieldErrors = validateRequired({ orgId, userId, action });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    let meta: Record<string, any> = {};
    if (metaString) {
      try {
        meta = JSON.parse(metaString);
      } catch (error) {
        return { success: false, error: "Invalid meta JSON format" };
      }
    }

    const auditLog = await createAuditLog({
      org_id: new ObjectId(orgId),
      user_id: new ObjectId(userId),
      action,
      meta,
      chain_tx_hash: chainTxHash
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/audit-logs");
    revalidatePath(`/dashboard/organizations/${orgId}`);
    
    return { success: true, data: auditLog };
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return { success: false, error: "Failed to create audit log" };
  }
}

export async function getAuditLogAction(id: string): Promise<ActionResult<AuditLog>> {
  try {
    const auditLog = await getAuditLogById(id);
    
    if (!auditLog) {
      return { success: false, error: "Audit log not found" };
    }
    
    return { success: true, data: auditLog };
  } catch (error) {
    console.error("Failed to get audit log:", error);
    return { success: false, error: "Failed to get audit log" };
  }
}

export async function getAuditLogsByOrgAction(orgId: string): Promise<ActionResult<AuditLog[]>> {
  try {
    const auditLogs = await getAuditLogsByOrgId(orgId);
    return { success: true, data: auditLogs };
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return { success: false, error: "Failed to get audit logs" };
  }
}

export async function getAuditLogsByUserAction(userId: string): Promise<ActionResult<AuditLog[]>> {
  try {
    const auditLogs = await getAuditLogsByUserId(userId);
    return { success: true, data: auditLogs };
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return { success: false, error: "Failed to get audit logs" };
  }
}

export async function getAuditLogsByActionAction(
  action: "QuestCreated" | "TaskAssigned" | "TaskCompleted",
  orgId?: string
): Promise<ActionResult<AuditLog[]>> {
  try {
    const auditLogs = await getAuditLogsByAction(action, orgId);
    return { success: true, data: auditLogs };
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return { success: false, error: "Failed to get audit logs" };
  }
}

export async function updateAuditLogAction(formData: FormData): Promise<ActionResult<AuditLog>> {
  try {
    const id = formData.get("id") as string;
    const metaString = formData.get("meta") as string;
    const chainTxHash = formData.get("chainTxHash") as string;

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (metaString) {
      try {
        updates.meta = JSON.parse(metaString);
      } catch (error) {
        return { success: false, error: "Invalid meta JSON format" };
      }
    }
    if (chainTxHash) updates.chain_tx_hash = chainTxHash;

    const auditLog = await updateAuditLog(id, updates);
    
    if (!auditLog) {
      return { success: false, error: "Audit log not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/audit-logs");
    revalidatePath(`/dashboard/audit-logs/${id}`);
    
    return { success: true, data: auditLog };
  } catch (error) {
    console.error("Failed to update audit log:", error);
    return { success: false, error: "Failed to update audit log" };
  }
}

export async function deleteAuditLogAction(auditLogId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteAuditLog(auditLogId);
    
    if (!result) {
      return { success: false, error: "Audit log not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/audit-logs");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete audit log:", error);
    return { success: false, error: "Failed to delete audit log" };
  }
}
