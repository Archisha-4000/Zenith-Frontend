"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Clock, User, CheckCircle, AlertCircle, Zap } from 'lucide-react'

// Mock data for AI allocation logs
const allocationLogs = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    taskTitle: 'Implement user authentication system',
    employee: 'Sarah Chen',
    allocationReason: 'Best match: React expertise (95%), available capacity (80%), previous similar work',
    confidence: 95,
    status: 'completed',
    estimatedHours: 16,
    actualHours: 14,
    aiModel: 'ZenithAI v2.1'
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:15:00Z',
    taskTitle: 'Fix payment gateway integration bug',
    employee: 'Marcus Rodriguez',
    allocationReason: 'Backend specialist (90%), payment systems experience, immediate availability',
    confidence: 90,
    status: 'in_progress',
    estimatedHours: 8,
    actualHours: null,
    aiModel: 'ZenithAI v2.1'
  },
  {
    id: '3',
    timestamp: '2024-01-15T08:45:00Z',
    taskTitle: 'Design mobile app wireframes',
    employee: 'Emily Davis',
    allocationReason: 'UI/UX expertise (88%), mobile design portfolio, creative track record',
    confidence: 88,
    status: 'pending',
    estimatedHours: 12,
    actualHours: null,
    aiModel: 'ZenithAI v2.1'
  },
  {
    id: '4',
    timestamp: '2024-01-14T16:20:00Z',
    taskTitle: 'Optimize database queries',
    employee: 'David Kim',
    allocationReason: 'Database optimization specialist (92%), SQL expertise, performance tuning experience',
    confidence: 92,
    status: 'completed',
    estimatedHours: 6,
    actualHours: 5,
    aiModel: 'ZenithAI v2.1'
  },
  {
    id: '5',
    timestamp: '2024-01-14T14:10:00Z',
    taskTitle: 'Create API documentation',
    employee: 'Lisa Park',
    allocationReason: 'Technical writing skills (85%), API documentation experience, attention to detail',
    confidence: 85,
    status: 'completed',
    estimatedHours: 10,
    actualHours: 12,
    aiModel: 'ZenithAI v2.0'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-400" />
    case 'in_progress':
      return <Clock className="w-4 h-4 text-blue-400" />
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-400" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-900/20 text-green-400 border-green-800'
    case 'in_progress':
      return 'bg-blue-900/20 text-blue-400 border-blue-800'
    case 'pending':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-800'
    default:
      return 'bg-gray-900/20 text-gray-400 border-gray-800'
  }
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return 'text-green-400'
  if (confidence >= 80) return 'text-yellow-400'
  return 'text-red-400'
}

export function AIAllocationLogs() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Allocation Logs</h2>
          <p className="text-gray-400 mt-1">Track AI-powered task assignments and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center space-x-3">
              <Bot className="w-5 h-5 text-rose-400" />
              <div>
                <p className="text-sm font-medium text-white">AI Model</p>
                <p className="text-xs text-gray-400">ZenithAI v2.1</p>
              </div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-white">Avg Confidence</p>
                <p className="text-xs text-gray-400">90.2%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Allocation Logs List */}
      <div className="space-y-4">
        {allocationLogs.map((log) => (
          <Card key={log.id} className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-rose-400" />
                    <div>
                      <h3 className="font-semibold text-white">{log.taskTitle}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(log.status)}>
                      {getStatusIcon(log.status)}
                      <span className="ml-1 capitalize">{log.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className="bg-gray-800 text-gray-300">
                      {log.aiModel}
                    </Badge>
                  </div>
                </div>

                {/* Assigned Employee */}
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-medium">Assigned to: {log.employee}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Confidence:</span>
                    <span className={`text-sm font-medium ${getConfidenceColor(log.confidence)}`}>
                      {log.confidence}%
                    </span>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">AI Allocation Reasoning:</h4>
                  <p className="text-sm text-gray-300">{log.allocationReason}</p>
                </div>

                {/* Time Tracking */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Estimated:</span>
                    <span className="text-white">{log.estimatedHours}h</span>
                  </div>
                  {log.actualHours && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Actual:</span>
                      <span className="text-white">{log.actualHours}h</span>
                      <span className={`text-sm ${
                        log.actualHours <= log.estimatedHours ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ({log.actualHours <= log.estimatedHours ? '-' : '+'}
                        {Math.abs(log.actualHours - log.estimatedHours)}h)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">94%</div>
            <div className="text-sm text-gray-400">Allocation Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">87%</div>
            <div className="text-sm text-gray-400">Time Estimation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">92%</div>
            <div className="text-sm text-gray-400">Employee Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">2.3s</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
