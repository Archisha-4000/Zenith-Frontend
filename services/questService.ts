import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { Quest } from "@/models/types";

export async function createQuest(input: {
  org_id: ObjectId;
  submitter_id: ObjectId;
  title: string;
  description: string;
  type: "feature" | "issue" | "bug";
  priority: "low" | "medium" | "high";
}): Promise<Quest> {
  const { quests } = await getCollections();

  const quest: Quest = {
    _id: new ObjectId(),
    org_id: input.org_id,
    submitter_id: input.submitter_id,
    title: input.title,
    description: input.description,
    type: input.type,
    priority: input.priority,
    status: "open",
    created_at: new Date()
  };

  await quests.insertOne(quest);
  return quest;
}

export async function getQuestById(id: string): Promise<Quest | null> {
  const { quests } = await getCollections();
  return await quests.findOne({ _id: new ObjectId(id) });
}

export async function getQuestsByOrgId(orgId: string): Promise<Quest[]> {
  const { quests } = await getCollections();
  return await quests.find({ org_id: new ObjectId(orgId) }).toArray();
}

export async function getQuestsBySubmitterId(submitterId: string): Promise<Quest[]> {
  const { quests } = await getCollections();
  return await quests.find({ submitter_id: new ObjectId(submitterId) }).toArray();
}

export async function updateQuest(
  id: string,
  updates: Partial<Omit<Quest, "_id" | "created_at">>
): Promise<Quest | null> {
  const { quests } = await getCollections();
  
  await quests.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getQuestById(id);
}

export async function deleteQuest(id: string): Promise<boolean> {
  const { quests } = await getCollections();
  const result = await quests.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
