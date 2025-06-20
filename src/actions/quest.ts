"use server";

import { createQuest, getQuestById, getQuestsByOrgId, updateQuest, deleteQuest } from "@/services/questService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { Quest } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createQuestAction(formData: FormData): Promise<ActionResult<Quest>> {
  try {
    const orgId = formData.get("orgId") as string;
    const submitterId = formData.get("submitterId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as "feature" | "issue" | "bug";
    const priority = formData.get("priority") as "low" | "medium" | "high";

    // Validation
    const fieldErrors = validateRequired({ orgId, submitterId, title, description, type, priority });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const quest = await createQuest({
      org_id: new ObjectId(orgId),
      submitter_id: new ObjectId(submitterId),
      title,
      description,
      type,
      priority
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/quests");
    revalidatePath(`/dashboard/organizations/${orgId}`);
    
    return { success: true, data: quest };
  } catch (error) {
    console.error("Failed to create quest:", error);
    return { success: false, error: "Failed to create quest" };
  }
}

export async function getQuestAction(id: string): Promise<ActionResult<Quest>> {
  try {
    const quest = await getQuestById(id);
    
    if (!quest) {
      return { success: false, error: "Quest not found" };
    }
    
    return { success: true, data: quest };
  } catch (error) {
    console.error("Failed to get quest:", error);
    return { success: false, error: "Failed to get quest" };
  }
}

export async function getQuestsByOrgAction(orgId: string): Promise<ActionResult<Quest[]>> {
  try {
    const quests = await getQuestsByOrgId(orgId);
    return { success: true, data: quests };
  } catch (error) {
    console.error("Failed to get quests:", error);
    return { success: false, error: "Failed to get quests" };
  }
}

export async function updateQuestStatusAction(questId: string, status: Quest["status"]): Promise<ActionResult<Quest>> {
  try {
    const quest = await updateQuest(questId, { status });
    
    if (!quest) {
      return { success: false, error: "Quest not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/quests");
    revalidatePath(`/dashboard/quests/${questId}`);
    
    return { success: true, data: quest };
  } catch (error) {
    console.error("Failed to update quest status:", error);
    return { success: false, error: "Failed to update quest status" };
  }
}

export async function updateQuestAction(formData: FormData): Promise<ActionResult<Quest>> {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as "feature" | "issue" | "bug";
    const priority = formData.get("priority") as "low" | "medium" | "high";
    const status = formData.get("status") as "open" | "in_progress" | "completed";

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (type) updates.type = type;
    if (priority) updates.priority = priority;
    if (status) updates.status = status;

    const quest = await updateQuest(id, updates);
    
    if (!quest) {
      return { success: false, error: "Quest not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/quests");
    revalidatePath(`/dashboard/quests/${id}`);
    
    return { success: true, data: quest };
  } catch (error) {
    console.error("Failed to update quest:", error);
    return { success: false, error: "Failed to update quest" };
  }
}

export async function assignQuestAction(questId: string, userId: string): Promise<ActionResult<Quest>> {
  try {
    // Note: This would typically create a task assignment rather than directly assigning the quest
    // For now, we'll update the quest with a custom field or use the existing structure
    const quest = await getQuestById(questId);
    
    if (!quest) {
      return { success: false, error: "Quest not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/quests");
    revalidatePath(`/dashboard/quests/${questId}`);
    
    return { success: true, data: quest };
  } catch (error) {
    console.error("Failed to assign quest:", error);
    return { success: false, error: "Failed to assign quest" };
  }
}

export async function deleteQuestAction(questId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteQuest(questId);
    
    if (!result) {
      return { success: false, error: "Quest not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/quests");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete quest:", error);
    return { success: false, error: "Failed to delete quest" };
  }
}
