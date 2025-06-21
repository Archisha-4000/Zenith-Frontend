"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, UserPlus, Crown, Activity, Github, Shield, Upload, X, CheckCircle, AlertCircle, User, Mail, MapPin, Calendar, Star, Clock, DollarSign } from "lucide-react"
import { createUserFromDataAction, getCurrentUserAction, getUsersByOrgAction } from "@/actions/user"
import { ClientUser } from "@/models/types"

export function TeamOverview() {
  const [searchTerm, setSearchTerm] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)
  const [employees, setEmployees] = useState<ClientUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<ClientUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  // Load employees from database on component mount
  const loadEmployees = async () => {
    setLoading(true)
    try {      // First get current user to determine their organization
      const currentUserResult = await getCurrentUserAction()
      if (currentUserResult.success && currentUserResult.data) {
        console.log('Current user org_id:', currentUserResult.data.org_id) // Debug log
        // Then get all users from the same organization
        const orgUsersResult = await getUsersByOrgAction(currentUserResult.data.org_id)
        console.log('Org users result:', orgUsersResult) // Debug log
        if (orgUsersResult.success) {
          setEmployees(orgUsersResult.data || [])
        }
      } else {
        console.log('Failed to get current user:', currentUserResult) // Debug log
      }
    } catch (error) {
      console.error("Failed to load employees:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),  )
  
  // Helper function to check if employee is on leave (handles both string and boolean values)
  const isEmployeeOnLeave = (isOnLeave: any): boolean => {
    return isOnLeave === "TRUE" || isOnLeave === true
  }
  
  const parseCSV = (csvText: string, orgId: string) => {
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
      
      // First, capture ALL fields from the CSV without filtering
      headers.forEach((header, headerIndex) => {
        const value = values[headerIndex]
        if (value !== undefined && value !== null && value !== '') {
          rowData[header] = value
        }
      })

      // Then map specific fields to standardized property names for known fields
      // This preserves all original data while also providing standardized access
      if (rowData.name) rowData.name = rowData.name
      if (rowData.employee_id || rowData.employeeid) rowData.employeeId = rowData.employee_id || rowData.employeeid
      if (rowData.email) rowData.email = rowData.email
      if (rowData.role && !rowData.role.includes('job')) rowData.role = rowData.role.toLowerCase()
      if (rowData.job_role || rowData.jobrole || rowData['job role']) {
        rowData.jobRole = rowData.job_role || rowData.jobrole || rowData['job role']
      }
      if (rowData.seniority) rowData.seniority = rowData.seniority.toLowerCase()
      if (rowData.skills) {
        // Handle skills array - split by # and filter out empty strings
        rowData.skills = rowData.skills.split('#').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      }
      if (rowData.current_workload || rowData.currentworkload || rowData.workload) {
        const workloadValue = rowData.current_workload || rowData.currentworkload || rowData.workload
        const parsed = parseFloat(workloadValue)
        rowData.currentWorkload = isNaN(parsed) ? 0 : parsed
      }
      if (rowData.hourly_rate || rowData.hourlyrate || rowData.rate) {
        const rateValue = rowData.hourly_rate || rowData.hourlyrate || rowData.rate
        const parsed = parseFloat(rateValue)
        rowData.hourlyRate = isNaN(parsed) ? 0 : parsed
      }
      if (rowData.performance_rating || rowData.performancerating || rowData.rating) {
        const ratingValue = rowData.performance_rating || rowData.performancerating || rowData.rating
        const parsed = parseFloat(ratingValue)
        rowData.performanceRating = isNaN(parsed) ? 0 : parsed      }
      if (rowData.provider_user_id || rowData.provideruserid || rowData.userid) {
        rowData.providerUserId = rowData.provider_user_id || rowData.provideruserid || rowData.userid
      }if (rowData.is_on_leave || rowData.isonleave || rowData.onleave) {
        const leaveValue = rowData.is_on_leave || rowData.isonleave || rowData.onleave
        rowData.isOnLeave = leaveValue.toLowerCase() === "true"
      }

      // Handle org_id from CSV - convert to MongoDB ObjectId format
      if (rowData.org_id || rowData.orgid) {
        const orgIdValue = rowData.org_id || rowData.orgid
        // Store in MongoDB ObjectId format
        rowData.org_id = { "$oid": orgIdValue }
        rowData.orgId = orgIdValue // Also keep the string version for compatibility
      }

      // Validate required fields
      if (!rowData.name || (!rowData.employeeId && !rowData.employee_id && !rowData.employeeid)) {
        throw new Error(`Row ${index + 2}: Missing required fields (name, employee_id)`)
      }

      // Validate role if provided
      if (rowData.role && !['admin', 'manager', 'employee'].includes(rowData.role)) {
        throw new Error(`Row ${index + 2}: Invalid role "${rowData.role}". Must be admin, manager, or employee`)
      }

      // Validate seniority if provided
      if (rowData.seniority && !['junior', 'mid', 'senior'].includes(rowData.seniority)) {
        throw new Error(`Row ${index + 2}: Invalid seniority "${rowData.seniority}". Must be junior, mid, or senior`)
      }

      // If no org_id in CSV, use the current user's organization ID
      if (!rowData.orgId) {
        rowData.orgId = orgId
      }

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
      // Get current user's organization first
      const currentUserResult = await getCurrentUserAction()
      if (!currentUserResult.success || !currentUserResult.data) {
        setUploadResult({
          success: false,
          message: 'Unable to determine current user organization'
        })
        return
      }

      const text = await file.text()
      const userData = parseCSV(text, currentUserResult.data.org_id) // Pass org_id to parser
      
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
        })      } else {
        setUploadResult({
          success: true,
          message: `Successfully uploaded ${createdUsers.length} employees`,
          count: createdUsers.length
        })
        // Reload employees list after successful upload
        loadEmployees()
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
          <h1 className="text-3xl font-bold text-white">Team Overview</h1>
          <p className="text-zinc-400 mt-1">View team members' details, see roles, and monitor performance</p>
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
      )} 

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
      </Card>      {/* Employee Table */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white pb-2">Team Members</CardTitle>
          <CardContent className="text-zinc-400 pb-2">
            {loading ? "Loading..." : `${filteredEmployees.length} employees found`}
          </CardContent>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-zinc-400">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              The organization does not have any employees yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-700">
                  <TableHead className="text-zinc-400">Employee</TableHead>
                  <TableHead className="text-zinc-400">Job Role</TableHead>
                  <TableHead className="text-zinc-400">Skills</TableHead>
                  <TableHead className="text-zinc-400">Availability</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id} className="border-zinc-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-zinc-600 text-white">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{employee.name}</p>
                          <p className="text-sm text-zinc-400">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">{employee.job_role || "Not specified"}</TableCell>
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
                    <TableCell>                      <Badge
                        variant="outline"
                        className={
                          isEmployeeOnLeave(employee.is_on_leave)
                            ? "bg-red-900/50 text-red-400 border-red-600"
                            : "bg-green-900/50 text-green-400 border-green-600"
                        }
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        {isEmployeeOnLeave(employee.is_on_leave) ? "On Leave" : "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-zinc-700 border-zinc-600">
                          <DropdownMenuItem 
                            className="text-zinc-300 hover:bg-zinc-600"
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setIsModalOpen(true)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-zinc-800 border border-zinc-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Employee Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-zinc-600 text-white text-lg">
                    {selectedEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedEmployee.name}</h3>
                  <p className="text-zinc-400">{selectedEmployee.job_role || "Not specified"}</p>
                  <Badge className={`mt-1 ${selectedEmployee.role === 'admin' ? 'bg-red-600' : selectedEmployee.role === 'manager' ? 'bg-blue-600' : 'bg-green-600'}`}>
                    {selectedEmployee.role}
                  </Badge>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Email:</span>
                    <span className="text-white">{selectedEmployee.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Employee ID:</span>
                    <span className="text-white">{selectedEmployee.employee_id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Seniority:</span>
                    <span className="text-white capitalize">{selectedEmployee.seniority}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Workload:</span>
                    <span className="text-white">{selectedEmployee.current_workload}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Hourly Rate:</span>
                    <span className="text-white">${selectedEmployee.hourly_rate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Performance:</span>
                    <span className="text-white">{selectedEmployee.performance_rating}/10</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Status:</span>                    <Badge
                      variant="outline"
                      className={
                        isEmployeeOnLeave(selectedEmployee.is_on_leave)
                          ? "bg-red-900/50 text-red-400 border-red-600"
                          : "bg-green-900/50 text-green-400 border-green-600"
                      }
                    >
                      {isEmployeeOnLeave(selectedEmployee.is_on_leave) ? "On Leave" : "Available"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Joined:</span>
                    <span className="text-white">
                      {new Date(selectedEmployee.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.length > 0 ? (
                    selectedEmployee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-zinc-700 text-zinc-300 border-zinc-500">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-400">No skills specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
