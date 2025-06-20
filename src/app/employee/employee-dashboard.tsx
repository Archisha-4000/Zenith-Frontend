"use client";

import { User } from "@/models/types";
import { useState, useTransition } from "react";
import { updateEmployeeTaskStatusAction } from "@/actions/task";
import { Check, Clock, AlertCircle, Calendar, User as UserIcon, Target } from "lucide-react";

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

const priorityConfig = {
  low: { color: "bg-green-100 text-green-800 border-green-200", icon: "🟢", label: "Low" },
  medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "🟡", label: "Medium" }, 
  high: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: "🟠", label: "High" },
  critical: { color: "bg-red-100 text-red-800 border-red-200", icon: "🔴", label: "Critical" }
};

const statusConfig = {
  pending: { color: "bg-gray-50 border-gray-200", icon: Clock, label: "To Do" },
  in_progress: { color: "bg-blue-50 border-blue-200", icon: AlertCircle, label: "In Progress" },
  completed: { color: "bg-green-50 border-green-200", icon: Check, label: "Done" }
};

export function EmployeeDashboard({ user, tasks }: EmployeeDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const formatDate = (dateValue: string | { $date: { $numberLong: string } }) => {
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    } else if (dateValue && typeof dateValue === 'object' && dateValue.$date) {
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

  const handleStatusChange = async (taskId: string, newStatus: "pending" | "in_progress" | "completed") => {
    startTransition(async () => {
      try {
        const result = await updateEmployeeTaskStatusAction(taskId, newStatus);
        if (!result.success) {
          console.error("Failed to update task status:", result.error);
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: "pending" | "in_progress" | "completed") => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      handleStatusChange(draggedTask._id, newStatus);
    }
    setDraggedTask(null);
  };

  const getDaysUntilDue = (dueDate: string | { $date: { $numberLong: string } }) => {
    let date: Date;
    if (typeof dueDate === 'string') {
      date = new Date(dueDate);
    } else if (dueDate && typeof dueDate === 'object' && dueDate.$date) {
      date = new Date(parseInt(dueDate.$date.$numberLong));
    } else {
      return null;
    }
    
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = getTaskStats();
  const tasksByStatus = {
    pending: tasks.filter(task => task.status === "pending"),
    in_progress: tasks.filter(task => task.status === "in_progress"),
    completed: tasks.filter(task => task.status === "completed")
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const daysUntilDue = getDaysUntilDue(task.due_date);
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
    const isDueSoon = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className="bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200 group"
      >
        {/* Priority Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityConfig[task.priority].color}`}>
            <span className="mr-1">{priorityConfig[task.priority].icon}</span>
            {priorityConfig[task.priority].label}
          </span>
          
          {/* Due date indicator */}
          {daysUntilDue !== null && (
            <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-500'}`}>
              <Calendar className="w-3 h-3 mr-1" />
              {isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : isDueSoon ? `${daysUntilDue}d left` : formatDate(task.due_date)}
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h3>

        {/* Task Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Task Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getDurationHours(task.estimated_duration_hours)}h
          </div>
          
          <div className="flex items-center">
            <UserIcon className="w-3 h-3 mr-1" />
            {task.created_by_agent}
          </div>
        </div>

        {/* Additional Details */}
        {task.additional_details && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.additional_details}
            </p>
          </div>
        )}

        {/* Status Change Buttons */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
          {task.status !== "pending" && (
            <button
              onClick={() => handleStatusChange(task._id, "pending")}
              disabled={isPending}
              className="flex-1 py-1 px-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Move to To Do
            </button>
          )}
          {task.status !== "in_progress" && (
            <button
              onClick={() => handleStatusChange(task._id, "in_progress")}
              disabled={isPending}
              className="flex-1 py-1 px-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              Start Progress
            </button>
          )}
          {task.status !== "completed" && (
            <button
              onClick={() => handleStatusChange(task._id, "completed")}
              disabled={isPending}
              className="flex-1 py-1 px-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              Mark Done
            </button>
          )}
        </div>
      </div>
    );
  };

  const ColumnHeader = ({ 
    title, 
    count, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    count: number; 
    icon: any; 
    color: string;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-2 ${color}`} />
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
        {count}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              <p className="text-sm text-gray-500">ID: {user.employee_id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goals Section - Overview Stats */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Goals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">To Do</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div 
            className="bg-white rounded-lg p-6 border border-gray-200 min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pending")}
          >
            <ColumnHeader 
              title="To Do" 
              count={tasksByStatus.pending.length} 
              icon={Clock} 
              color="text-gray-600" 
            />
            <div className="space-y-3">
              {tasksByStatus.pending.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
              {tasksByStatus.pending.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div 
            className="bg-white rounded-lg p-6 border border-gray-200 min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "in_progress")}
          >
            <ColumnHeader 
              title="In Progress" 
              count={tasksByStatus.in_progress.length} 
              icon={AlertCircle} 
              color="text-blue-600" 
            />
            <div className="space-y-3">
              {tasksByStatus.in_progress.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
              {tasksByStatus.in_progress.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div 
            className="bg-white rounded-lg p-6 border border-gray-200 min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "completed")}
          >
            <ColumnHeader 
              title="Done" 
              count={tasksByStatus.completed.length} 
              icon={Check} 
              color="text-green-600" 
            />
            <div className="space-y-3">
              {tasksByStatus.completed.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
              {tasksByStatus.completed.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Check className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isPending && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Updating task...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
