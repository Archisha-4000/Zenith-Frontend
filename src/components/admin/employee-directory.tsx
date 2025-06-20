"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, UserPlus, Crown, Activity, Github, Shield } from "lucide-react"

export function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState("")

  const employees = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "Senior Developer",
      department: "Blockchain Core",
      skills: ["Solidity", "React", "Node.js"],
      workload: 85,
      status: "Active",
      githubConnected: true,
      blockchainVerified: true,
      tasksCompleted: 47,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@company.com",
      role: "Project Manager",
      department: "Frontend Team",
      skills: ["Management", "Agile", "React"],
      workload: 70,
      status: "Active",
      githubConnected: true,
      blockchainVerified: true,
      tasksCompleted: 23,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@company.com",
      role: "Security Analyst",
      department: "Security Team",
      skills: ["Security", "Auditing", "Python"],
      workload: 92,
      status: "Active",
      githubConnected: false,
      blockchainVerified: true,
      tasksCompleted: 31,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      role: "Backend Developer",
      department: "Backend Team",
      skills: ["Node.js", "PostgreSQL", "Docker"],
      workload: 45,
      status: "Available",
      githubConnected: true,
      blockchainVerified: false,
      tasksCompleted: 18,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Directory</h1>
          <p className="text-zinc-400 mt-1">Manage employees, assign roles, and monitor performance</p>
        </div>
        <Button className="bg-rose-800 hover:bg-red-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search employees by name, department, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-700 border-zinc-600 text-white"
              />
            </div>
            <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
          <CardContent className="text-zinc-400">{filteredEmployees.length} employees found</CardContent>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700">
                <TableHead className="text-zinc-400">Employee</TableHead>
                <TableHead className="text-zinc-400">Department</TableHead>
                <TableHead className="text-zinc-400">Skills</TableHead>
                <TableHead className="text-zinc-400">Workload</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Integrations</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="border-zinc-700">
                  <TableCell>
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
                        <p className="text-sm text-zinc-400">{employee.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-500">
                          {skill}
                        </Badge>
                      ))}
                      {employee.skills.length > 2 && (
                        <Badge variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-500">
                          +{employee.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-zinc-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            employee.workload > 80
                              ? "bg-red-500"
                              : employee.workload > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${employee.workload}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-300">{employee.workload}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        employee.status === "Active"
                          ? "bg-green-900/50 text-green-400 border-green-600"
                          : "bg-blue-900/50 text-blue-400 border-blue-600"
                      }
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${employee.githubConnected ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <Github className="w-4 h-4 text-zinc-400" />
                      <div
                        className={`w-2 h-2 rounded-full ${employee.blockchainVerified ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <Shield className="w-4 h-4 text-zinc-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-700 border-zinc-600">
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">
                          <Crown className="w-4 h-4 mr-2" />
                          Promote to Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-600">Assign Tasks</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-900/50">Remove Access</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
