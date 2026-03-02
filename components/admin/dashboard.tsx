// components/admin/dashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InquiriesTable } from '@/components/admin/inquiries-table'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

interface Stats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

export function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/admin/login')
      router.refresh()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Error logging out')
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-surface border-r border-white/5 transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            'p-4 border-b border-white/5',
            collapsed ? 'text-center' : ''
          )}>
            {collapsed ? (
              <span className="text-2xl font-bold text-primary">T</span>
            ) : (
              <span className="text-xl font-bold gradient-text">Teknodeya</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    collapsed ? 'px-2' : ''
                  )}
                >
                  <LayoutDashboard className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
                  {!collapsed && 'Dashboard'}
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    collapsed ? 'px-2' : ''
                  )}
                >
                  <Inbox className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
                  {!collapsed && 'Inquiries'}
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    collapsed ? 'px-2' : ''
                  )}
                >
                  <Settings className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
                  {!collapsed && 'Settings'}
                </Button>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10',
                collapsed ? 'px-2' : ''
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn('h-5 w-5', collapsed ? 'mx-auto' : 'mr-3')} />
              {!collapsed && 'Logout'}
            </Button>
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-20"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 transition-all duration-300',
        collapsed ? 'ml-20' : 'ml-64'
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-text-muted">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                          <p className="text-2xl font-bold">
                            {loading ? (
                              <div className="h-8 w-16 bg-primary/20 animate-pulse rounded" />
                            ) : (
                              stat.value
                            )}
                          </p>
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

          {/* Inquiries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <InquiriesTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}