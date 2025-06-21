"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Search, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Github,
  Zap,
  TrendingUp,
  Target,
  UserCheck
} from "lucide-react"

// Mock data for team members
const teamMembers = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    role: "Frontend Developer",
    avatar: "AJ",
    activeTasks: 3,
    completedTasks: 12,
    workload: 75,
    status: "active",
    lastActivity: "2 mins ago",
    currentTasks: [
      { id: "TSK001", title: "Dashboard UI Update", status: "in-progress" },
      { id: "TSK002", title: "User Profile Page", status: "pending" },
      { id: "TSK003", title: "Mobile Responsive Fix", status: "in-progress" }
    ]
  },
  {
    id: "EMP002", 
    name: "Bob Chen",
    role: "Backend Developer",
    avatar: "BC",
    activeTasks: 2,
    completedTasks: 18,
    workload: 60,
    status: "active",
    lastActivity: "5 mins ago",
    currentTasks: [
      { id: "TSK004", title: "API Authentication", status: "in-progress" },
      { id: "TSK005", title: "Database Optimization", status: "pending" }
    ]
  },
  {
    id: "EMP003",
    name: "Carol Davis",
    role: "UI/UX Designer", 
    avatar: "CD",
    activeTasks: 1,
    completedTasks: 8,
    workload: 40,
    status: "active",
    lastActivity: "10 mins ago",
    currentTasks: [
      { id: "TSK006", title: "Design System Update", status: "in-progress" }
    ]
  },
  {
    id: "EMP004",
    name: "David Wilson",
    role: "DevOps Engineer",
    avatar: "DW", 
    activeTasks: 2,
    completedTasks: 15,
    workload: 80,
    status: "active",
    lastActivity: "1 hour ago",
    currentTasks: [
      { id: "TSK007", title: "CI/CD Pipeline", status: "in-progress" },
      { id: "TSK008", title: "Server Migration", status: "pending" }
    ]
  },
  {
    id: "EMP005",
    name: "Eva Martinez",
    role: "QA Engineer",
    avatar: "EM",
    activeTasks: 4,
    completedTasks: 22,
    workload: 90,
    status: "active", 
    lastActivity: "30 mins ago",
    currentTasks: [
      { id: "TSK009", title: "Test Automation", status: "in-progress" },
      { id: "TSK010", title: "Bug Verification", status: "in-progress" },
      { id: "TSK011", title: "Performance Testing", status: "pending" },
      { id: "TSK012", title: "Security Audit", status: "pending" }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-progress":
      return "bg-blue-900/20 text-blue-400 border-blue-800"
    case "pending":
      return "bg-yellow-900/20 text-yellow-400 border-yellow-800"
    case "completed":
      return "bg-green-900/20 text-green-400 border-green-800"
    default:
      return "bg-gray-900/20 text-gray-400 border-gray-800"
  }
}

const getWorkloadColor = (workload: number) => {
  if (workload >= 80) return "text-red-400"
  if (workload >= 60) return "text-yellow-400"
  return "text-green-400"
}

export function DashboardOverview() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate team statistics
  const totalTasks = teamMembers.reduce((sum, member) => sum + member.activeTasks, 0)
  const totalCompleted = teamMembers.reduce((sum, member) => sum + member.completedTasks, 0)
  const avgWorkload = Math.round(teamMembers.reduce((sum, member) => sum + member.workload, 0) / teamMembers.length)
  const activeMembers = teamMembers.filter(member => member.status === "active").length

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your team and current projects</p>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Tasks</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
              <Target className="w-8 h-8 text-rose-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{totalCompleted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-white">{activeMembers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg Workload</p>
                <p className={`text-2xl font-bold ${getWorkloadColor(avgWorkload)}`}>{avgWorkload}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Activity className="w-4 h-4 mr-2" />
              View All Activity
            </Button>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  {/* Member Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-rose-800 text-white">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{member.name}</h3>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {member.id}
                    </Badge>
                  </div>

                  {/* Workload Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Workload</span>
                      <span className={`text-sm font-medium ${getWorkloadColor(member.workload)}`}>
                        {member.workload}%
                      </span>
                    </div>
                    <Progress 
                      value={member.workload} 
                      className="h-2 bg-gray-700"
                    />
                  </div>

                  {/* Task Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-400">{member.activeTasks}</p>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-400">{member.completedTasks}</p>
                      <p className="text-xs text-gray-400">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-300">{member.lastActivity}</p>
                      <p className="text-xs text-gray-400">Last Active</p>
                    </div>
                  </div>

                  {/* Current Tasks */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Current Tasks</h4>
                    <div className="space-y-2">
                      {member.currentTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                          <span className="text-sm text-gray-300 truncate flex-1 mr-2">
                            {task.title}
                          </span>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === "in-progress" ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : task.status === "pending" ? (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {task.status.replace("-", " ")}
                          </Badge>
                        </div>
                      ))}
                      {member.currentTasks.length > 3 && (
                        <p className="text-xs text-gray-400 text-center">
                          +{member.currentTasks.length - 3} more tasks
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Github className="w-4 h-4 mr-1" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Zap className="w-4 h-4 mr-1" />
                      Allocate Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
