import { ObjectId } from "mongodb";

export type Organization = {
  _id: ObjectId;
  name: string;
  logoUrl: string;
  billing: {
    plan: string;
    status: "active" | "past_due";
    lastPaymentAt: Date;
  };
  createdAt: Date;
};

export type InstallerLink = {
  _id: ObjectId;
  org_id: ObjectId;
  url: string;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
};

export type User = {
  _id: ObjectId;
  org_id: ObjectId;
  employee_id: string;
  name: string;
  auth_provider: {
    type: "civic";
    provider_user_id: string;
  };
  role: "admin" | "manager" | "employee";
  is_on_leave: boolean;
  created_at: Date;
};

export type Device = {
  _id: ObjectId;
  user_id: ObjectId;
  node_pub_key: string;
  last_seen_at: Date;
  registered_at: Date;
};

export type Quest = {
  _id: ObjectId;
  org_id: ObjectId;
  submitter_id: ObjectId;
  title: string;
  description: string;
  type: "feature" | "issue" | "bug";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "completed";
  created_at: Date;
};

export type Task = {
  _id: ObjectId;
  quest_id: ObjectId;
  assigned_to: ObjectId;
  type: "frontend" | "backend" | "onchain" | "testing" | "deployment";
  status: "pending" | "started" | "done";
  logs: { message: string; timestamp: Date }[];
  chain_tx_hash: string;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
};

export type AuditLog = {
  _id: ObjectId;
  org_id: ObjectId;
  user_id: ObjectId;
  action: "QuestCreated" | "TaskAssigned" | "TaskCompleted";
  meta: Record<string, any>;
  timestamp: Date;
  chain_tx_hash: string;
};
