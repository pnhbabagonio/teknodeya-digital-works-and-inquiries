// components/forms/inquiry-form.tsx
'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, X, Upload, File, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, generateReferenceNumber, formatFileSize } from '@/lib/utils'
import { inquirySchema, type InquiryFormData } from '@/lib/validations/inquiry'
import { createClient } from '@/lib/supabase/client'

const serviceOptions = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'creative-design', label: 'Creative Design' },
]

const budgetOptions = [
  { value: '<5000', label: 'Less than ₱5,000' },
  { value: '5000-10000', label: '₱5,000 - ₱10,000' },
  { value: '10000-25000', label: '₱10,000 - ₱25,000' },
  { value: '25000-50000', label: '₱25,000 - ₱50,000' },
  { value: '>50000', label: 'More than ₱50,000' },
  { value: 'not-specified', label: 'Not specified' },
]

interface FileWithPreview extends File {
  preview?: string
}

interface InquiryFormProps {
  initialService?: string
}

export function InquiryForm({ initialService }: InquiryFormProps = {}) {
  const initialSelected = initialService ? [initialService] : []

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelected)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      serviceTypes: initialSelected,
      budgetRange: 'not-specified',
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        })
      ),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const newServices = prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
      setValue('serviceTypes', newServices)
      return newServices
    })
  }

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const refNumber = generateReferenceNumber()

      // Upload files to Supabase Storage
      const uploadedFiles = []
      for (const file of files) {
        const lastDot = file.name.lastIndexOf('.')
        const rawExt = lastDot >= 0 ? file.name.slice(lastDot + 1) : ''
        // Keep only alphanumerics in the extension to avoid invalid storage keys
        const fileExt = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'bin'
        const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        const storagePath = `${refNumber}/${uniqueId}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('inquiry-attachments')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/octet-stream',
          })

        if (uploadError) {
          console.error('[v0] Storage upload error:', uploadError)
          throw new Error(
            `Could not upload "${file.name}": ${uploadError.message}`
          )
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from('inquiry-attachments')
          .getPublicUrl(storagePath)

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: storagePath,
        })
      }

      // Save inquiry to database
      const { error } = await supabase.from('inquiries').insert({
        reference_number: refNumber,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service_types: data.serviceTypes,
        project_description: data.projectDescription,
        budget_range: data.budgetRange,
        preferred_deadline: data.preferredDeadline,
        attachments: uploadedFiles,
      })

      if (error) {
        console.error('[v0] Insert inquiry error:', error)
        throw new Error(error.message)
      }

      setReferenceNumber(refNumber)
      setSubmitted(true)
      reset()
      setFiles([])
      setSelectedServices([])

      toast.success('Inquiry submitted successfully!')
    } catch (error) {
      console.error('[v0] Submission error:', error)
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to submit inquiry. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-heading font-bold mb-2">
          Thank You!
        </h3>
        <p className="text-text-muted mb-4">
          Your inquiry has been submitted successfully.
        </p>
        <div className="bg-surface/50 rounded-card p-4 mb-6 inline-block">
          <p className="text-sm text-text-muted">Reference Number</p>
          <p className="text-xl font-mono font-bold text-primary">
            {referenceNumber}
          </p>
        </div>
        <p className="text-text-muted">
          We will contact you within 24-48 hours to discuss your project.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Inquiry
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Full Name <span className="text-primary">*</span>
            </label>
            <Input
              {...register('fullName')}
              placeholder="John Doe"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email <span className="text-primary">*</span>
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              {...register('phone')}
              placeholder="0998-765-4321"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company</label>
            <Input
              {...register('company')}
              placeholder="Company Name"
            />
          </div>
        </div>
      </div>

      {/* Service Types */}
      <div className="space-y-4">
        <label className="text-sm font-medium">
          Service Types <span className="text-primary">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((service) => (
            <Button
              key={service.value}
              type="button"
              variant={selectedServices.includes(service.value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleService(service.value)}
              className="rounded-full"
            >
              {service.label}
            </Button>
          ))}
        </div>
        {errors.serviceTypes && (
          <p className="text-sm text-red-500">{errors.serviceTypes.message}</p>
        )}
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Project Description <span className="text-primary">*</span>
        </label>
        <Textarea
          {...register('projectDescription')}
          placeholder="Tell us about your project idea, requirements, and goals..."
          rows={6}
          className={errors.projectDescription ? 'border-red-500' : ''}
        />
        {errors.projectDescription && (
          <p className="text-sm text-red-500">{errors.projectDescription.message}</p>
        )}
      </div>

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget Range</label>
          <Select
            onValueChange={(value) => setValue('budgetRange', value as any)}
            defaultValue="not-specified"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preferred Deadline</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watch('preferredDeadline') && 'text-text-muted'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch('preferredDeadline') ? (
                  format(watch('preferredDeadline')!, 'PPP')
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watch('preferredDeadline')}
                onSelect={(date) => setValue('preferredDeadline', date)}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Attachments</label>
        <Card
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-white/10'
          )}
        >
          <CardContent className="p-6">
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-text-muted mb-2" />
              {isDragActive ? (
                <p className="text-sm text-text-muted">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-sm text-text-muted">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-xs text-text-muted/50 mt-1">
                    Supported: Images, PDF, DOC (Max 10MB each)
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Preview */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium">Selected Files ({files.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-2">
                        {file.preview ? (
                          <div className="relative aspect-square">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="object-cover w-full h-full rounded"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square flex flex-col items-center justify-center bg-surface/50">
                            <File className="h-8 w-8 text-text-muted mb-1" />
                            <p className="text-xs text-center truncate w-full px-1">
                              {file.name}
                            </p>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs text-text-muted mt-1">
                          {formatFileSize(file.size)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Inquiry'
        )}
      </Button>
    </form>
  )
}
