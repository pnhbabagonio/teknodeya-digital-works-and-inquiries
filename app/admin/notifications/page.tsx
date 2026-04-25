// app/admin/notifications/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NotificationsList } from '@/components/admin/notifications-list'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View and manage admin notifications',
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Notifications</h2>
        <p className="text-text-muted">
          Review, mark, and delete dashboard notifications
        </p>
      </div>

      <NotificationsList />
    </div>
  )
}
