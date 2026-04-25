// components/admin/inquiry-modal.tsx
'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface InquiryModalProps {
  inquiry: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'in-progress', label: 'In Progress', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
]

export function InquiryModal({ inquiry, open, onOpenChange, onUpdate }: InquiryModalProps) {
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [statusNotes, setStatusNotes] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (inquiry?.id) {
      loadStatusHistory()
      setNewStatus(inquiry.status)
    }
  }, [inquiry])

  const loadStatusHistory = async () => {
    if (!inquiry?.id) return

    const { data, error } = await supabase
      .from('inquiry_status_history')
      .select(`
        *,
        profiles:changed_by (
          full_name,
          email
        )
      `)
      .eq('inquiry_id', inquiry.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setStatusHistory(data)
    }
  }

  const handleStatusUpdate = async () => {
    if (!inquiry?.id || !newStatus || newStatus === inquiry.status) return

    setUpdating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Update inquiry status
      const { error: updateError } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', inquiry.id)

      if (updateError) throw updateError

      // Add to history
      const { error: historyError } = await supabase
        .from('inquiry_status_history')
        .insert({
          inquiry_id: inquiry.id,
          status: newStatus,
          notes: statusNotes,
          changed_by: user?.id,
        })

      if (historyError) throw historyError

      toast.success('Status updated successfully')
      onUpdate()
      loadStatusHistory()
      setStatusNotes('')
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const downloadAttachment = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (!inquiry) return null

  const budgetLabels: Record<string, string> = {
    '<5000': 'Less than ₱5,000',
    '5000-10000': '₱5,000 - ₱10,000',
    '10000-25000': '₱10,000 - ₱25,000',
    '25000-50000': '₱25,000 - ₱50,000',
    '>50000': 'More than ₱50,000',
    'not-specified': 'Not specified',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Inquiry Details</span>
            <Badge variant={inquiry.status === 'pending' ? 'warning' : inquiry.status === 'in-progress' ? 'info' : inquiry.status === 'completed' ? 'success' : 'destructive'}>
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Reference: <span className="font-mono text-primary">{inquiry.reference_number}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Client Info */}
          <div className="space-y-4">
            <div className="bg-surface/50 rounded-card p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Client Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-text-muted">Full Name</p>
                  <p className="font-medium">{inquiry.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <a href={`mailto:${inquiry.email}`} className="font-medium hover:text-primary transition-colors">
                    {inquiry.email}
                  </a>
                </div>
                {inquiry.phone && (
                  <div>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <a href={`tel:${inquiry.phone}`} className="font-medium hover:text-primary transition-colors">
                      {inquiry.phone}
                    </a>
                  </div>
                )}
                {inquiry.company && (
                  <div>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> Company
                    </p>
                    <p className="font-medium">{inquiry.company}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-surface/50 rounded-card p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-4 w-4 items-center justify-center text-primary font-bold leading-none"
                >
                  ₱
                </span>
                Project Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-text-muted">Service Types</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {inquiry.service_types?.map((service: string) => (
                      <Badge key={service} variant="outline">
                        {service.split('-').join(' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Budget Range</p>
                  <p className="font-medium">{budgetLabels[inquiry.budget_range] || 'Not specified'}</p>
                </div>
                {inquiry.preferred_deadline && (
                  <div>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> Preferred Deadline
                    </p>
                    <p className="font-medium">
                      {format(new Date(inquiry.preferred_deadline), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-text-muted">Submitted On</p>
                  <p className="font-medium">
                    {format(new Date(inquiry.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Description & Attachments */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-surface/50 rounded-card p-4">
              <h3 className="font-semibold mb-3">Project Description</h3>
              <p className="text-text-muted whitespace-pre-wrap">
                {inquiry.project_description}
              </p>
            </div>

            {inquiry.attachments && inquiry.attachments.length > 0 && (
              <div className="bg-surface/50 rounded-card p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Attachments ({inquiry.attachments.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {inquiry.attachments.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-surface rounded border border-white/5"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-text-muted flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => downloadAttachment(file.url, file.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Status Update Section */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Update Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(option.value)}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleStatusUpdate}
              disabled={updating || !newStatus || newStatus === inquiry.status}
            >
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>

        {/* Status History */}
        {statusHistory.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="font-semibold">Status History</h3>
              <div className="space-y-3">
                {statusHistory.map((history, index) => (
                  <div
                    key={history.id}
                    className={cn(
                      "flex gap-4 p-3 bg-surface/30 rounded",
                      index === 0 && "border-l-2 border-primary"
                    )}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(history.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Badge variant={history.status === 'pending' ? 'warning' : history.status === 'in-progress' ? 'info' : history.status === 'completed' ? 'success' : 'destructive'}>
                          {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-text-muted">
                          {format(new Date(history.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-text-muted mt-2">{history.notes}</p>
                      )}
                      {history.profiles && (
                        <p className="text-xs text-text-muted mt-1">
                          By: {history.profiles.full_name || history.profiles.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
