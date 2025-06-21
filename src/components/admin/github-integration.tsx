import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, GitCommit, GitPullRequest, AlertCircle, ExternalLink, Activity, Code, Users } from "lucide-react"

export function GitHubIntegration() {
  const githubMetrics = {
    connectedEmployees: 45,
    totalRepos: 12,
    activeIssues: 87,
    closedIssues: 234,
    totalCommits: 1456,
    pullRequests: 23,
  }

  const repositories = [
    {
      name: "defi-protocol-v2",
      description: "Next-generation DeFi protocol",
      language: "Solidity",
      stars: 127,
      forks: 34,
      issues: { open: 8, closed: 45 },
      pullRequests: { open: 3, merged: 67 },
      commits: 247,
      contributors: 5,
      lastActivity: "2 hours ago",
      status: "Active",
    },
    {
      name: "mobile-wallet",
      description: "Cross-platform mobile wallet",
      language: "TypeScript",
      stars: 89,
      forks: 21,
      issues: { open: 15, closed: 28 },
      pullRequests: { open: 5, merged: 43 },
      commits: 156,
      contributors: 3,
      lastActivity: "4 hours ago",
      status: "Active",
    },
    {
      name: "smart-contracts",
      description: "Core smart contract library",
      language: "Solidity",
      stars: 203,
      forks: 67,
      issues: { open: 12, closed: 89 },
      pullRequests: { open: 2, merged: 134 },
      commits: 423,
      contributors: 8,
      lastActivity: "1 day ago",
      status: "Stable",
    },
  ]

  const employeeActivity = [
    {
      name: "Anirban Majumder",
      avatar: "/placeholder.svg?height=32&width=32",
      commits: 47,
      pullRequests: 12,
      issuesResolved: 23,
      codeReviews: 18,
      connected: true,
      lastActivity: "1 hour ago",
      contributionScore: 94,
    },
    {
      name: "Nasiruddin Thander",
      avatar: "/placeholder.svg?height=32&width=32",
      commits: 32,
      pullRequests: 8,
      issuesResolved: 15,
      codeReviews: 22,
      connected: true,
      lastActivity: "3 hours ago",
      contributionScore: 87,
    },
    {
      name: "Debarati Seal",
      avatar: "/placeholder.svg?height=32&width=32",
      commits: 28,
      pullRequests: 6,
      issuesResolved: 31,
      codeReviews: 15,
      connected: false,
      lastActivity: "N/A",
      contributionScore: 0,
    },
    {
      name: "Archisha Upadhyaya",
      avatar: "/placeholder.svg?height=32&width=32",
      commits: 19,
      pullRequests: 4,
      issuesResolved: 12,
      codeReviews: 9,
      connected: true,
      lastActivity: "6 hours ago",
      contributionScore: 73,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">GitHub Integration</h1>
          <p className="text-zinc-400 mt-1">Monitor code contributions and repository activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-700">
            <Github className="w-4 h-4 mr-2" />
            Sync Repositories
          </Button>
          <Button className="bg-rose-800 hover:bg-red-700 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open GitHub
          </Button>
        </div>
      </div>

      {/* GitHub Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Connected Users</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{githubMetrics.connectedEmployees}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">OAuth active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{githubMetrics.activeIssues}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-green-400">{githubMetrics.closedIssues} closed</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{githubMetrics.totalCommits}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-blue-400">This month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{githubMetrics.pullRequests}</div>
            <p className="text-xs text-zinc-400">
              <span className="text-purple-400">Open</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repository Overview */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-white" />
              Repository Overview
            </CardTitle>
            <CardContent className="text-zinc-400">Active repositories and their metrics</CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {repositories.map((repo, index) => (
              <div key={index} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      {repo.name}
                      <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </h4>
                    <p className="text-sm text-zinc-400">{repo.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      repo.status === "Active"
                        ? "bg-green-900/50 text-green-400 border-green-600"
                        : "bg-blue-900/50 text-blue-400 border-blue-600"
                    }
                  >
                    {repo.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Issues</span>
                      <span className="text-white">
                        {repo.issues.open}/{repo.issues.open + repo.issues.closed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">PRs</span>
                      <span className="text-white">{repo.pullRequests.open} open</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Commits</span>
                      <span className="text-white">{repo.commits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Contributors</span>
                      <span className="text-white">{repo.contributors}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-600">
                  <Badge variant="outline" className="bg-zinc-600 text-zinc-300 border-zinc-500">
                    <Code className="w-3 h-3 mr-1" />
                    {repo.language}
                  </Badge>
                  <span className="text-xs text-zinc-400">Updated {repo.lastActivity}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Employee GitHub Activity */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Employee Activity
            </CardTitle>
            <CardContent className="text-zinc-400">
              Individual contribution metrics and GitHub integration status
            </CardContent>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeeActivity.map((employee, index) => (
              <div key={index} className="p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-zinc-600 text-white">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{employee.name}</p>
                      <p className="text-xs text-zinc-400">
                        {employee.connected ? `Active ${employee.lastActivity}` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${employee.connected ? "bg-green-500" : "bg-red-500"}`} />
                    <Github className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>

                {employee.connected ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Commits</span>
                          <span className="text-white">{employee.commits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Pull Requests</span>
                          <span className="text-white">{employee.pullRequests}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Issues Resolved</span>
                          <span className="text-white">{employee.issuesResolved}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Code Reviews</span>
                          <span className="text-white">{employee.codeReviews}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Contribution Score</span>
                        <span className="text-xs text-white">{employee.contributionScore}%</span>
                      </div>
                      <Progress value={employee.contributionScore} className="h-1" />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">GitHub integration required</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-zinc-600 border-zinc-500 text-white hover:bg-zinc-600"
                    >
                      Connect GitHub
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
