"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Target,
  UserCheck,
  Loader2
} from "lucide-react"
import { getCurrentUserAction, getUsersByOrgAction } from "@/actions/user"
import { getAITasksByOrgAction, getTaskStatsAction, parseMongoNumber, parseMongoDate } from "@/actions/aiTasks"
import { ClientUser, AITask } from "@/models/types"

export function DashboardOverview() {
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<ClientUser[]>([])
  const [tasks, setTasks] = useState<AITask[]>([])
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    blocked: 0
  })

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const user = await getCurrentUserAction()
        if (!user.success || !user.data?.org_id) {
          return
        }        const [employeesResult, tasksResult, statsResult] = await Promise.all([
          getUsersByOrgAction(user.data.org_id.toString()),
          getAITasksByOrgAction(user.data.org_id.toString()),
          getTaskStatsAction(user.data.org_id.toString())
        ])

        if (employeesResult.success && employeesResult.data) {
          setEmployees(employeesResult.data)
        }

        if (tasksResult.success && tasksResult.data) {
          setTasks(tasksResult.data)
        }

        if (statsResult.success && statsResult.data) {
          setTaskStats(statsResult.data)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])
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

  // Calculate metrics from real data
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + formatDuration(task.estimated_duration_hours), 0)
  const avgWorkload = employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + emp.current_workload, 0) / employees.length) : 0
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' || task.priority === 'critical').length

  const metrics = [
    {
      title: "Total Team Members",
      value: employees.length.toString(),
      change: `${employees.filter(emp => !emp.is_on_leave).length} active`,
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Total Tasks",
      value: taskStats.total.toString(),
      change: `${taskStats.completed} completed`,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "In Progress",
      value: taskStats.in_progress.toString(),
      change: `${taskStats.pending} pending`,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "Avg Team Workload",
      value: `${avgWorkload}%`,
      change: `${totalEstimatedHours}h total`,
      icon: TrendingUp,
      color: "text-purple-400",
    },
  ]

  // Recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5)

  // Team performance data
  const teamPerformance = employees.map(emp => ({
    name: emp.name,
    email: emp.email,
    workload: emp.current_workload,
    performance: emp.performance_rating,
    tasksAssigned: tasks.filter(task => task.assigned_to_email === emp.email).length,
    tasksCompleted: tasks.filter(task => task.assigned_to_email === emp.email && task.status === 'completed').length
  }))
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-white">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-1">Monitor your team's performance and task progress</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="bg-zinc-900/50 border-zinc-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {metric.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className="text-xs text-zinc-500 mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-rose-500" />
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">No tasks found</p>
            ) : (
              recentTasks.map((task, index) => (
                <div key={task.id || index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{task.title}</h4>
                    <p className="text-zinc-400 text-sm truncate max-w-md">{task.description}</p>
                    <p className="text-zinc-500 text-xs">Assigned to: {task.assigned_to_email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">No team members found</p>
            ) : (
              teamPerformance.map((member) => (
                <div key={member.email} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{member.name}</h4>
                    <p className="text-zinc-400 text-sm">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-zinc-300 text-sm">Tasks: {member.tasksCompleted}/{member.tasksAssigned}</p>
                      <p className="text-zinc-500 text-xs">Workload: {member.workload}%</p>
                    </div>
                    <div className="w-16">
                      <Progress value={member.performance} className="h-2" />
                      <p className="text-xs text-zinc-400 mt-1">{member.performance}%</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  function getStatusColor(status: string) {
    switch (status) {
      case "completed": return "text-green-400 bg-green-900/50 border-green-600"
      case "in_progress": return "text-blue-400 bg-blue-900/50 border-blue-600"
      case "pending": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "blocked": return "text-red-400 bg-red-900/50 border-red-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority?.toLowerCase()) {
      case "high": 
      case "critical": return "text-red-400 bg-red-900/50 border-red-600"
      case "medium": return "text-yellow-400 bg-yellow-900/50 border-yellow-600"
      case "low": return "text-green-400 bg-green-900/50 border-green-600"
      default: return "text-gray-400 bg-gray-900/50 border-gray-600"
    }
  }
}
