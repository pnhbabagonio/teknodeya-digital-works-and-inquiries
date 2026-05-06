// components/admin/dashboard.tsx
// Make sure the export is correct
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Inbox,
  Phone,
  Users,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InquiriesTable } from '@/components/admin/inquiries-table'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  inquiryStatusOptions,
  normalizeInquiryStatus,
  type InquiryStatus,
} from '@/lib/inquiry-status'

interface Stats {
  total: number
  statuses: Record<InquiryStatus, number>
}

const emptyStatusCounts = (): Record<InquiryStatus, number> =>
  Object.fromEntries(
    inquiryStatusOptions.map((status) => [status.value, 0])
  ) as Record<InquiryStatus, number>

const statusIcons: Record<InquiryStatus, LucideIcon> = {
  'new-inquiry': Inbox,
  contacted: Phone,
  'ongoing-discussion': Users,
  closed: CheckCircle,
}

// Use named export
export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    statuses: emptyStatusCounts(),
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

      const statusCounts = emptyStatusCounts()
      data.forEach((inquiry) => {
        statusCounts[normalizeInquiryStatus(inquiry.status)] += 1
      })

      setStats({
        total: data.length,
        statuses: statusCounts,
      })
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
    ...inquiryStatusOptions.map((status) => ({
      title: status.label,
      value: stats.statuses[status.value],
      icon: statusIcons[status.value],
      color: status.iconClassName,
      bg: status.statBgClassName,
    })),
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
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
