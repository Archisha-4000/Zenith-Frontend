"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Clock, User, CheckCircle, AlertCircle, Zap, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { getCurrentUserAction } from "@/actions/user"
import { getAIAllocationLogsAction } from "@/actions/aiTasks"
import { AITaskDocument } from "@/models/types"

export function AIAllocationLogs() {
  const [loading, setLoading] = useState(true)
  const [allocationLogs, setAllocationLogs] = useState<AITaskDocument[]>([])
  const [expandedLogs, setExpandedLogs] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const user = await getCurrentUserAction()
        if (!user.success || !user.data?.org_id) {
          return
        }

        const logsResult = await getAIAllocationLogsAction(user.data.org_id.toString())
        if (logsResult.success && logsResult.data) {
          setAllocationLogs(logsResult.data)
        }
      } catch (error) {
        console.error("Error loading AI allocation logs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const toggleExpanded = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }))
  }

  const formatDate = (date: any): string => {
    if (!date) return 'Not set'
    let dateObj: Date
    
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'object' && date.$date) {
      if (date.$date.$numberLong) {
        dateObj = new Date(parseInt(date.$date.$numberLong))
      } else {
        dateObj = new Date(date.$date)
      }
    } else {
      dateObj = new Date(date)
    }
    
    return dateObj.toLocaleDateString()
  }

  const formatNumber = (value: any): number => {
    if (typeof value === 'number') return value
    if (value?.$numberInt) return parseInt(value.$numberInt)
    if (value?.$numberLong) return parseInt(value.$numberLong)
    if (value?.$numberDouble) return parseFloat(value.$numberDouble)
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <span className="ml-2 text-white">Loading AI allocation logs...</span>
      </div>
    )
  }

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
                <p className="text-sm font-medium text-white">AI Projects</p>
                <p className="text-xs text-gray-400">{allocationLogs.length} total</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Allocation Logs List */}
      <div className="space-y-4">
        {allocationLogs.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No AI allocation logs found</p>
          </Card>
        ) : (
          allocationLogs.map((log, index) => {
            const logId = log._id?.toString() || index.toString()
            const isExpanded = expandedLogs[logId]
            
            return (
              <Card key={logId} className="bg-gray-900/50 border-gray-800 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleExpanded(logId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <Bot className="w-6 h-6 text-rose-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {log.feature_spec?.title || 'AI Task Allocation'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {log.requirement?.requirement_text || 'No description available'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="text-xs bg-rose-900/20 text-rose-400 border-rose-800">
                        {log.requirement?.priority || 'medium'}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-white">
                          {formatNumber(log.optimization_metrics?.employees_used || 0)} employees
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-700 p-4 bg-gray-800/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Task Allocations */}
                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Task Allocations
                        </h4>
                        <div className="space-y-2">
                          {log.task_allocations?.map((allocation, allocIndex) => (
                            <div key={allocIndex} className="bg-gray-900/50 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-white font-medium">{allocation.employee_name}</p>
                                  <p className="text-xs text-gray-400">{allocation.employee_email}</p>
                                </div>
                                <Badge className="text-xs bg-blue-900/20 text-blue-400 border-blue-800">
                                  {allocation.tasks?.length || 0} tasks
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">
                                {formatNumber(allocation.total_estimated_hours)} hours estimated
                              </p>
                              <p className="text-xs text-gray-500">
                                {allocation.allocation_reasoning}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optimization Metrics */}
                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Optimization Metrics
                        </h4>
                        <div className="bg-gray-900/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Complexity:</span>
                            <span className="text-white">{log.optimization_metrics?.task_complexity || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Tasks:</span>
                            <span className="text-white">{formatNumber(log.optimization_metrics?.total_tasks || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Hours:</span>
                            <span className="text-white">{formatNumber(log.optimization_metrics?.total_estimated_hours || 0)}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confidence:</span>
                            <span className="text-green-400">
                              {(formatNumber(log.optimization_metrics?.classification_confidence || 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>            )
          })
        )}
      </div>
    </div>
  )
}
