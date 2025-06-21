import { getDatabase } from "./client";
import {
  Organization,
  User,
  Device,
  Quest,
  Task,
  AuditLog,
  InstallerLink,
  AITask,
  AIAllocationLog
} from "@/models/types";

export const getCollections = async () => {
  const db = await getDatabase();
  return {
    organizations: db.collection<Organization>("organizations"),
    users: db.collection<User>("users"),
    devices: db.collection<Device>("devices"),
    quests: db.collection<Quest>("quests"),
    tasks: db.collection<Task>("tasks"),
    audit_logs: db.collection<AuditLog>("audit_logs"),
    installer_links: db.collection<InstallerLink>("installer_links"),
    aiTasks: db.collection<AITask>("processing_results"),
    aiAllocationLogs: db.collection<AIAllocationLog>("processing_results")
  };
};
