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
  Eye,
  MoreVertical
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
    email: "alice.johnson@company.com",
    skills: ["React", "TypeScript", "CSS"],
    performance: 92,
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
    email: "bob.chen@company.com",
    skills: ["Node.js", "Python", "MongoDB"],
    performance: 89,
    currentTasks: [
      { id: "TSK004", title: "API Authentication", status: "in-progress" },
      { id: "TSK005", title: "Database Migration", status: "pending" }
    ]
  },
  {
    id: "EMP003",
    name: "Carol Davis", 
    role: "Full Stack Developer",
    avatar: "CD",
    activeTasks: 4,
    completedTasks: 15,
    workload: 85,
    status: "busy",
    lastActivity: "1 hour ago",
    email: "carol.davis@company.com",
    skills: ["React", "Node.js", "PostgreSQL"],
    performance: 95,
    currentTasks: [
      { id: "TSK006", title: "Payment Integration", status: "in-progress" },
      { id: "TSK007", title: "Email Service Setup", status: "pending" },
      { id: "TSK008", title: "Bug Fixes", status: "in-progress" },
      { id: "TSK009", title: "Performance Optimization", status: "pending" }
    ]
  },
  {
    id: "EMP004",
    name: "David Kim",
    role: "DevOps Engineer", 
    avatar: "DK",
    activeTasks: 2,
    completedTasks: 20,
    workload: 50,
    status: "active",
    lastActivity: "30 mins ago",
    email: "david.kim@company.com",
    skills: ["Docker", "AWS", "Kubernetes"],
    performance: 88,
    currentTasks: [
      { id: "TSK010", title: "CI/CD Pipeline", status: "in-progress" },
      { id: "TSK011", title: "Server Monitoring", status: "pending" }
    ]
  },
  {
    id: "EMP005",
    name: "Emma Wilson",
    role: "UI/UX Designer",
    avatar: "EW",
    activeTasks: 1,
    completedTasks: 8,
    workload: 40,
    status: "active",
    lastActivity: "15 mins ago",
    email: "emma.wilson@company.com",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    performance: 91,
    currentTasks: [
      { id: "TSK012", title: "Design System Update", status: "in-progress" }
    ]
  }
]

export function TeamOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-400"
      case "busy": return "bg-yellow-400"
      case "offline": return "bg-gray-400"
      default: return "bg-gray-400"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400"
      case "busy": return "text-yellow-400"
      case "offline": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return "text-red-400"
    if (workload >= 60) return "text-yellow-400"
    return "text-green-400"
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-400"
    if (performance >= 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Overview</h2>
          <p className="text-gray-400 mt-1">Monitor your team's workload and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300">AI Allocation Active</span>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/50 border-gray-800 text-white"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {teamMembers.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {teamMembers.filter(m => m.status === 'busy').length}
            </div>
            <div className="text-sm text-gray-400">Busy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">
              {teamMembers.reduce((sum, member) => sum + member.activeTasks, 0)}
            </div>
            <div className="text-sm text-gray-400">Tasks</div>
          </div>
        </div>
      </div>

      {/* Team Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Active Tasks</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Workload</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Performance</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Last Activity</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                      index === filteredMembers.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Employee */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-700 text-white text-sm">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-gray-900 ${getStatusColor(member.status)}`}></div>
                        </div>
                        <div>
                          <div className="font-medium text-white">{member.name}</div>
                          <div className="text-sm text-gray-400">{member.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <div className="text-white">{member.role}</div>
                      <div className="text-sm text-gray-400">
                        {member.skills.slice(0, 2).join(', ')}
                        {member.skills.length > 2 && ` +${member.skills.length - 2}`}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <Badge className={`${getStatusTextColor(member.status)} bg-transparent border-current`}>
                        {member.status}
                      </Badge>
                    </td>

                    {/* Active Tasks */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{member.activeTasks}</span>
                        <span className="text-gray-400 text-sm">/ {member.completedTasks} total</span>
                      </div>
                    </td>

                    {/* Workload */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16">
                          <Progress value={member.workload} className="h-2" />
                        </div>
                        <span className={`text-sm font-medium ${getWorkloadColor(member.workload)}`}>
                          {member.workload}%
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="p-4">
                      <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                        {member.performance}%
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">{member.lastActivity}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedEmployee(selectedEmployee === member.id ? null : member.id)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Employee Details */}
      {selectedEmployee && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              Current Tasks - {teamMembers.find(m => m.id === selectedEmployee)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers
                .find(m => m.id === selectedEmployee)
                ?.currentTasks.map((task) => (
                  <div key={task.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{task.id}</span>
                      <Badge 
                        className={
                          task.status === 'completed' ? 'bg-green-900/20 text-green-400 border-green-800' :
                          task.status === 'in-progress' ? 'bg-blue-900/20 text-blue-400 border-blue-800' :
                          task.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' :
                          'bg-gray-900/20 text-gray-400 border-gray-800'
                        }
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{task.title}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
