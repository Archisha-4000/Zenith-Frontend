import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Activity,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react"

export function AIMonitor() {
  const aiMetrics = {
    status: "Active",
    uptime: "99.8%",
    tasksProcessed: 1247,
    tasksQueued: 23,
    efficiency: 94,
    lastUpdate: "2 minutes ago",
  }

  const taskQueue = [
    {
      id: 1,
      task: "Code Review - DeFi Protocol",
      assignedTo: "Alice Johnson",
      priority: "High",
      estimatedTime: "2h 30m",
      skills: ["Solidity", "Security"],
      confidence: 95,
    },
    {
      id: 2,
      task: "UI Component Development",
      assignedTo: "Bob Smith",
      priority: "Medium",
      estimatedTime: "4h 15m",
      skills: ["React", "TypeScript"],
      confidence: 88,
    },
    {
      id: 3,
      task: "Database Optimization",
      assignedTo: "David Wilson",
      priority: "Low",
      estimatedTime: "3h 45m",
      skills: ["PostgreSQL", "Performance"],
      confidence: 92,
    },
  ]

  const aiRecommendations = [
    {
      type: "workload",
      title: "Workload Rebalancing",
      description: "Frontend team is overloaded. Consider reassigning 2 tasks to Backend team.",
      impact: "High",
      action: "Redistribute Tasks",
    },
    {
      type: "skill",
      title: "Skill Gap Identified",
      description: "Need more Rust developers for upcoming blockchain projects.",
      impact: "Medium",
      action: "Hire/Train",
    },
    {
      type: "efficiency",
      title: "Process Optimization",
      description: "Code review process can be streamlined by 30% with automated checks.",
      impact: "Medium",
      action: "Implement Automation",
    },
  ]

  const employeeWorkload = [
    { name: "Alice Johnson", currentLoad: 85, optimalLoad: 75, efficiency: 94 },
    { name: "Bob Smith", currentLoad: 92, optimalLoad: 80, efficiency: 87 },
    { name: "Carol Davis", currentLoad: 68, optimalLoad: 75, efficiency: 96 },
    { name: "David Wilson", currentLoad: 45, optimalLoad: 70, efficiency: 91 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assignment Engine</h1>
          <p className="text-zinc-400 mt-1">Monitor and control the AI-driven task distribution system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
            <Settings className="w-4 h-4 mr-2" />
            Configure AI
          </Button>
          <Button className="bg-red-800 hover:bg-red-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Force Rebalance
          </Button>
        </div>
      </div>

      {/* AI Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">AI Status</CardTitle>
            <Bot className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{aiMetrics.status}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">Uptime: {aiMetrics.uptime}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Tasks Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{aiMetrics.tasksProcessed}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-blue-400">+{aiMetrics.tasksQueued} in queue</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{aiMetrics.efficiency}%</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">+2.3%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Last Update</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Live</div>
            <p className="text-xs text-zinc-400">Updated {aiMetrics.lastUpdate}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Task Queue */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Current Task Queue
            </CardTitle>
            <p className="text-zinc-400 text-sm">AI-assigned tasks waiting for execution</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskQueue.map((task) => (
              <div key={task.id} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.task}</h4>
                    <p className="text-sm text-zinc-400">Assigned to: {task.assignedTo}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "High"
                        ? "bg-red-900/50 text-red-400 border-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-900/50 text-yellow-400 border-yellow-600"
                          : "bg-green-900/50 text-green-400 border-green-600"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Est. Time: {task.estimatedTime}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">AI Confidence:</span>
                    <span className="text-white font-medium">{task.confidence}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-zinc-600 text-zinc-300 border-zinc-500 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              AI Recommendations
            </CardTitle>
            <p className="text-zinc-400 text-sm">Optimization suggestions from the AI engine</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{rec.title}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{rec.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      rec.impact === "High"
                        ? "bg-red-900/50 text-red-400 border-red-800"
                        : "bg-yellow-900/50 text-yellow-400 border-yellow-600"
                    }
                  >
                    {rec.impact} Impact
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-zinc-600 border-zinc-500 text-white hover:bg-zinc-600 mt-2"
                >
                  {rec.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Employee Workload Analysis */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Employee Workload Analysis
          </CardTitle>
          <p className="text-zinc-400 text-sm">
            AI-analyzed workload distribution and efficiency metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {employeeWorkload.map((employee, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{employee.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-400">
                      Efficiency: <span className="text-white">{employee.efficiency}%</span>
                    </span>
                    <span className="text-zinc-400">
                      Load: <span className="text-white">{employee.currentLoad}%</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Current Workload</span>
                    <span>Optimal: {employee.optimalLoad}%</span>
                  </div>
                  <Progress value={employee.currentLoad} className="h-2" />
                  {employee.currentLoad > employee.optimalLoad && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Overloaded by {employee.currentLoad - employee.optimalLoad}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
