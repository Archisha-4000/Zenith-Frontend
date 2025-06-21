"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  History, 
  Search, 
  Filter, 
  ExternalLink,
  Github,
  Calendar,
  User,
  Eye,
  Loader2
} from "lucide-react"
import { getCurrentUserAction } from "@/actions/user"
import { getAITasksByOrgAction } from "@/actions/aiTasks"
import { AITask } from "@/models/types"

export function TaskHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<AITask[]>([])

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true)
        const user = await getCurrentUserAction()
        if (!user.success || !user.data?.org_id) {
          return
        }

        const tasksResult = await getAITasksByOrgAction(user.data.org_id.toString())
        if (tasksResult.success && tasksResult.data) {
          setTasks(tasksResult.data)
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigned_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assigned_to_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDuration = (hours: any): number => {
    if (!hours) return 0
    if (typeof hours === 'number') return hours
    if (typeof hours === 'object') {
      if (hours.$numberInt) return parseInt(hours.$numberInt)
      if (hours.$numberLong) return parseInt(hours.$numberLong)
      if (hours.$numberDouble) return parseFloat(hours.$numberDouble)
    }
    return 0
  }

  const formatDate = (date: any): string => {
    if (!date) return 'Not set'
    let dateObj: Date
    
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'object' && date.$date) {
      if (date.$date.$numberLong) {
        dateObj = new Date(parseInt(date.$date.$numberLong))
      } else {
        dateObj = new Date(date.$date)
      }
    } else {
      dateObj = new Date(date)
    }
    
    return dateObj.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-900/50 border-green-600"
      case "in_progress": return "text-blue-400 bg-blue-900/50 border-blue-600"
      case "pending": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "blocked": return "text-red-400 bg-red-900/50 border-red-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": 
      case "critical": return "text-red-400 bg-red-900/50 border-red-600"
      case "medium": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "low": return "text-green-400 bg-green-900/50 border-green-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-white">Loading task history...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Task History</h1>
        <p className="text-zinc-400 mt-1">Track previously uploaded tasks and their progress</p>
      <div className="flex flex-col sm:flex-row gap-4 flex gap-2 items-end justify-end">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "in_progress" ? "default" : "outline"}
            onClick={() => setStatusFilter("in_progress")}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            onClick={() => setStatusFilter("completed")}
            className="bg-zinc-800 text-white border-zinc-700"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search tasks, employees, or task IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-700 text-white"
          />
        </div>
      </div>

      {/* Task Table */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5 text-rose-500" />
            Task History ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700">
                  <TableHead className="text-zinc-400">Task ID</TableHead>
                  <TableHead className="text-zinc-400">Title</TableHead>
                  <TableHead className="text-zinc-400">Assigned To</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Priority</TableHead>
                  <TableHead className="text-zinc-400">Due Date</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-zinc-400 py-8">
                      No tasks found
                    </TableCell>
                  </TableRow>                ) : (
                  filteredTasks.map((task, index) => (
                    <TableRow key={task.id || index} className="border-zinc-700">
                      <TableCell className="font-mono text-white">
                        {task.id || `Task-${index + 1}`}
                      </TableCell>
                      <TableCell className="text-white max-w-[120px] text-[15px]">
                        <span title={task.title}>
                          {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-300 max-w-[100px] text-[15px]">
                        <div>
                          <span title={task.assigned_to_email}>
                            {task.assigned_to_email.length > 10 ? `${task.assigned_to_email.substring(0, 10)}...` : task.assigned_to_email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(task.due_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTask(task)}
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          />
          
          {/* Modal Content */}
          <Card className="relative bg-zinc-800 border-zinc-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">{selectedTask.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-300">{selectedTask.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Assigned To</p>
                  <p className="text-white">{selectedTask.assigned_to}</p>
                  <p className="text-sm text-zinc-500">{selectedTask.assigned_to_email}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Created By</p>
                  <p className="text-white">{selectedTask.created_by_agent}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Estimated Hours</p>
                  <p className="text-white">{formatDuration(selectedTask.estimated_duration_hours)}h</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Due Date</p>
                  <p className="text-white">{formatDate(selectedTask.due_date)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Badge variant="outline" className={getStatusColor(selectedTask.status)}>
                  {selectedTask.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>

              {selectedTask.additional_details && (
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Additional Details</p>
                  <p className="text-zinc-300 bg-zinc-800/50 p-3 rounded-lg">
                    {selectedTask.additional_details}
                  </p>
                </div>
              )}

              <div className="text-sm text-zinc-400 space-y-1">
                <p>Created by: <span className="text-rose-400">{selectedTask.created_by_agent}</span></p>
                <p>Organization: <span className="font-mono text-rose-400">{selectedTask.org_id}</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
