"use client"

import { User, ClientUser } from "@/models/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Mail, User as UserIcon, Briefcase, TrendingUp, DollarSign, Star, Calendar } from "lucide-react"

interface UserDetailsModalProps {
  user: User | ClientUser | null
  isOpen: boolean
  onCloseAction: () => void
}

export function UserDetailsModal({ user, isOpen, onCloseAction }: UserDetailsModalProps) {
  if (!isOpen || !user) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (isOnLeave: boolean) => {
    return isOnLeave ? 'bg-red-900/50 text-red-400 border-red-600' : 'bg-green-900/50 text-green-400 border-green-600'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-900/50 text-purple-400 border-purple-600'
      case 'manager':
        return 'bg-blue-900/50 text-blue-400 border-blue-600'
      default:
        return 'bg-zinc-700 text-zinc-300 border-zinc-500'
    }
  }

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-600'
      case 'mid':
        return 'bg-blue-900/50 text-blue-400 border-blue-600'
      case 'junior':
        return 'bg-green-900/50 text-green-400 border-green-600'
      default:
        return 'bg-zinc-700 text-zinc-300 border-zinc-500'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCloseAction}
      />
      
      {/* Modal Content */}
      <Card className="relative bg-zinc-800 border-zinc-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-zinc-400">{user.job_role || 'No job role specified'}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseAction}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300">{user.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300">ID: {user.employee_id}</span>
                </div>
              </div>
            </div>

            {/* Role & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Role & Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm">System Role:</span>
                  <Badge variant="outline" className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm">Seniority:</span>
                  <Badge variant="outline" className={getSeniorityColor(user.seniority)}>
                    {user.seniority.charAt(0).toUpperCase() + user.seniority.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm">Status:</span>
                  <Badge variant="outline" className={getStatusColor(user.is_on_leave)}>
                    {user.is_on_leave ? 'On Leave' : 'Available'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-zinc-700 text-zinc-300 border-zinc-500"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No skills listed</p>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Current Workload</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      user.current_workload > 80
                        ? "bg-red-500"
                        : user.current_workload > 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(user.current_workload, 100)}%` }}
                  />
                </div>
                <span className="text-white font-semibold">{user.current_workload}%</span>
              </div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Hourly Rate</span>
              </div>
              <p className="text-xl font-bold text-white">
                ${user.hourly_rate.toFixed(2)}
              </p>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-zinc-400">Performance</span>
              </div>
              <p className="text-xl font-bold text-white">
                {user.performance_rating.toFixed(1)}/10
              </p>
            </div>
          </div>

          {/* Join Date */}
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-zinc-400">Joined Organization</span>
            </div>
            <p className="text-white font-semibold">
              {formatDate(user.created_at)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
