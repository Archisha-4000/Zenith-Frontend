"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Target,
  Calendar,
  User,
  Trophy,
  Loader2,
  TrendingUp,
  Activity
} from "lucide-react"
import { AITask } from "@/models/types"

interface EmployeeDashboardOverviewProps {
  user?: any
  tasks?: any[]
}

export function EmployeeDashboardOverview({ user, tasks: propTasks }: EmployeeDashboardOverviewProps) {
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<any[]>(propTasks || [])
  const [userEmail, setUserEmail] = useState(user?.email || "")

  useEffect(() => {
    if (propTasks) {
      setTasks(propTasks)
      console.log(`Dashboard Overview - Using ${propTasks.length} tasks from props`)
    }
    if (user?.email) {
      setUserEmail(user.email)
      console.log("Dashboard Overview - User email:", user.email)
    }
  }, [propTasks, user])

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

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'started').length,
    completed: tasks.filter(t => t.status === 'done').length,
    totalHours: tasks.reduce((sum, task) => sum + formatDuration(task.estimated_duration_hours), 0),
    completedHours: tasks.filter(t => t.status === 'done')
                        .reduce((sum, task) => sum + formatDuration(task.estimated_duration_hours), 0)
  }

  const productivity = taskStats.totalHours > 0 ? (taskStats.completedHours / taskStats.totalHours) * 100 : 20
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' || task.priority === 'critical').length
  const recentTasks = tasks
    .sort((a, b) => {
      const dateA = a.created_at instanceof Date ? a.created_at : 
                   (a.created_at && typeof a.created_at === 'object' && '$date' in a.created_at && a.created_at.$date?.$numberLong) ? 
                   new Date(parseInt(a.created_at.$date.$numberLong)) : new Date()
      const dateB = b.created_at instanceof Date ? b.created_at : 
                   (b.created_at && typeof b.created_at === 'object' && '$date' in b.created_at && b.created_at.$date?.$numberLong) ? 
                   new Date(parseInt(b.created_at.$date.$numberLong)) : new Date()
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  const metrics = [
    {
      title: "Total Tasks",
      value: taskStats.total.toString(),
      change: `${taskStats.completed} completed`,
      icon: CheckCircle,
      color: "text-blue-400",
    },
    {
      title: "In Progress",
      value: taskStats.in_progress.toString(),
      change: `${taskStats.pending} pending`,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "High Priority",
      value: highPriorityTasks.toString(),
      change: `${Math.round((highPriorityTasks / Math.max(taskStats.total, 1)) * 100)}% of total`,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      title: "Productivity",
      value: `${Math.round(productivity)}%`,
      change: `${taskStats.completedHours}h completed`,
      icon: TrendingUp,
      color: "text-green-400",
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-1">Track your tasks and productivity</p>
      </div>

      {/* Metrics Grid */}      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="bg-zinc-900/50 border-zinc-700 hover:bg-zinc-900/70 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">
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

      {/* Task Process Flow */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            My Task Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Pending */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-yellow-900/30 border-2 border-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-semibold text-lg">{taskStats.pending}</p>
                <p className="text-zinc-400 text-sm">Pending</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-1 h-0.5 bg-zinc-600 mx-4 relative">
              <div className="absolute -right-2 -top-1 w-0 h-0 border-l-4 border-l-zinc-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>

            {/* In Progress */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-blue-900/30 border-2 border-blue-600 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-semibold text-lg">{taskStats.in_progress}</p>
                <p className="text-zinc-400 text-sm">In Progress</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-1 h-0.5 bg-zinc-600 mx-4 relative">
              <div className="absolute -right-2 -top-1 w-0 h-0 border-l-4 border-l-zinc-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>

            {/* Completed */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-green-900/30 border-2 border-green-600 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-green-400 font-semibold text-lg">{taskStats.completed}</p>
                <p className="text-zinc-400 text-sm">Completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tasks */}
      <Card className="bg-zinc-900/50 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-rose-500" />
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">No tasks assigned yet</p>
            ) : (
              recentTasks.map((task, index) => (
                <div key={task.id || index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{task.title}</h4>
                    <p className="text-zinc-400 text-sm truncate max-w-md">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-500 text-xs">Due: {formatDate(task.due_date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="text-right text-xs text-zinc-400">
                      {formatDuration(task.estimated_duration_hours)}h
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
