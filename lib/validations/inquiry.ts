// lib/validations/inquiry.ts
import { z } from 'zod'

export const inquirySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceTypes: z.array(z.string()).min(1, 'Select at least one service'),
  projectDescription: z
    .string()
    .min(50, 'Project description must be at least 50 characters'),
  budgetRange: z.enum(['<5000', '5000-10000', '10000-25000', '25000-50000', '>50000', 'not-specified']),
  preferredDeadline: z.date().optional(),
  attachments: z.array(z.any()).optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>