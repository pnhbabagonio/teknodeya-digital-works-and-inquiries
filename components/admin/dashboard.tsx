// components/admin/dashboard.tsx
// Make sure the export is correct
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Inbox,
  Clock,
  Users,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InquiriesTable } from '@/components/admin/inquiries-table'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Stats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

// Use named export
export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('inquiries')
        .select('status')

      if (error) throw error

      const stats = {
        total: data.length,
        pending: data.filter((i) => i.status === 'pending').length,
        inProgress: data.filter((i) => i.status === 'in-progress').length,
        completed: data.filter((i) => i.status === 'completed').length,
      }

      setStats(stats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats.total,
      icon: Inbox,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted mb-1">
                        {stat.title}
                      </p>
                      <div className="text-2xl font-bold">
                        {loading ? (
                          <div className="h-8 w-16 bg-primary/20 animate-pulse rounded" />
                        ) : (
                          stat.value
                        )}
                      </div>
                    </div>
                    <div className={cn('p-3 rounded-full', stat.bg)}>
                      <Icon className={cn('h-6 w-6', stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <p className="text-sm text-text-muted">
            Latest service inquiries and their status
          </p>
        </CardHeader>
        <CardContent>
          <InquiriesTable />
        </CardContent>
      </Card>
    </div>
  )
}