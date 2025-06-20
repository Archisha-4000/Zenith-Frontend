import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { AuditLog } from "@/models/types";

export async function createAuditLog(input: {
  org_id: ObjectId;
  user_id: ObjectId;
  action: "QuestCreated" | "TaskAssigned" | "TaskCompleted";
  meta: Record<string, any>;
  chain_tx_hash?: string;
}): Promise<AuditLog> {
  const { audit_logs } = await getCollections();

  const auditLog: AuditLog = {
    _id: new ObjectId(),
    org_id: input.org_id,
    user_id: input.user_id,
    action: input.action,
    meta: input.meta,
    timestamp: new Date(),
    chain_tx_hash: input.chain_tx_hash || ""
  };

  await audit_logs.insertOne(auditLog);
  return auditLog;
}

export async function getAuditLogById(id: string): Promise<AuditLog | null> {
  const { audit_logs } = await getCollections();
  return await audit_logs.findOne({ _id: new ObjectId(id) });
}

export async function getAuditLogsByOrgId(orgId: string): Promise<AuditLog[]> {
  const { audit_logs } = await getCollections();
  return await audit_logs.find({ org_id: new ObjectId(orgId) })
    .sort({ timestamp: -1 })
    .toArray();
}

export async function getAuditLogsByUserId(userId: string): Promise<AuditLog[]> {
  const { audit_logs } = await getCollections();
  return await audit_logs.find({ user_id: new ObjectId(userId) })
    .sort({ timestamp: -1 })
    .toArray();
}

export async function getAuditLogsByAction(
  action: "QuestCreated" | "TaskAssigned" | "TaskCompleted",
  orgId?: string
): Promise<AuditLog[]> {
  const { audit_logs } = await getCollections();
  
  const filter: any = { action };
  if (orgId) {
    filter.org_id = new ObjectId(orgId);
  }
  
  return await audit_logs.find(filter)
    .sort({ timestamp: -1 })
    .toArray();
}

export async function updateAuditLog(
  id: string,
  updates: Partial<Omit<AuditLog, "_id" | "timestamp">>
): Promise<AuditLog | null> {
  const { audit_logs } = await getCollections();
  
  await audit_logs.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getAuditLogById(id);
}

export async function deleteAuditLog(id: string): Promise<boolean> {
  const { audit_logs } = await getCollections();
  const result = await audit_logs.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
