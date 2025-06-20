"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Search,
  Download,
  User,
  CreditCard,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  Target,
  MoreHorizontal,
} from "lucide-react"

export function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const activityLogs = [
    {
      id: 1,
      timestamp: "2024-01-22 15:30:25",
      user: "Admin User",
      action: "Payment Processed",
      target: "Alice Johnson - $8,500",
      type: "payment",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "Milestone payment for DeFi Protocol V2",
      blockchainHash: "0x1a2b3c4d5e6f7890",
    },
    {
      id: 2,
      timestamp: "2024-01-22 14:45:18",
      user: "Admin User",
      action: "Employee Role Updated",
      target: "Bob Smith - Promoted to Senior Manager",
      type: "user_management",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "Role changed from Manager to Senior Manager",
      blockchainHash: null,
    },
    {
      id: 3,
      timestamp: "2024-01-22 13:20:42",
      user: "AI System",
      action: "Task Assignment",
      target: "Carol Davis - Security Audit Task",
      type: "ai_assignment",
      status: "success",
      ipAddress: "system",
      details: "AI assigned security audit task based on skill match (95% confidence)",
    },
    {
      id: 4,
      timestamp: "2024-01-22 12:15:33",
      user: "Admin User",
      action: "Smart Contract Deployed",
      target: "PaymentProcessor v2.1",
      type: "blockchain",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "New payment processor contract deployed to mainnet",
    },
    {
      id: 5,
      timestamp: "2024-01-22 11:30:15",
      user: "Admin User",
      action: "Payment Failed",
      target: "David Wilson - $4,500",
      type: "payment",
      status: "error",
      ipAddress: "192.168.1.100",
      details: "Insufficient gas for transaction",
    },
    {
      id: 6,
      timestamp: "2024-01-22 10:45:28",
      user: "Admin User",
      action: "Project Created",
      target: "Mobile Wallet v3.0",
      type: "user_management",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "New project created with 5 team members assigned",
    },
    {
      id: 7,
      timestamp: "2024-01-22 09:20:45",
      user: "System",
      action: "Backup Completed",
      target: "Database & Blockchain State",
      type: "system",
      status: "success",
      ipAddress: "system",
      details: "Automated daily backup completed successfully",
    },
    {
      id: 8,
      timestamp: "2024-01-22 08:15:12",
      user: "Admin User",
      action: "Security Alert",
      target: "Multiple failed login attempts",
      type: "security",
      status: "warning",
      ipAddress: "203.0.113.45",
      details: "5 failed login attempts from suspicious IP address",
    },
  ]

  const getActionIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-400" />
      case "user_management":
        return <User className="w-4 h-4 text-blue-400" />
      case "ai_assignment":
        return <Settings className="w-4 h-4 text-purple-400" />
      case "blockchain":
        return <Shield className="w-4 h-4 text-yellow-400" />
      case "security":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "system":
        return <Settings className="w-4 h-4 text-gray-400" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-900/50 text-green-400 border-green-600"
      case "error":
        return "bg-red-900/50 text-red-400 border-rose-800"
      case "warning":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-600"
      case "pending":
        return "bg-blue-900/50 text-blue-400 border-blue-600"
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "error":
        return <AlertTriangle className="w-3 h-3 mr-1" />
      case "warning":
        return <AlertTriangle className="w-3 h-3 mr-1" />
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || log.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Activity Logs</h1>
          <p className="text-zinc-400 mt-1">Comprehensive audit trail of all system activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="bg-zinc-700 border-zinc-600 text-white hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Search activities by action, user, or target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-700 border-zinc-600 text-white"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48 bg-zinc-700 border-zinc-600 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 border-zinc-600">
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="user_management">User Management</SelectItem>
                <SelectItem value="ai_assignment">AI Assignments</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white">Total Activities</h3>
            <p className="text-3xl font-bold text-white mt-2">{activityLogs.length}</p>
            <p className="text-zinc-400 mt-1">All recorded activities</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white">Successful Actions</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {activityLogs.filter((log) => log.status === "success").length}
            </p>
            <p className="text-zinc-400 mt-1">Number of successful actions</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white">Failed Actions</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {activityLogs.filter((log) => log.status === "error").length}
            </p>
            <p className="text-zinc-400 mt-1">Number of failed actions</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {activityLogs.filter((log) => log.type === "security").length}
            </p>
            <p className="text-zinc-400 mt-1">Number of security alerts</p>
          </CardContent>
        </Card>
      </div>      {/* Activity Logs Table */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">Timestamp</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">User</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">Action</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">Type</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">Status</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">IP Address</th>
                  <th className="py-3.5 pl-4 pr-3 text-sm font-semibold">Info</th>
                </tr>
              </thead><tbody className="divide-y divide-zinc-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-300">{log.timestamp}</td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-300">{log.user}</td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-300">
                      <div className="flex items-center">
                        {getActionIcon(log.type)}
                        <span className="ml-2">{log.action}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-300">{log.type}</td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(log.status)}`}
                      >
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-300">{log.ipAddress}</td>
                    <td className="py-4 pl-4 pr-3 text-sm">
                      <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-700 border-zinc-600 min-w-[200px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-600 hover:text-white w-full">
                                <Target className="w-4 h-4 mr-2 text-blue-400" />
                                Target
                                <ChevronDown className="w-4 h-4 ml-auto" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              className="bg-zinc-600 border-zinc-500 ml-2" 
                              side="right"
                            >
                              <div className="px-3 py-2 text-sm text-zinc-200 max-w-xs break-words">
                                {log.target}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-zinc-600 hover:text-white w-full">
                                <FileText className="w-4 h-4 mr-2 text-green-400" />
                                Details
                                <ChevronDown className="w-4 h-4 ml-auto" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              className="bg-zinc-600 border-zinc-500 ml-2" 
                              side="right"
                            >
                              <div className="px-3 py-2 text-sm text-zinc-200 max-w-xs break-words">
                                {log.details}
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
