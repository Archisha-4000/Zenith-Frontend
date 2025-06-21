import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Calendar, Users, GitBranch, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

export function ProjectTracker() {
  const projects = [
    {
      id: 1,
      name: "DeFi Protocol V2",
      description: "Next-generation decentralized finance protocol with enhanced security",
      team: "Blockchain Core",
      manager: "Anirban Majumder",
      progress: 78,
      status: "On Track",
      priority: "High",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      githubRepo: "defi-protocol-v2",
      commits: 247,
      issues: { open: 8, closed: 45 },
      teamMembers: [
        { name: "Anirban Majumder", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Nasiruddin Thander", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Debarati Seal", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      blockchainTasks: 23,
      completedTasks: 18,
    },
    {
      id: 2,
      name: "Mobile Wallet App",
      description: "Cross-platform mobile application for cryptocurrency management",
      team: "Frontend Team",
      manager: "Nasiruddin Thander",
      progress: 45,
      status: "Delayed",
      priority: "Medium",
      startDate: "2024-02-01",
      endDate: "2024-04-15",
      githubRepo: "mobile-wallet",
      commits: 156,
      issues: { open: 15, closed: 28 },
      teamMembers: [
        { name: "Nasiruddin Thander", avatar: "/placeholder.svg?height=32&width=32" },
        { name: "Archisha Upadhyaya", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      blockchainTasks: 18,
      completedTasks: 8,
    },
    {
      id: 3,
      name: "Smart Contract Audit",
      description: "Comprehensive security audit of all smart contracts",
      team: "Security Team",
      manager: "Debarati Seal",
      progress: 92,
      status: "Nearly Complete",
      priority: "Critical",
      startDate: "2024-01-01",
      endDate: "2024-02-28",
      githubRepo: "contract-audit",
      commits: 89,
      issues: { open: 2, closed: 67 },
      teamMembers: [{ name: "Debarati Seal", avatar: "/placeholder.svg?height=32&width=32" }],
      blockchainTasks: 15,
      completedTasks: 14,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-900/50 text-green-400 border-green-600"
      case "Delayed":
        return "bg-red-900/50 text-red-400 border-rose-800"
      case "Nearly Complete":
        return "bg-blue-900/50 text-blue-400 border-blue-600"
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-900/50 text-red-400 border-rose-800"
      case "High":
        return "bg-orange-900/50 text-orange-400 border-orange-600"
      case "Medium":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-600"
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Tracker</h1>
          <p className="text-zinc-400 mt-1">Monitor project progress and team performance</p>
        </div>
        <Button className="bg-rose-800 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                  <CardContent className="text-zinc-400 mt-1">{project.description}</CardContent>
                </div>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Progress</span>
                  <span className="text-sm text-white font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Status and Team */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status === "On Track" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {project.status === "Delayed" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {project.status === "Nearly Complete" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {project.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-400">{project.team}</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Team Members</span>
                <div className="flex items-center gap-2">
                  {project.teamMembers.map((member, index) => (
                    <Avatar key={index} className="w-6 h-6">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-zinc-600 text-white text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <span className="text-xs text-zinc-400 ml-1">+{project.teamMembers.length} members</span>
                </div>
              </div>

              {/* GitHub Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-700">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-zinc-400" />
                    <span className="text-xs text-zinc-400">Commits</span>
                  </div>
                  <p className="text-sm font-medium text-white">{project.commits}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-zinc-400" />
                    <span className="text-xs text-zinc-400">Issues</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {project.issues.closed}/{project.issues.open + project.issues.closed}
                  </p>
                </div>
              </div>

              {/* Blockchain Tasks */}
              <div className="space-y-2 pt-2 border-t border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Blockchain Tasks</span>
                  <span className="text-xs text-white">
                    {project.completedTasks}/{project.blockchainTasks}
                  </span>
                </div>
                <Progress value={(project.completedTasks / project.blockchainTasks) * 100} className="h-1" />
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-700">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
