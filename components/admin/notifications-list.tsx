// components/admin/notifications-list.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Inbox,
  MessageSquare,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Notification {
  id: string
  user_id: string
  type: 'new_inquiry' | 'status_change' | 'system'
  title: string
  message: string
  read: boolean
  created_at: string
  data: {
    inquiry_id?: string
    reference_number?: string
    old_status?: string
    new_status?: string
    full_name?: string
  } | null
}

export function NotificationsList() {
  const supabase = useMemo(() => createClient(), [])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setNotifications([])
        return
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setNotifications((data || []) as Notification[])
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Could not load notifications')
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setIsUpdating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be signed in.')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Could not mark notification as read')
    } finally {
      setIsUpdating(false)
    }
  }

  const markAllAsRead = async () => {
    setIsUpdating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be signed in.')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications((current) =>
        current.map((notification) => ({ ...notification, read: true }))
      )
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Could not mark all notifications as read')
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    setIsUpdating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be signed in.')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId)
      )
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Could not delete notification')
    } finally {
      setIsUpdating(false)
    }
  }

  const clearReadNotifications = async () => {
    setIsUpdating(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be signed in.')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true)

      if (error) throw error

      setNotifications((current) =>
        current.filter((notification) => !notification.read)
      )
      toast.success('Read notifications cleared')
    } catch (error) {
      console.error('Error clearing read notifications:', error)
      toast.error('Could not clear read notifications')
    } finally {
      setIsUpdating(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_inquiry':
        return <MessageSquare className="h-5 w-5 text-primary" />
      case 'status_change':
        return <Clock className="h-5 w-5 text-secondary" />
      case 'system':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-text-muted" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-md bg-primary/5"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={unreadCount > 0 ? 'default' : 'outline'}>
            {unreadCount} unread
          </Badge>
          <span className="text-sm text-text-muted">
            {notifications.length} total
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadNotifications}
            disabled={isUpdating}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isUpdating || unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearReadNotifications}
            disabled={isUpdating || notifications.every((notification) => !notification.read)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Read
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="mb-3 h-10 w-10 text-text-muted" />
            <h3 className="text-lg font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-text-muted">
              New inquiry and status updates will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                'transition-colors',
                !notification.read && 'border-primary/30 bg-primary/5'
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="h-5 px-2">Unread</Badge>
                          )}
                        </div>
                        <p className="text-sm text-text-muted">
                          {notification.message}
                        </p>
                      </div>

                      <div className="flex flex-shrink-0 flex-wrap gap-2">
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            disabled={isUpdating}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => deleteNotification(notification.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span>
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span>
                        {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                      {notification.data?.reference_number && (
                        <span className="font-mono text-primary">
                          {notification.data.reference_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
