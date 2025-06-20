"use server";

import { createTask, getTaskById, getTasksByQuestId, updateTask, addTaskLog, deleteTask } from "@/services/taskService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { Task } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createTaskAction(formData: FormData): Promise<ActionResult<Task>> {
  try {
    const questId = formData.get("questId") as string;
    const assignedTo = formData.get("assignedTo") as string;
    const type = formData.get("type") as "frontend" | "backend" | "onchain" | "testing" | "deployment";
    const chainTxHash = formData.get("chainTxHash") as string;

    // Validation
    const fieldErrors = validateRequired({ questId, assignedTo, type });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const task = await createTask({
      quest_id: new ObjectId(questId),
      assigned_to: new ObjectId(assignedTo),
      type,
      chain_tx_hash: chainTxHash
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/quests/${questId}`);
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function getTaskAction(id: string): Promise<ActionResult<Task>> {
  try {
    const task = await getTaskById(id);
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to get task:", error);
    return { success: false, error: "Failed to get task" };
  }
}

export async function getTasksByQuestAction(questId: string): Promise<ActionResult<Task[]>> {
  try {
    const tasks = await getTasksByQuestId(questId);
    return { success: true, data: tasks };
  } catch (error) {
    console.error("Failed to get tasks:", error);
    return { success: false, error: "Failed to get tasks" };
  }
}

export async function updateTaskStatusAction(taskId: string, status: Task["status"]): Promise<ActionResult<Task>> {
  try {
    const task = await updateTask(taskId, { status });
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/tasks/${taskId}`);
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function updateTaskAction(formData: FormData): Promise<ActionResult<Task>> {
  try {
    const id = formData.get("id") as string;
    const type = formData.get("type") as "frontend" | "backend" | "onchain" | "testing" | "deployment";
    const status = formData.get("status") as "pending" | "started" | "done";
    const chainTxHash = formData.get("chainTxHash") as string;

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (type) updates.type = type;
    if (status) updates.status = status;
    if (chainTxHash) updates.chain_tx_hash = chainTxHash;

    const task = await updateTask(id, updates);
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/tasks/${id}`);
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function assignTaskAction(taskId: string, userId: string): Promise<ActionResult<Task>> {
  try {
    const task = await updateTask(taskId, { assigned_to: new ObjectId(userId) });
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/tasks/${taskId}`);
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to assign task:", error);
    return { success: false, error: "Failed to assign task" };
  }
}

export async function addTaskLogAction(taskId: string, message: string): Promise<ActionResult<Task>> {
  try {
    const task = await addTaskLog(taskId, message);
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    revalidatePath(`/dashboard/tasks/${taskId}`);
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to add task log:", error);
    return { success: false, error: "Failed to add task log" };
  }
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteTask(taskId);
    
    if (!result) {
      return { success: false, error: "Task not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/tasks");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

export async function updateEmployeeTaskStatusAction(taskId: string, status: "pending" | "in_progress" | "completed"): Promise<ActionResult<any>> {
  try {
    const { updateTaskStatusForEmployee } = await import("@/services/taskService");
    const task = await updateTaskStatusForEmployee(taskId, status);
    
    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/employee");
    
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}
