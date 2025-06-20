import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FolderOpen, CheckCircle, DollarSign, AlertTriangle, Bot, Link } from "lucide-react"

export function DashboardOverview() {
  const metrics = [
    {
      title: "Total Employees",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Active Projects",
      value: "18",
      change: "+3",
      icon: FolderOpen,
      color: "text-green-400",
    },
    {
      title: "Tasks Assigned Today",
      value: "156",
      change: "+23%",
      icon: CheckCircle,
      color: "text-purple-400",
    },
    {
      title: "Pending Payments",
      value: "$47,230",
      change: "-8%",
      icon: DollarSign,
      color: "text-yellow-400",
    },
  ]

  const projects = [
    { name: "DeFi Protocol V2", team: "Blockchain Core", progress: 78, status: "On Track" },
    { name: "Mobile Wallet App", team: "Frontend Team", progress: 45, status: "Delayed" },
    { name: "Smart Contract Audit", team: "Security Team", progress: 92, status: "Nearly Complete" },
    { name: "API Gateway", team: "Backend Team", progress: 34, status: "In Progress" },
  ]

  const alerts = [
    { type: "warning", message: "AI assignment engine detected workload imbalance in Frontend Team" },
    { type: "info", message: "3 employees have completed blockchain certification" },
    { type: "error", message: "Payment verification failed for 2 transactions" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-zinc-400 mt-1">Monitor your organization's AI-driven blockchain operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-600">
            <Bot className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <Badge variant="outline" className="bg-blue-900/50 text-blue-400 border-blue-600">
            <Link className="w-3 h-3 mr-1" />
            Blockchain Synced
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-zinc-800 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-zinc-400">
                <span className={metric.change.startsWith("+") ? "text-green-400" : "text-red-400"}>
                  {metric.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Project Progress</CardTitle>
            <CardContent className="text-zinc-400">Current status of active projects</CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{project.name}</p>
                    <p className="text-xs text-zinc-400">{project.team}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      project.status === "On Track"
                        ? "bg-green-900/50 text-green-400 border-green-600"
                        : project.status === "Delayed"
                          ? "bg-red-900/50 text-red-400 border-red-800"
                          : project.status === "Nearly Complete"
                            ? "bg-blue-900/50 text-blue-400 border-blue-600"
                            : "bg-yellow-900/50 text-yellow-400 border-yellow-600"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="flex-1" />
                  <span className="text-xs text-zinc-400 w-12">{project.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">System Alerts</CardTitle>
            <CardContent className="text-zinc-400">Recent notifications and system status</CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-700/50">
                <AlertTriangle
                  className={`w-4 h-4 mt-0.5 ${
                    alert.type === "error"
                      ? "text-red-400"
                      : alert.type === "warning"
                        ? "text-yellow-400"
                        : "text-blue-400"
                  }`}
                />
                <p className="text-sm text-zinc-300">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-red-400" />
            AI Optimization Insights
          </CardTitle>
          <CardContent className="text-zinc-400">
            AI-generated recommendations for improving efficiency
          </CardContent>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800">
              <h4 className="font-medium text-blue-400 mb-2">Skill Optimization</h4>
              <p className="text-sm text-zinc-300">
                Consider reassigning 3 React developers to the Mobile Wallet project to accelerate delivery.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-900/20 border border-green-800">
              <h4 className="font-medium text-green-400 mb-2">Resource Efficiency</h4>
              <p className="text-sm text-zinc-300">
                Backend team is operating at 95% efficiency. Consider expanding team for upcoming projects.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-800">
              <h4 className="font-medium text-yellow-400 mb-2">Payment Optimization</h4>
              <p className="text-sm text-zinc-300">
                Implement milestone-based payments to improve cash flow and project completion rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
