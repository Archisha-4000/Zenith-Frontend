"use client"
import { useState, useTransition, useMemo } from "react"
import { updateEmployeeTaskStatusAction } from "@/actions/task"
import {
  UserIcon,
  Target,
  Activity,
  Search,
  Timer,
  CheckCircle2,
  Circle,
  PlayCircle,
  Zap,
  BarChart3,
  ArrowUp,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Task {
  _id: string
  id?: any
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  estimated_duration_hours: number | { $numberInt: string }
  due_date: string | { $date: { $numberLong: string } }
  status: "pending" | "in_progress" | "completed"
  assigned_to: string
  assigned_to_email: string
  created_by_agent: string
  org_id: string
  additional_details?: string
  created_at: string | { $date: { $numberLong: string } }
  updated_at?: any
  allocation_id: string
}

interface EmployeeDashboardProps {
  user: any
  tasks: Task[]
}

const priorityConfig = {
  low: {
    color: "bg-emerald-500 border-emerald-400",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: Circle,
    label: "Low",
  },
  medium: {
    color: "bg-amber-500 border-amber-400",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Minus,
    label: "Medium",
  },
  high: {
    color: "bg-orange-500 border-orange-400",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    icon: ArrowUp,
    label: "High",
  },
  critical: {
    color: "bg-red-500 border-red-400",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: Zap,
    label: "Critical",
  },
}

const statusConfig = {
  pending: {
    color: "bg-slate-400",
    label: "To Do",
    icon: Circle,
  },
  in_progress: {
    color: "bg-blue-500",
    label: "In Progress",
    icon: PlayCircle,
  },
  completed: {
    color: "bg-emerald-500",
    label: "Done",
    icon: CheckCircle2,
  },
}

export function EmployeeDashboard({ user, tasks }: EmployeeDashboardProps) {
  const [isPending, startTransition] = useTransition()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek
    return new Date(today.setDate(diff))
  })

  const formatDate = (dateValue: string | { $date: { $numberLong: string } }) => {
    if (typeof dateValue === "string") {
      return new Date(dateValue)
    } else if (dateValue && typeof dateValue === "object" && dateValue.$date) {
      return new Date(Number.parseInt(dateValue.$date.$numberLong))
    }
    return new Date()
  }

  const getDurationHours = (duration: number | { $numberInt: string }) => {
    if (typeof duration === "number") {
      return duration
    } else if (duration && typeof duration === "object" && duration.$numberInt) {
      return Number.parseInt(duration.$numberInt)
    }
    return 0
  }

  const getTaskStats = () => {
    const pending = tasks.filter((t) => t.status === "pending").length
    const inProgress = tasks.filter((t) => t.status === "in_progress").length
    const completed = tasks.filter((t) => t.status === "completed").length
    const totalHours = tasks.reduce((acc, task) => acc + getDurationHours(task.estimated_duration_hours), 0)
    const completedHours = tasks
      .filter((t) => t.status === "completed")
      .reduce((acc, task) => acc + getDurationHours(task.estimated_duration_hours), 0)

    return {
      pending,
      inProgress,
      completed,
      total: tasks.length,
      totalHours,
      completedHours,
      productivity: totalHours > 0 ? (completedHours / totalHours) * 100 : 0,
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: "pending" | "in_progress" | "completed") => {
    startTransition(async () => {
      try {
        const result = await updateEmployeeTaskStatusAction(taskId, newStatus)
        if (!result.success) {
          console.error("Failed to update task status:", result.error)
        }
      } catch (error) {
        console.error("Error updating task status:", error)
      }
    })
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesPriority && matchesSearch
    })
  }, [tasks, filterStatus, filterPriority, searchQuery])

  // Generate timeline dates (2 weeks view)
  const timelineDates = useMemo(() => {
    const dates = []
    const startDate = new Date(currentWeekStart)
    for (let i = 0; i < 14; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [currentWeekStart])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeekStart(newDate)
  }

  const getTaskTimelinePosition = (task: Task) => {
    const createdDate = formatDate(task.created_at)
    const dueDate = formatDate(task.due_date)
    const duration = getDurationHours(task.estimated_duration_hours)

    // Calculate start and end positions relative to timeline
    const timelineStart = timelineDates[0]
    const timelineEnd = timelineDates[timelineDates.length - 1]

    const taskStart = createdDate < timelineStart ? timelineStart : createdDate
    const taskEnd = dueDate > timelineEnd ? timelineEnd : dueDate

    // Calculate position as percentage
    const totalTimelineWidth = timelineEnd.getTime() - timelineStart.getTime()
    const taskStartOffset = taskStart.getTime() - timelineStart.getTime()
    const taskDuration = taskEnd.getTime() - taskStart.getTime()

    const leftPercent = (taskStartOffset / totalTimelineWidth) * 100
    const widthPercent = (taskDuration / totalTimelineWidth) * 100

    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.min(100 - Math.max(0, leftPercent), widthPercent)}%`,
      isVisible: taskEnd >= timelineStart && taskStart <= timelineEnd,
    }
  }

  const stats = getTaskStats()

  const GanttTaskRow = ({ task, index }: { task: Task; index: number }) => {
    const timelinePosition = getTaskTimelinePosition(task)
    const PriorityIcon = priorityConfig[task.priority].icon

    return (
      <div
        className={`grid grid-cols-[300px_1fr] border-b border-slate-200 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
      >
        {/* Task Info Column */}
        <div className="p-4 border-r border-slate-200 flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${statusConfig[task.status].color}`}></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <PriorityIcon className={`w-3 h-3 ${priorityConfig[task.priority].textColor}`} />
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig[task.priority].bgColor} ${priorityConfig[task.priority].textColor} font-medium`}
              >
                {priorityConfig[task.priority].label}
              </span>
            </div>
            <h3 className="font-semibold text-sm text-slate-900 truncate" title={task.title}>
              {task.title}
            </h3>
            <p className="text-xs text-slate-600 truncate" title={task.description}>
              {task.description}
            </p>
            <div className="flex items-center space-x-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center">
                <Timer className="w-3 h-3 mr-1" />
                {getDurationHours(task.estimated_duration_hours)}h
              </span>
              <span className="flex items-center">
                <UserIcon className="w-3 h-3 mr-1" />
                {task.created_by_agent}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Column */}
        <div className="relative p-4 min-h-[80px] flex items-center">
          {timelinePosition.isVisible && (
            <div
              className={`absolute h-6 rounded-full ${statusConfig[task.status].color} opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-sm`}
              style={{
                left: timelinePosition.left,
                width: timelinePosition.width,
                minWidth: "20px",
              }}
              title={`${task.title} - ${statusConfig[task.status].label}`}
            >
              <div className="absolute inset-0 rounded-full bg-white/20"></div>
            </div>
          )}

          {/* Task action buttons - show on hover */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            {task.status !== "pending" && (
              <button
                onClick={() => handleStatusChange(task._id, "pending")}
                disabled={isPending}
                className="px-2 py-1 text-xs bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors disabled:opacity-50"
                title="Move to To Do"
              >
                To Do
              </button>
            )}
            {task.status !== "in_progress" && (
              <button
                onClick={() => handleStatusChange(task._id, "in_progress")}
                disabled={isPending}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="Start Progress"
              >
                Start
              </button>
            )}
            {task.status !== "completed" && (
              <button
                onClick={() => handleStatusChange(task._id, "completed")}
                disabled={isPending}
                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors disabled:opacity-50"
                title="Mark Done"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-black border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Hello!</h1>
                <p className="text-slate-600 text-sm">
                  Welcome back, <span className="font-semibold text-slate-900">{user.name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="text-slate-600">
                  Role: <span className="text-slate-900 font-medium">{user.role}</span>
                </p>
                <p className="text-slate-600">
                  ID: <span className="text-slate-900 font-medium">{user.employee_id}</span>
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6 bg-white border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Completed</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Productivity</p>
                <p className="text-2xl font-bold text-purple-900">{Math.round(stats.productivity)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-black border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white">
        {/* Timeline Header */}
        <div className="grid grid-cols-[300px_1fr] border-b border-slate-300 bg-slate-100">
          <div className="p-4 border-r border-slate-300 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Tasks</h3>
            <div className="flex items-center space-x-2">
              <button onClick={() => navigateWeek("prev")} className="p-1 hover:bg-slate-200 rounded transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button onClick={() => navigateWeek("next")} className="p-1 hover:bg-slate-200 rounded transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-14 border-r border-slate-300">
            {timelineDates.map((date, index) => (
              <div key={index} className="p-2 text-center border-r border-slate-200 last:border-r-0">
                <div className="text-xs text-slate-600 font-medium">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
                <div className="text-sm font-semibold text-slate-900">{date.getDate()}</div>
                <div className="text-xs text-slate-500">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div className="max-h-[600px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No tasks found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="group">
              {filteredTasks.map((task, index) => (
                <div key={task._id} className="group">
                  <GanttTaskRow task={task} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-lg border border-slate-200">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-slate-700 font-medium">Updating task...</span>
          </div>
        </div>
      )}
    </div>
  )
}
