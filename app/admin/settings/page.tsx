// app/admin/settings/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/settings-form'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage admin settings and preferences',
}

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Get admin profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Settings</h2>
        <p className="text-text-muted">Manage your account and system preferences</p>
      </div>

      <SettingsForm profile={profile} />
    </div>
  )
}