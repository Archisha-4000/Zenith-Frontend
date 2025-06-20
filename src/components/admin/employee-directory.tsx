"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, UserPlus, Crown, Activity, Github, Shield, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { createUserFromDataAction } from "@/actions/user"

export function EmployeeDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    },  ]
  
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )
  
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '')
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }    const headers = lines[0].split(',').map(header => header.trim().toLowerCase())
    const requiredHeaders = ['name', 'employee_id']
    
    const missingHeaders = requiredHeaders.filter(required => 
      !headers.some(header => header === required || (required === 'employee_id' && header === 'employeeid'))
    )
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`)
    }    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''))
      const rowData: any = {}
      
      headers.forEach((header, headerIndex) => {
        const value = values[headerIndex]
        if (value !== undefined && value !== null) {          if (header === 'name') rowData.name = value
          else if (header === 'employee_id' || header === 'employeeid') rowData.employeeId = value
          else if (header === 'email') rowData.email = value
          else if (header === 'role' && !header.includes('job')) rowData.role = value.toLowerCase()
          else if (header === 'job_role' || header === 'jobrole' || header === 'job role') rowData.jobRole = value
          else if (header === 'seniority') rowData.seniority = value.toLowerCase()
          else if (header === 'skills') {
            // Handle skills array - split by # and filter out empty strings
            rowData.skills = value.split('#').map(s => s.trim()).filter(s => s.length > 0)
          }
          else if (header === 'current_workload' || header === 'currentworkload' || header === 'workload') {
            // Parse workload as number, handle empty values
            const parsed = parseFloat(value)
            rowData.currentWorkload = isNaN(parsed) ? 0 : parsed
          }
          else if (header === 'hourly_rate' || header === 'hourlyrate' || header === 'rate') {
            // Parse hourly rate as number, handle empty values
            const parsed = parseFloat(value)
            rowData.hourlyRate = isNaN(parsed) ? 0 : parsed
          }
          else if (header === 'performance_rating' || header === 'performancerating' || header === 'rating') {
            // Parse performance rating as number, handle empty values
            const parsed = parseFloat(value)
            rowData.performanceRating = isNaN(parsed) ? 0 : parsed
          }
          else if (header === 'provider_user_id' || header === 'provideruserid' || header === 'userid') rowData.providerUserId = value
          else if (header === 'is_on_leave' || header === 'isonleave' || header === 'onleave') rowData.isOnLeave = value.toLowerCase() === 'true'
        }
      })

      // Validate required fields
      if (!rowData.name || !rowData.employeeId) {
        throw new Error(`Row ${index + 2}: Missing required fields (name, employeeId)`)
      }

      // Validate role if provided
      if (rowData.role && !['admin', 'manager', 'employee'].includes(rowData.role)) {
        throw new Error(`Row ${index + 2}: Invalid role "${rowData.role}". Must be admin, manager, or employee`)
      }

      // Validate seniority if provided
      if (rowData.seniority && !['junior', 'mid', 'senior'].includes(rowData.seniority)) {
        throw new Error(`Row ${index + 2}: Invalid seniority "${rowData.seniority}". Must be junior, mid, or senior`)
      }      // Add default orgId (you might want to make this configurable)
      rowData.orgId = "675faaaa0000000000000001" // Valid ObjectId format - Replace with actual org ID

      return rowData
    })

    return data
  }
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadResult({ success: false, message: 'Please select a valid CSV file' })
      return
    }    setUploading(true)
    setUploadResult(null)

    try {
      const text = await file.text()
      const userData = parseCSV(text)
      
      console.log('Parsed CSV data:', userData) // Debug log
        const createdUsers: any[] = []
      const errors: string[] = []
      
      // Process each user individually using the existing action
      for (const user of userData) {
        try {
          console.log('Processing user:', user) // Debug log
          const result = await createUserFromDataAction(user)
          
          if (result.success) {
            createdUsers.push(result.data)
          } else {
            const errorDetails = result.fieldErrors 
              ? `Field errors: ${Object.entries(result.fieldErrors).map(([field, error]) => `${field}: ${error}`).join(', ')}`
              : result.error || 'Unknown error'
            errors.push(`User ${user.name}: ${errorDetails}`)
          }
        } catch (error) {
          console.error('Error processing user:', user, error) // Debug log
          errors.push(`User ${user.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
      
      if (errors.length > 0 && createdUsers.length === 0) {
        setUploadResult({
          success: false,
          message: `Upload failed: ${errors.join('; ')}`
        })
      } else if (errors.length > 0) {
        setUploadResult({
          success: false,
          message: `Partially successful: Created ${createdUsers.length} users, failed ${errors.length}. Errors: ${errors.join('; ')}`,
          count: createdUsers.length
        })
      } else {
        setUploadResult({
          success: true,
          message: `Successfully uploaded ${createdUsers.length} employees`,
          count: createdUsers.length
        })
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process CSV file'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Directory</h1>
          <p className="text-zinc-400 mt-1">Manage employees, assign roles, and monitor performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleUploadClick}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload CSV"}
          </Button>
          <Button className="bg-rose-800 hover:bg-red-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Upload Result */}
      {uploadResult && (
        <Card className={`border ${uploadResult.success ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {uploadResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm ${uploadResult.success ? 'text-green-300' : 'text-red-300'}`}>
                  {uploadResult.message}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadResult(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}      {/* CSV Format Help */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardContent className="p-4">
          <div className="text-sm text-zinc-400">
            <h4 className="font-medium text-white mb-2">CSV Format Requirements:</h4>
            <p className="mb-2">Your CSV file should include the following columns (case-insensitive):</p>            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>name</strong> - Full name of the employee (required)</li>
              <li><strong>employee_id</strong> or <strong>employeeId</strong> - Unique employee identifier (required)</li>
              <li><strong>email</strong> - Employee email address (optional)</li>
              <li><strong>role</strong> - System role: admin, manager, or employee (optional, defaults to employee)</li>
              <li><strong>job_role</strong> or <strong>jobRole</strong> - Job title/position like "Software Engineer", "Blockchain Architect" etc. (optional)</li>
              <li><strong>seniority</strong> - Experience level: junior, mid, or senior (optional, defaults to mid)</li>
              <li><strong>skills</strong> - Hash-separated skills list (e.g., JavaScript#React#Node.js) (optional)</li>
              <li><strong>current_workload</strong> or <strong>currentWorkload</strong> - Current workload percentage (optional)</li>
              <li><strong>hourly_rate</strong> or <strong>hourlyRate</strong> - Hourly rate in dollars (optional)</li>
              <li><strong>performance_rating</strong> or <strong>performanceRating</strong> - Performance rating (optional)</li>
              <li><strong>provider_user_id</strong> or <strong>providerUserId</strong> - Auth provider user ID (optional, will be empty if not provided)</li>
              <li><strong>is_on_leave</strong> or <strong>isOnLeave</strong> - true/false (optional, defaults to false)</li>
            </ul>
            <p className="mt-2 text-xs">
              <strong>Example CSV:</strong><br/>              <code className="bg-zinc-700 px-2 py-1 rounded">
                name,employee_id,email,role,job_role,seniority,skills,current_workload,hourly_rate,performance_rating,is_on_leave<br/>
                John Doe,EMP001,john@company.com,employee,Blockchain Developer,mid,JavaScript#React#Solidity,75,50.00,8.5,false<br/>
                Jane Smith,EMP002,jane@company.com,manager,Blockchain Architect,senior,Management#Architecture#Solidity,60,75.00,9.0,false
              </code>
            </p>            <p className="mt-2 text-xs text-amber-400">
              <strong>Important:</strong> "role" is for system permissions (admin/manager/employee), while "job_role" is for job titles like "Blockchain Architect".
            </p>            <p className="mt-1 text-xs text-amber-400">
              <strong>Skills Note:</strong> Use hash (#) to separate multiple skills (e.g., JavaScript#React#Node.js).
            </p>
            <p className="mt-1 text-xs text-amber-400">
              <strong>Note:</strong> Fields like _id, created_at, and auth_provider.provider_user_id are automatically generated and should not be included in the CSV.
            </p>
          </div>
        </CardContent>
      </Card>

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
