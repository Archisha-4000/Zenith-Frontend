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
  email: string;
  auth_provider: {
    type: "civic";
    provider_user_id: string;
  };
  role: "admin" | "manager" | "employee";
  job_role: string;
  seniority: "junior" | "mid" | "senior";
  skills: string[];
  current_workload: number;
  hourly_rate: number;
  performance_rating: number
  is_on_leave: boolean;
  created_at: Date;
};

export type ClientUser = {
  _id: string;
  org_id: string;
  employee_id: string;
  name: string;
  email: string;
  auth_provider: {
    type: "civic";
    provider_user_id: string;
  };
  role: "admin" | "manager" | "employee";
  job_role: string;
  seniority: "junior" | "mid" | "senior";
  skills: string[];
  current_workload: number;
  hourly_rate: number;
  performance_rating: number
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

// Main AI Task Document
export type AITaskDocument = {
  _id: ObjectId | string;
  org_id: string;
  requirement: {
    org_id: string;
    requirement_text: string;
    priority: "low" | "medium" | "high";
    deadline: Date | { $date: { $numberLong: string } };
    additional_context: string;
  };
  feature_spec: {
    title: string;
    description: string;
    user_stories: string[];
    acceptance_criteria: string[];
    priority: "low" | "medium" | "high";
    estimated_effort: string;
    dependencies: string[];
  };
  architecture: {
    tech_stack: string[];
    system_components: string[];
    architecture_diagram_description: string;
    database_schema: string;
    api_endpoints: string[];
    security_considerations: string[];
  };
  task_allocations: {
    employee_id: string;
    employee_email: string;
    employee_name: string;
    tasks: AITask[];
    total_estimated_hours: number | { $numberInt: string };
    allocation_reasoning: string;
  }[];
  email_results: {
    status: string;
    total_emails: number | { $numberInt: string };
    successful: number | { $numberInt: string };
    failed: number | { $numberInt: string };
    is_simple_task: boolean;
    results: any[];
  };
  success: boolean;
  errors: any[];
  created_at: Date | { $date: { $numberLong: string } };
  optimization_metrics: {
    task_complexity: string;
    classification_confidence: number | { $numberDouble: string };
    classification_reasoning: string;
    ai_estimated_hours: number | { $numberInt: string };
    required_skills: string[];
    risk_factors: string[];
    dependencies: any[];
    employees_used: number | { $numberInt: string };
    total_tasks: number | { $numberInt: string };
    total_estimated_hours: number | { $numberInt: string };
    average_cost_efficiency: number | { $numberDouble: string };
    workflow_path: string;
    nodes_skipped: number | { $numberInt: string };
    optimization_enabled: boolean;
    ai_classification_used: boolean;
  };
};

// Individual Task within allocation
export type AITask = {
  _id?: string;
  id?: string | null;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  estimated_duration_hours: number | { $numberInt: string };
  due_date: Date | { $date: { $numberLong: string } };
  status: "pending" | "in_progress" | "completed" | "blocked";
  assigned_to: string;
  assigned_to_email: string;
  created_by_agent: string;
  org_id: string;
  additional_details?: string | null;
  created_at?: Date | { $date: { $numberLong: string } } | null;
  updated_at?: Date | { $date: { $numberLong: string } } | null;
  allocation_id?: string;
};

export type AIAllocationLog = {
  _id: ObjectId | string;
  task_id: string;
  allocation_id: string;
  employee_id: string;
  employee_email: string;
  employee_name: string;
  allocation_reason: string;
  confidence_score: number;
  created_by_agent: string;
  org_id: string;
  created_at: Date;
  optimization_context?: any;
};
