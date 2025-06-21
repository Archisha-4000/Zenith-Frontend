"use server";

import { getCollections } from "@/lib/db/collections";
import { ActionResult } from "./utils";
import { ObjectId } from "mongodb";
import { AITask, AITaskDocument, AIAllocationLog } from "@/models/types";

// Helper function to parse MongoDB number fields
export async function parseMongoNumber(value: any): Promise<number> {
  if (typeof value === 'number') return value;
  if (value?.$numberInt) return parseInt(value.$numberInt);
  if (value?.$numberLong) return parseInt(value.$numberLong);
  if (value?.$numberDouble) return parseFloat(value.$numberDouble);
  return 0;
}

// Helper function to parse MongoDB date fields
export async function parseMongoDate(value: any): Promise<Date> {
  if (value instanceof Date) return value;
  if (value?.$date?.$numberLong) return new Date(parseInt(value.$date.$numberLong));
  if (value?.$date) return new Date(value.$date);
  return new Date();
}

export async function getAITaskDocumentsByOrgAction(orgId: string): Promise<ActionResult<AITaskDocument[]>> {  try {
    const { aiTasks } = await getCollections();
    
    console.log(`Searching processing_results collection for org_id: ${orgId}`);
    const documents = await aiTasks.find({ org_id: orgId }).sort({ created_at: -1 }).toArray();
    console.log(`Found ${documents.length} documents in processing_results for org ${orgId}`);
    
    // Convert ObjectId to string for client compatibility  
    const clientDocuments: AITaskDocument[] = documents.map((doc: any) => ({
      _id: doc._id?.toString(),
      org_id: doc.org_id,
      requirement: doc.requirement || {},
      feature_spec: doc.feature_spec || {},
      architecture: doc.architecture || {},
      task_allocations: doc.task_allocations || [],
      email_results: doc.email_results || {},
      success: doc.success || false,
      errors: doc.errors || [],
      created_at: doc.created_at,
      optimization_metrics: doc.optimization_metrics || {}
    }));

    return { success: true, data: clientDocuments };
  } catch (error) {
    console.error("Failed to fetch AI task documents:", error);
    return { success: false, error: "Failed to fetch AI task documents" };
  }
}

export async function getAllTasksFromDocumentsAction(orgId: string): Promise<ActionResult<AITask[]>> {
  try {
    const documentsResult = await getAITaskDocumentsByOrgAction(orgId);
    if (!documentsResult.success || !documentsResult.data) {
      console.log("Failed to fetch task documents");
      return { success: false, error: "Failed to fetch task documents" };
    }

    console.log(`Processing ${documentsResult.data.length} documents for task extraction`);
    const allTasks: AITask[] = [];
    
    documentsResult.data.forEach((doc, docIndex) => {
      console.log(`Document ${docIndex}: has ${doc.task_allocations?.length || 0} allocations`);
      if (doc.task_allocations) {
        doc.task_allocations.forEach((allocation, allocIndex) => {
          console.log(`  Allocation ${allocIndex}: ${allocation.employee_name} has ${allocation.tasks?.length || 0} tasks`);
          if (allocation.tasks) {
            allocation.tasks.forEach(task => {
              allTasks.push({
                ...task,
                assigned_to: allocation.employee_id,
                assigned_to_email: allocation.employee_email
              });
            });          }
        });
      }
    });

    console.log(`Total tasks extracted: ${allTasks.length}`);
    return { success: true, data: allTasks };
  } catch (error) {
    console.error("Failed to extract tasks from documents:", error);
    return { success: false, error: "Failed to extract tasks from documents" };
  }
}

export async function getTasksForEmployeeAction(
  orgId: string, 
  employeeEmail: string
): Promise<ActionResult<AITask[]>> {
  try {
    const allTasksResult = await getAllTasksFromDocumentsAction(orgId);
    if (!allTasksResult.success || !allTasksResult.data) {
      return { success: false, error: "Failed to fetch tasks" };
    }

    const employeeTasks = allTasksResult.data.filter(task => 
      task.assigned_to_email === employeeEmail
    );

    return { success: true, data: employeeTasks };
  } catch (error) {
    console.error("Failed to fetch employee tasks:", error);
    return { success: false, error: "Failed to fetch employee tasks" };
  }
}

export async function getTaskStatsAction(orgId: string): Promise<ActionResult<{
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  blocked: number;
}>> {
  try {
    const allTasksResult = await getAllTasksFromDocumentsAction(orgId);
    if (!allTasksResult.success || !allTasksResult.data) {
      return { success: false, error: "Failed to fetch tasks" };
    }

    const tasks = allTasksResult.data;
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Failed to fetch task stats:", error);
    return { success: false, error: "Failed to fetch task stats" };
  }
}

export async function getAITasksByOrgAction(orgId: string): Promise<ActionResult<AITask[]>> {
  try {
    return await getAllTasksFromDocumentsAction(orgId);
  } catch (error) {
    console.error("Failed to fetch AI tasks:", error);
    return { success: false, error: "Failed to fetch AI tasks" };
  }
}

export async function getAIAllocationLogsAction(orgId: string): Promise<ActionResult<AITaskDocument[]>> {
  try {
    return await getAITaskDocumentsByOrgAction(orgId);
  } catch (error) {
    console.error("Failed to fetch AI allocation logs:", error);
    return { success: false, error: "Failed to fetch AI allocation logs" };
  }
}

export async function getTasksByEmailAction(email: string): Promise<ActionResult<AITask[]>> {
  try {
    const { aiTasks } = await getCollections();
    
    console.log(`Searching for tasks assigned to email: ${email}`);
    
    // Find all processing_results documents that contain task allocations for this email
    const documents = await aiTasks.find({
      "task_allocations.employee_email": email
    }).sort({ created_at: -1 }).toArray();
    
    console.log(`Found ${documents.length} documents with tasks for ${email}`);
    
    // Extract tasks from all documents
    let allTasks: AITask[] = [];
    
    for (const doc of documents) {
      if (doc.task_allocations && Array.isArray(doc.task_allocations)) {
        for (const allocation of doc.task_allocations) {
          if (allocation.employee_email === email && allocation.tasks && Array.isArray(allocation.tasks)) {
            for (const task of allocation.tasks) {              const aiTask: AITask = {
                _id: task._id || `${doc._id}_${allocation.employee_email}_${Math.random()}`,
                id: task.id || task._id,
                title: task.title || "Untitled Task",
                description: task.description || "No description",
                priority: task.priority || "medium",
                estimated_duration_hours: task.estimated_duration_hours || 0,
                due_date: task.due_date || doc.created_at,
                status: task.status || "pending",
                assigned_to: allocation.employee_name || "Unknown",
                assigned_to_email: allocation.employee_email || email,
                created_by_agent: "AI System",
                org_id: doc.org_id,
                additional_details: task.additional_details || "",
                created_at: doc.created_at,
                updated_at: task.updated_at,
                allocation_id: doc._id?.toString()
              };
              allTasks.push(aiTask);
            }
          }
        }
      }
    }
    
    console.log(`Extracted ${allTasks.length} tasks for ${email}`);
    return { success: true, data: allTasks };
  } catch (error) {
    console.error("Failed to fetch tasks by email:", error);
    return { success: false, error: "Failed to fetch tasks by email" };
  }
}

// Test function to debug database connection and data
export async function testDatabaseConnection(orgId: string): Promise<ActionResult<any>> {
  try {
    const { aiTasks } = await getCollections();
    
    console.log("Testing database connection...");
    
    // Check if collection exists and has any documents
    const totalCount = await aiTasks.countDocuments({});
    console.log(`Total documents in processing_results collection: ${totalCount}`);
    
    // Check documents for this org
    const orgCount = await aiTasks.countDocuments({ org_id: orgId });
    console.log(`Documents for org ${orgId}: ${orgCount}`);
    
    // Get a sample document to see the structure
    const sampleDoc = await aiTasks.findOne({});
    console.log("Sample document structure:", JSON.stringify(sampleDoc, null, 2));
    
    // Check if there are documents with this org_id
    const orgDocs = await aiTasks.find({ org_id: orgId }).limit(1).toArray();
    console.log(`Sample org document:`, JSON.stringify(orgDocs[0], null, 2));
    
    return { 
      success: true, 
      data: { 
        totalCount, 
        orgCount, 
        sampleDoc: sampleDoc ? "Found" : "None",
        orgDocs: orgDocs.length 
      } 
    };
  } catch (error) {
    console.error("Database test failed:", error);
    return { success: false, error: `Database test failed: ${error}` };
  }
}


