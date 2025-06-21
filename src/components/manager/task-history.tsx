"use client"

import { useState } from "react"
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
  Eye
} from "lucide-react"

// Mock data for task history
const taskHistory = [
  {
    id: "TSK001",
    title: "Dashboard UI Update",
    description: "Modernize the dashboard interface with new design system",
    assignedTo: "Alice Johnson",
    employeeId: "EMP001",
    status: "completed",
    createdOn: "2024-12-15",
    deadline: "2024-12-20",
    completedOn: "2024-12-19",
    githubIssue: "#123",
    blockchainTxn: "0x1234...abcd",
    priority: "high"
  },
  {
    id: "TSK002", 
    title: "User Profile Page",
    description: "Create user profile management interface",
    assignedTo: "Alice Johnson",
    employeeId: "EMP001",
    status: "in-progress",
    createdOn: "2024-12-18",
    deadline: "2024-12-25",
    completedOn: null,
    githubIssue: "#124",
    blockchainTxn: "0x5678...efgh",
    priority: "medium"
  },
  {
    id: "TSK003",
    title: "API Authentication",
    description: "Implement JWT-based authentication system",
    assignedTo: "Bob Chen", 
    employeeId: "EMP002",
    status: "in-progress",
    createdOn: "2024-12-16",
    deadline: "2024-12-22",
    completedOn: null,
    githubIssue: "#125",
    blockchainTxn: "0x9abc...ijkl",
    priority: "high"
  },
  {
    id: "TSK004",
    title: "Database Migration",
    description: "Migrate from SQLite to PostgreSQL",
    assignedTo: "Bob Chen",
    employeeId: "EMP002", 
    status: "pending",
    createdOn: "2024-12-20",
    deadline: "2024-12-30",
    completedOn: null,
    githubIssue: null,
    blockchainTxn: "0xdef0...mnop",
    priority: "low"
  },
  {
    id: "TSK005",
    title: "Payment Integration",
    description: "Integrate Stripe payment gateway",
    assignedTo: "Carol Davis",
    employeeId: "EMP003",
    status: "completed",
    createdOn: "2024-12-10",
    deadline: "2024-12-18",
    completedOn: "2024-12-17",
    githubIssue: "#126",
    blockchainTxn: "0x1122...qrst",
    priority: "high"
  }
]

export function TaskHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<typeof taskHistory[0] | null>(null)

  const filteredTasks = taskHistory.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-900/50 border-green-600"
      case "in-progress": return "text-blue-400 bg-blue-900/50 border-blue-600"
      case "pending": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "blocked": return "text-red-400 bg-red-900/50 border-red-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-900/50 border-red-600"
      case "medium": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "low": return "text-green-400 bg-green-900/50 border-green-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Task History</h1>
        <p className="text-zinc-400 mt-1">Track previously uploaded tasks and their progress</p>
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
        
        <div className="flex gap-2">
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
            variant={statusFilter === "in-progress" ? "default" : "outline"}
            onClick={() => setStatusFilter("in-progress")}
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
                  <TableHead className="text-zinc-400">Deadline</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className="border-zinc-700">
                    <TableCell className="font-mono text-white">{task.id}</TableCell>
                    <TableCell className="text-white max-w-xs truncate">{task.title}</TableCell>
                    <TableCell className="text-zinc-300">
                      <div>
                        <p>{task.assignedTo}</p>
                        <p className="text-sm text-zinc-500">{task.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.status)}>
                        {task.status}
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
                        {task.deadline}
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
                        {task.githubIssue && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                          >
                            <Github className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Card className="bg-zinc-900/95 border-rose-600 backdrop-blur-sm">
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
                <p className="text-white">{selectedTask.assignedTo} ({selectedTask.employeeId})</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Created On</p>
                <p className="text-white">{selectedTask.createdOn}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Deadline</p>
                <p className="text-white">{selectedTask.deadline}</p>
              </div>
              {selectedTask.completedOn && (
                <div>
                  <p className="text-sm text-zinc-400">Completed On</p>
                  <p className="text-white">{selectedTask.completedOn}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Badge variant="outline" className={getStatusColor(selectedTask.status)}>
                {selectedTask.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Badge>
            </div>

            <div className="text-sm text-zinc-400">
              <p>Blockchain Transaction: <span className="font-mono text-rose-400">{selectedTask.blockchainTxn}</span></p>
              {selectedTask.githubIssue && (
                <p>GitHub Issue: <span className="text-blue-400">{selectedTask.githubIssue}</span></p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
