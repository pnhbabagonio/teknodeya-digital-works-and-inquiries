// components/admin/inquiries-table.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { cn, truncateText } from '@/lib/utils'
import { InquiryModal } from './inquiry-modal'

interface Inquiry {
  id: string
  reference_number: string
  full_name: string
  email: string
  service_types: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  created_at: string
}

type SortField = 'created_at' | 'full_name' | 'status' | 'reference_number'
type SortOrder = 'asc' | 'desc'

export function InquiriesTable() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const pageSize = 10

  useEffect(() => {
    loadInquiries()
  }, [page, sortField, sortOrder])

  const loadInquiries = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Get total count
      const { count } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })

      setTotal(count || 0)

      // Get paginated data
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      'in-progress': 'bg-blue-500/10 text-blue-500',
      completed: 'bg-green-500/10 text-green-500',
      cancelled: 'bg-red-500/10 text-red-500',
    }

    return (
      <Badge className={cn('font-normal', variants[status as keyof typeof variants])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setModalOpen(true)
  }

  if (loading && inquiries.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-primary/5 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border border-white/5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('reference_number')}
                  className="hover:bg-transparent"
                >
                  Reference
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('full_name')}
                  className="hover:bg-transparent"
                >
                  Client
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Services</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="hover:bg-transparent"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('created_at')}
                  className="hover:bg-transparent"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer hover:bg-surface/50"
                onClick={() => handleViewInquiry(inquiry)}
              >
                <TableCell className="font-mono text-sm">
                  {inquiry.reference_number}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{inquiry.full_name}</p>
                    <p className="text-sm text-text-muted">{inquiry.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {inquiry.service_types.slice(0, 2).map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service.split('-').join(' ')}
                      </Badge>
                    ))}
                    {inquiry.service_types.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{inquiry.service_types.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                <TableCell className="text-text-muted text-sm">
                  {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleViewInquiry(inquiry)
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-text-muted">
          Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, total)} of {total} results
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * pageSize >= total}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        inquiry={selectedInquiry}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={loadInquiries}
      />
    </>
  )
}