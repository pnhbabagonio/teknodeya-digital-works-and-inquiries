// components/admin/notifications-popover.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCheck, Clock, AlertCircle, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Notification {
  id: string
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
  }
}

export function NotificationsPopover() {
  const supabase = useMemo(() => createClient(), [])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const unreadCount = notifications.filter((notification) => !notification.read).length

  useEffect(() => {
    loadNotifications()

    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new as Notification
              setNotifications((prev) => [newNotification, ...prev])
            }

            if (payload.eventType === 'UPDATE') {
              const updatedNotification = payload.new as Notification
              setNotifications((prev) =>
                prev.map((notification) =>
                  notification.id === updatedNotification.id
                    ? updatedNotification
                    : notification
                )
              )
            }

            if (payload.eventType === 'DELETE') {
              const deletedNotification = payload.old as Notification
              setNotifications((prev) =>
                prev.filter((notification) => notification.id !== deletedNotification.id)
              )
            }
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No authenticated user found')
        setNotifications([])
        return
      }

      // First, check if the notifications table exists by trying to query it
      const { error: tableError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1)

      // If there's a PostgreSQL error about the table not existing, we'll show a message
      if (tableError && tableError.message?.includes('relation "public.notifications" does not exist')) {
        console.warn('Notifications table does not exist yet. Please run the SQL to create it.')
        setNotifications([])
        return
      }

      // If there's another type of error, throw it
      if (tableError) throw tableError

      // Table exists, fetch notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Could not delete notification')
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navigate based on notification type
    if (notification.type === 'new_inquiry' || notification.type === 'status_change') {
      if (notification.data?.inquiry_id) {
        router.push(`/admin/inquiries?inquiry=${notification.data.inquiry_id}`)
      } else {
        router.push('/admin/inquiries')
      }
    }
    
    setOpen(false)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_inquiry':
        return <MessageSquare className="h-4 w-4 text-primary" />
      case 'status_change':
        return <Clock className="h-4 w-4 text-secondary" />
      case 'system':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                    !notification.read && 'bg-primary/5'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 flex-shrink-0 text-text-muted hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Delete notification"
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/50 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              router.push('/admin/notifications')
              setOpen(false)
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
