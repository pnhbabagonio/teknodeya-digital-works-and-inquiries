// app/admin/inquiries/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InquiriesTable } from '@/components/admin/inquiries-table'

export const metadata: Metadata = {
  title: 'Inquiries Management',
  description: 'Manage and track all service inquiries',
}

export default async function InquiriesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Inquiries</h2>
        <p className="text-text-muted">Manage and track all service inquiries</p>
      </div>

      <InquiriesTable />
    </div>
  )
}