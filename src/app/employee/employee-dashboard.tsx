"use client";

import { User } from "@/models/types";
import { useState } from "react";

interface Task {
  _id: string;
  id?: any;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  estimated_duration_hours: number | { $numberInt: string };
  due_date: string | { $date: { $numberLong: string } };
  status: "pending" | "in_progress" | "completed";
  assigned_to: string;
  assigned_to_email: string;
  created_by_agent: string;
  org_id: string;
  additional_details?: string;
  created_at: string | { $date: { $numberLong: string } };
  updated_at?: any;
  allocation_id: string;
}

interface EmployeeDashboardProps {
  user: any; // Serialized user object
  tasks: Task[];
}

const priorityColors = {
  low: "bg-green-600",
  medium: "bg-yellow-600", 
  high: "bg-orange-600",
  critical: "bg-red-600"
};

const statusColors = {
  pending: "bg-gray-600",
  in_progress: "bg-blue-600",
  completed: "bg-green-600"
};

export function EmployeeDashboard({ user, tasks }: EmployeeDashboardProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const formatDate = (dateValue: string | { $date: { $numberLong: string } }) => {
    if (typeof dateValue === 'string') {
      // Handle ISO string format
      return new Date(dateValue).toLocaleDateString();
    } else if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
      // Handle MongoDB format
      const date = new Date(parseInt(dateValue.$date.$numberLong));
      return date.toLocaleDateString();
    }
    return 'Unknown';
  };

  const getDurationHours = (duration: number | { $numberInt: string }) => {
    if (typeof duration === 'number') {
      return duration;
    } else if (duration && typeof duration === 'object' && duration.$numberInt) {
      return parseInt(duration.$numberInt);
    }
    return 0;
  };

  const getTaskStats = () => {
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in_progress").length;
    const completed = tasks.filter(t => t.status === "completed").length;
    
    return { pending, inProgress, completed, total: tasks.length };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-500">Employee Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Role: {user.role}</p>
              <p className="text-sm text-gray-400">Employee ID: {user.employee_id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "all" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "pending" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "in_progress" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === "completed" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
              <p className="text-gray-400">No tasks found.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
                    <p className="text-gray-400 mb-3">{task.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="text-white">{getDurationHours(task.estimated_duration_hours)} hours</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Due Date: </span>
                    <span className="text-white">{formatDate(task.due_date)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Created: </span>
                    <span className="text-white">{formatDate(task.created_at)}</span>
                  </div>
                </div>

                {task.additional_details && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <span className="text-gray-400">Additional Details: </span>
                    <span className="text-gray-300">{task.additional_details}</span>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
                  <span>Created by: {task.created_by_agent}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
