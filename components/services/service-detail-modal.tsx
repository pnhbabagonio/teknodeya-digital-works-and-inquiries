// components/services/service-detail-modal.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Globe,
  Smartphone,
  Palette,
  PenTool,
  CheckCircle,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  Users,
  Target,
  Zap,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ServiceDetailModalProps {
  service: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const iconMap = {
  '🌐': Globe,
  '📱': Smartphone,
  '🎨': Palette,
  '✨': PenTool,
}

const categoryColors = {
  'web-development': 'from-blue-500 to-cyan-500',
  'mobile-app': 'from-purple-500 to-pink-500',
  'ui-ux-design': 'from-orange-500 to-red-500',
  'creative-design': 'from-green-500 to-emerald-500',
}

export function ServiceDetailModal({ service, open, onOpenChange }: ServiceDetailModalProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'process' | 'faq'>('overview')

  if (!service) return null

  const Icon = iconMap[service.icon as keyof typeof iconMap] || Globe
  const categoryColor = categoryColors[service.category as keyof typeof categoryColors] || 'from-primary to-secondary'

  const process = [
    {
      step: 'Discovery',
      description: 'We learn about your business, goals, and requirements through in-depth consultation.',
      icon: Users,
    },
    {
      step: 'Planning',
      description: 'We create a detailed project roadmap, timeline, and technical specifications.',
      icon: Target,
    },
    {
      step: 'Execution',
      description: 'Our team brings your vision to life with agile development and regular updates.',
      icon: Zap,
    },
    {
      step: 'Delivery',
      description: 'We ensure quality through rigorous testing and provide ongoing support.',
      icon: Shield,
    },
  ]

  const faqs = [
    {
      question: `How long does ${service.title} typically take?`,
      answer: `Most ${service.category.split('-').join(' ')} projects are completed within ${service.delivery_time || '4-12 weeks'}, depending on complexity and requirements.`,
    },
    {
      question: 'What information do you need to get started?',
      answer: 'We\'ll need your project goals, target audience, preferred features, brand guidelines, and any examples of work you admire.',
    },
    {
      question: 'Do you provide ongoing support after launch?',
      answer: 'Yes, we offer various maintenance and support packages to ensure your project continues to perform optimally.',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center',
              categoryColor
            )}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Badge variant="outline" className="mb-2">
                {service.category.split('-').join(' ')}
              </Badge>
              <DialogTitle className="text-2xl">{service.title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base">
            {service.description}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="text-center p-3 bg-surface/50 rounded-card">
            <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-text-muted">Delivery Time</p>
            <p className="font-semibold">{service.delivery_time || 'Varies'}</p>
          </div>
          <div className="text-center p-3 bg-surface/50 rounded-card">
            <span
              aria-hidden="true"
              className="mx-auto mb-2 flex h-5 w-5 items-center justify-center text-primary font-bold leading-none"
            >
              ₱
            </span>
            <p className="text-xs text-text-muted">Starting at</p>
            <p className="font-semibold">{service.price_range || 'Custom'}</p>
          </div>
          <div className="text-center p-3 bg-surface/50 rounded-card">
            <Users className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-text-muted">Team Size</p>
            <p className="font-semibold">2-4 Experts</p>
          </div>
          <div className="text-center p-3 bg-surface/50 rounded-card">
            <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-text-muted">Revisions</p>
            <p className="font-semibold">Unlimited</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            onClick={() => setSelectedTab('overview')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              selectedTab === 'overview'
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            Overview
            {selectedTab === 'overview' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('process')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              selectedTab === 'process'
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            Our Process
            {selectedTab === 'process' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab('faq')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              selectedTab === 'faq'
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            FAQ
            {selectedTab === 'faq' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="font-semibold mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-text-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Technologies */}
              <div>
                <h3 className="font-semibold mb-4">Technologies We Use</h3>
                <div className="flex flex-wrap gap-2">
                  {getTechnologies(service.category).map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'process' && (
            <div className="space-y-6">
              {process.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex gap-4">
                    <div className="relative">
                      <div className={cn(
                        'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center',
                        categoryColor
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {index < process.length - 1 && (
                        <div className="absolute top-10 left-5 w-0.5 h-12 bg-gradient-to-b from-primary to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h4 className="font-semibold mb-1">{item.step}</h4>
                      <p className="text-text-muted text-sm">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {selectedTab === 'faq' && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-surface/50 rounded-card">
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-text-muted text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/inquiry?service=${service.category}`}>
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get technologies based on category
function getTechnologies(category: string) {
  const techMap = {
    'web-development': ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker'],
    'mobile-app': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Redux', 'REST APIs'],
    'ui-ux-design': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle', 'Framer'],
    'creative-design': ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Blender'],
  }
  return techMap[category as keyof typeof techMap] || ['React', 'Node.js', 'TypeScript']
}
