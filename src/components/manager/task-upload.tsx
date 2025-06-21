"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  Calendar, 
  Users, 
  FileText, 
  Github,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Terminal,
  Eye
} from "lucide-react"
import { getCurrentUserAction } from "@/actions/user"

export function TaskUpload() {
  const [requirementData, setRequirementData] = useState({
    requirement_text: "",
    priority: "medium" as "low" | "medium" | "high",
    deadline: "",
    additional_context: ""
  })
  const [orgId, setOrgId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)
  const [logs, setLogs] = useState("")
  const [showLogs, setShowLogs] = useState(false)
  const [requestStartTime, setRequestStartTime] = useState<Date | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUserAction()
        if (user.success && user.data?.org_id) {
          setOrgId(user.data.org_id.toString())
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      }
    }
    loadUserData()
  }, [])

  // Fetch and filter logs from showcase endpoint when logs are visible
  useEffect(() => {
    if (!showLogs) return

    const fetchFilteredLogs = async () => {
      try {
        const response = await fetch('https://1160-203-171-240-122.ngrok-free.app/logs/showcase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        })
        if (response.ok) {
          const logText = await response.text()
          
          // Filter logs: only show lines containing $$$$ and after request time
          const logLines = logText.split('\n').filter((line: string) => {
            if (!line.includes('$$$$')) return false
            
            // Extract timestamp from log line (format: 2025-06-21 23:48:28.662)
            const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3})/)
            if (!timestampMatch || !requestStartTime) return true
            
            try {
              const logTime = new Date(timestampMatch[1])
              return logTime >= requestStartTime
            } catch {
              return true // Include if timestamp parsing fails
            }
          }).map((line: string) => {
            // Remove timestamp and log level prefix, keep only the message part
            // Pattern: timestamp | level | module:function:line - message
            const messageMatch = line.match(/^[\d-\s:.]+\|\s*\w+\s*\|\s*[^-]+-\s*(.*)$/)
            const cleanMessage = messageMatch ? messageMatch[1] : line
            // Replace $$$$ with single $
            return cleanMessage.replace(/\$\$\$\$/g, '$')
          })
          
          const filteredLogs = logLines.join('\n')
          // Add dot to the last line if there are logs
          const finalLogs = filteredLogs && logLines.length > 0 
            ? filteredLogs.replace(/([^\n]+)$/, '$1.')
            : filteredLogs
          setLogs(finalLogs)
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error)
      }
    }

    // Fetch immediately
    fetchFilteredLogs()

    // Set up interval to fetch every 2 seconds
    const interval = setInterval(fetchFilteredLogs, 2000)

    return () => clearInterval(interval)
  }, [showLogs, requestStartTime])

  const handleSubmit = async () => {
    if (!requirementData.requirement_text || !orgId) {
      setUploadResult({
        success: false,
        message: "Please fill in all required fields"
      })
      return
    }

    // Clear logs, set request start time, and show logs panel
    setLogs("")
    setRequestStartTime(new Date())
    setShowLogs(true)
    setUploading(true)
    setUploadResult(null)
    try {
      const payload = {
        org_id: orgId,
        requirement_text: requirementData.requirement_text,
        priority: requirementData.priority,
        deadline: requirementData.deadline ? new Date(requirementData.deadline).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
        additional_context: requirementData.additional_context
      }

      console.log("Sending payload:", payload)

      const response = await fetch('https://1160-203-171-240-122.ngrok-free.app/process-requirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUploadResult({
          success: true,
          message: `Task processed successfully! Allocated to ${result.task_allocations?.length || 0} team members.`,
          data: result
        })
        // Reset form
        setRequirementData({
          requirement_text: "",
          priority: "medium",
          deadline: "",
          additional_context: ""
        })
      } else {
        setUploadResult({
          success: false,
          message: result.message || "Failed to process requirement"
        })
      }
    } catch (error) {
      console.error("Error submitting requirement:", error)
      setUploadResult({
        success: false,
        message: "Network error: Failed to submit requirement"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">      <div>
        <h1 className="text-3xl font-bold text-white">Process Requirement</h1>
        <p className="text-zinc-400 mt-1">Submit requirements for AI-powered task generation and allocation</p>
      </div>

      {/* AI Processing Logs - Top Section */}
      {showLogs && (
        <Card className="bg-zinc-900/50 border-cyan-600/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                AI Processing Logs
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogs(false)}
                className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Hide Logs
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/80 p-4 rounded-lg border border-cyan-600/30 max-h-64 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                {logs || "Waiting for logs..."}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Upload Form */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-500" />
              Submit Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">            <div>
              <Label htmlFor="requirement_text" className="text-zinc-300">Requirement Description *</Label>
              <Textarea
                id="requirement_text"
                value={requirementData.requirement_text}
                onChange={(e) => setRequirementData({...requirementData, requirement_text: e.target.value})}
                placeholder="Describe the task requirements in detail..."
                className="bg-zinc-800 border-zinc-600 text-white h-32"
              />
            </div>

            <div>
              <Label htmlFor="priority" className="text-zinc-300">Priority</Label>
              <Select 
                value={requirementData.priority} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  setRequirementData({...requirementData, priority: value})
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-600">
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline" className="text-zinc-300">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={requirementData.deadline}
                onChange={(e) => setRequirementData({...requirementData, deadline: e.target.value})}
                className="bg-zinc-800 border-zinc-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="additional_context" className="text-zinc-300">Additional Context (Optional)</Label>
              <Textarea
                id="additional_context"
                value={requirementData.additional_context}
                onChange={(e) => setRequirementData({...requirementData, additional_context: e.target.value})}
                placeholder="Any additional context or specific requirements..."
                className="bg-zinc-800 border-zinc-600 text-white h-24"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-zinc-300">AI Auto-Allocation</span>
                <Badge variant="outline" className="text-green-400 border-green-600">
                  Enabled
                </Badge>
              </div>
            </div>            <Button 
              onClick={handleSubmit}
              disabled={uploading || !requirementData.requirement_text}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Requirement"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Allocation Preview */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Allocation Preview
            </CardTitle>
          </CardHeader>          <CardContent>
            <div className="space-y-4">
              {uploadResult?.success && uploadResult.data ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="bg-zinc-800/30 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Processing Complete
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-400">
                          {uploadResult.data.task_allocations?.length || 0}
                        </p>
                        <p className="text-xs text-zinc-400">Team Members</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-400">
                          {uploadResult.data.task_allocations?.reduce((sum: number, alloc: any) => sum + (alloc.tasks?.length || 0), 0)}
                        </p>
                        <p className="text-xs text-zinc-400">Tasks Generated</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-rose-400">
                          {uploadResult.data.task_allocations?.reduce((sum: number, alloc: any) => sum + (alloc.total_estimated_hours || 0), 0)}h
                        </p>
                        <p className="text-xs text-zinc-400">Total Effort</p>
                      </div>
                    </div>
                  </div>

                  {/* Final Task Allocations */}
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Final AI Allocations
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {uploadResult.data.task_allocations?.map((allocation: any, index: number) => (
                        <div key={index} className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-white font-semibold">{allocation.employee_name}</p>
                              <p className="text-zinc-400 text-sm">{allocation.employee_email}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs mb-1">
                                {allocation.tasks?.length || 0} tasks
                              </Badge>
                              <p className="text-zinc-400 text-sm">
                                {allocation.total_estimated_hours}h
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-zinc-900/50 p-3 rounded border-l-2 border-rose-500">
                            <p className="text-zinc-300 text-sm leading-relaxed">
                              {allocation.allocation_reasoning}
                            </p>
                          </div>

                          {/* Task Summary */}
                          {allocation.tasks && allocation.tasks.length > 0 && (
                            <div className="mt-3">
                              <p className="text-zinc-400 text-xs mb-2">Key Tasks:</p>
                              <div className="space-y-1">
                                {allocation.tasks.slice(0, 3).map((task: any, taskIndex: number) => (
                                  <div key={taskIndex} className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-300 truncate flex-1 mr-2">{task.title}</span>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {task.priority}
                                      </Badge>
                                      <span className="text-zinc-500">{task.estimated_duration_hours}h</span>
                                    </div>
                                  </div>
                                ))}
                                {allocation.tasks.length > 3 && (
                                  <p className="text-zinc-500 text-xs">
                                    +{allocation.tasks.length - 3} more tasks...
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Overview */}
                  {uploadResult.data.feature_specs && (
                    <div>
                      <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generated Feature
                      </h3>
                      <div className="bg-zinc-800/50 p-3 rounded-lg">
                        <h4 className="text-white font-medium">{uploadResult.data.feature_specs.title}</h4>
                        <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{uploadResult.data.feature_specs.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            {uploadResult.data.feature_specs.priority}
                          </Badge>
                          <span className="text-xs text-zinc-500">
                            {uploadResult.data.feature_specs.estimated_effort}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-zinc-500" />
                  </div>
                  <p className="text-zinc-400">
                    Submit a requirement to see AI allocation suggestions
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <Card className={`border ${uploadResult.success ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {uploadResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white">{uploadResult.message}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
