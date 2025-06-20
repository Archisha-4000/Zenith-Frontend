import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Users, Clock, Target, Zap, Award } from "lucide-react"

export function Analytics() {
  const performanceMetrics = {
    overallEfficiency: 87,
    taskCompletionRate: 94,
    averageTaskTime: "4.2 hours",
    employeeSatisfaction: 91,
    projectSuccessRate: 89,
    aiAccuracy: 96,
  }

  const teamEfficiency = [
    { team: "Blockchain Core", efficiency: 94, trend: "up", projects: 3, members: 8 },
    { team: "Frontend Team", efficiency: 82, trend: "down", projects: 2, members: 5 },
    { team: "Backend Team", efficiency: 91, trend: "up", projects: 4, members: 6 },
    { team: "Security Team", efficiency: 96, trend: "up", projects: 2, members: 3 },
    { team: "DevOps", efficiency: 88, trend: "stable", projects: 1, members: 2 },
  ]

  const skillDemand = [
    { skill: "Solidity", demand: 95, supply: 70, gap: 25 },
    { skill: "React", demand: 85, supply: 90, gap: -5 },
    { skill: "Node.js", demand: 80, supply: 85, gap: -5 },
    { skill: "Python", demand: 75, supply: 60, gap: 15 },
    { skill: "Security Auditing", demand: 90, supply: 45, gap: 45 },
    { skill: "DevOps", demand: 70, supply: 40, gap: 30 },
  ]

  const projectHealth = [
    {
      project: "DeFi Protocol V2",
      health: 92,
      velocity: "High",
      blockers: 1,
      onTime: true,
      budget: 95,
    },
    {
      project: "Mobile Wallet",
      health: 67,
      velocity: "Medium",
      blockers: 3,
      onTime: false,
      budget: 78,
    },
    {
      project: "Smart Contract Audit",
      health: 98,
      velocity: "High",
      blockers: 0,
      onTime: true,
      budget: 102,
    },
    {
      project: "API Gateway",
      health: 74,
      velocity: "Low",
      blockers: 2,
      onTime: true,
      budget: 88,
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-400"
    if (health >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
          <p className="text-zinc-400 mt-1">Comprehensive performance metrics and organizational insights</p>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Overall Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performanceMetrics.overallEfficiency}%</div>
            <Progress value={performanceMetrics.overallEfficiency} className="mt-2" />
            <p className="text-xs text-zinc-400 mt-2">
              <span className="text-green-400">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Task Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performanceMetrics.taskCompletionRate}%</div>
            <Progress value={performanceMetrics.taskCompletionRate} className="mt-2" />
            <p className="text-xs text-zinc-400 mt-2">
              <span className="text-green-400">+1.8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">AI Accuracy</CardTitle>
            <Zap className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{performanceMetrics.aiAccuracy}%</div>
            <Progress value={performanceMetrics.aiAccuracy} className="mt-2" />
            <p className="text-xs text-zinc-400 mt-2">
              <span className="text-green-400">+0.5%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Efficiency */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Team Efficiency
            </CardTitle>
            <CardContent className="text-zinc-400">Performance metrics by team</CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamEfficiency.map((team, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{team.team}</span>
                    {getTrendIcon(team.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-zinc-400">{team.members} members</span>
                    <span className="text-zinc-400">{team.projects} projects</span>
                    <span className="text-white font-medium">{team.efficiency}%</span>
                  </div>
                </div>
                <Progress value={team.efficiency} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skill Demand vs Supply */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Skill Demand Analysis
            </CardTitle>
            <CardContent className="text-zinc-400">Current skill gaps and market demand</CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillDemand.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{skill.skill}</span>
                  <Badge
                    variant="outline"
                    className={
                      skill.gap > 20
                        ? "bg-red-900/50 text-red-400 border-red-800"
                        : skill.gap > 0
                          ? "bg-yellow-900/50 text-yellow-400 border-yellow-600"
                          : "bg-green-900/50 text-green-400 border-green-600"
                    }
                  >
                    {skill.gap > 0 ? `+${skill.gap}% gap` : "Surplus"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Demand</span>
                    <span>{skill.demand}%</span>
                  </div>
                  <Progress value={skill.demand} className="h-1" />
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Supply</span>
                    <span>{skill.supply}%</span>
                  </div>
                  <Progress value={skill.supply} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Project Health Dashboard */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Project Health Dashboard
          </CardTitle>
          <CardContent className="text-zinc-400">
            Comprehensive project performance and risk assessment
          </CardContent>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectHealth.map((project, index) => (
              <div key={index} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white">{project.project}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-zinc-600 text-zinc-300 border-zinc-600">
                        {project.velocity} Velocity
                      </Badge>
                      {project.onTime ? (
                        <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-600">
                          On Time
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-900/50 text-red-400 border-red-800">
                          Delayed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getHealthColor(project.health)}`}>{project.health}%</div>
                    <p className="text-xs text-zinc-400">Health Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Project Health</span>
                      <span className="text-white">{project.health}%</span>
                    </div>
                    <Progress value={project.health} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Budget Utilization</span>
                      <span className="text-white">{project.budget}%</span>
                    </div>
                    <Progress value={project.budget} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-zinc-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-400">Blockers</span>
                    </div>
                    <span className={`font-medium ${project.blockers > 0 ? "text-red-400" : "text-green-400"}`}>
                      {project.blockers}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
