import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { Task } from "@/models/types";

export async function createTask(input: {
  quest_id: ObjectId;
  assigned_to: ObjectId;
  type: "frontend" | "backend" | "onchain" | "testing" | "deployment";
  chain_tx_hash?: string;
}): Promise<Task> {
  const { tasks } = await getCollections();

  const task: Task = {
    _id: new ObjectId(),
    quest_id: input.quest_id,
    assigned_to: input.assigned_to,
    type: input.type,
    status: "pending",
    logs: [],
    chain_tx_hash: input.chain_tx_hash || "",
    created_at: new Date(),
    started_at: null,
    completed_at: null
  };

  await tasks.insertOne(task);
  return task;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const { tasks } = await getCollections();
  return await tasks.findOne({ _id: new ObjectId(id) });
}

export async function getTasksByQuestId(questId: string): Promise<Task[]> {
  const { tasks } = await getCollections();
  return await tasks.find({ quest_id: new ObjectId(questId) }).toArray();
}

export async function getTasksByAssignedTo(userId: string): Promise<Task[]> {
  const { tasks } = await getCollections();
  return await tasks.find({ assigned_to: new ObjectId(userId) }).toArray();
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "_id" | "created_at">>
): Promise<Task | null> {
  const { tasks } = await getCollections();
  
  // Handle status changes to update timestamps
  const updateData = { ...updates };
  if (updates.status === "started" && !updates.started_at) {
    updateData.started_at = new Date();
  }
  if (updates.status === "done" && !updates.completed_at) {
    updateData.completed_at = new Date();
  }
  
  await tasks.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  return await getTaskById(id);
}

export async function addTaskLog(
  id: string,
  message: string
): Promise<Task | null> {
  const { tasks } = await getCollections();
  
  await tasks.updateOne(
    { _id: new ObjectId(id) },
    { 
      $push: { 
        logs: { 
          message, 
          timestamp: new Date() 
        } 
      } 
    }
  );

  return await getTaskById(id);
}

export async function deleteTask(id: string): Promise<boolean> {
  const { tasks } = await getCollections();
  const result = await tasks.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
