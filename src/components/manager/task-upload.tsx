"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  Calendar, 
  Users, 
  FileText, 
  Github,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export function TaskUpload() {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    githubIssue: "",
    selectedEmployees: []
  })
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async () => {
    setUploading(true)
    
    // Simulate task upload and AI allocation
    setTimeout(() => {
      setUploadResult({
        success: true,
        message: "Task uploaded successfully! AI is allocating to team members..."
      })
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Task</h1>
        <p className="text-zinc-400 mt-1">Create and assign new tasks to your team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Upload Form */}
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-500" />
              Create New Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-zinc-300">Task Title</Label>
              <Input
                id="title"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                placeholder="Enter task title..."
                className="bg-zinc-800 border-zinc-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-zinc-300">Description</Label>
              <Textarea
                id="description"
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="Describe the task requirements..."
                className="bg-zinc-800 border-zinc-600 text-white h-32"
              />
            </div>

            <div>
              <Label htmlFor="deadline" className="text-zinc-300">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={taskData.deadline}
                onChange={(e) => setTaskData({...taskData, deadline: e.target.value})}
                className="bg-zinc-800 border-zinc-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="github" className="text-zinc-300">GitHub Issue (Optional)</Label>
              <Input
                id="github"
                value={taskData.githubIssue}
                onChange={(e) => setTaskData({...taskData, githubIssue: e.target.value})}
                placeholder="Issue #123 or full URL"
                className="bg-zinc-800 border-zinc-600 text-white"
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
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={uploading || !taskData.title || !taskData.description}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              {uploading ? "Uploading..." : "Upload Task"}
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400">
                  Upload a task to see AI allocation suggestions
                </p>
              </div>
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
