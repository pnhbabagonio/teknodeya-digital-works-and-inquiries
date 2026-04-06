// components/portfolio/portfolio-modal.tsx
'use client'

import { format } from 'date-fns'
import Image from 'next/image'
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
  ExternalLink,
  Calendar,
  User,
  Code2,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  client_name: string
  completion_date: string
  technologies: string[]
  live_url?: string
}

interface PortfolioModalProps {
  item: PortfolioItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PortfolioModal({ item, open, onOpenChange }: PortfolioModalProps) {
  const [showAllTech, setShowAllTech] = useState(false)

  if (!item) return null

  const categoryLabel = item.category.split('-').join(' ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-y-auto">
        {/* Remove overflow-hidden from DialogContent */}
        
        <div className="relative h-[300px] md:h-[400px] w-full flex-shrink-0">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Close Button - Make it sticky or absolute positioned */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 md:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary">{categoryLabel}</Badge>
              {item.live_url && (
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  Live Project
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-heading">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-6" />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Client
              </h3>
              <p className="text-text-muted">{item.client_name}</p>

              <h3 className="font-semibold flex items-center gap-2 mt-4">
                <Calendar className="h-4 w-4 text-primary" />
                Completion Date
              </h3>
              <p className="text-text-muted">
                {format(new Date(item.completion_date), 'MMMM yyyy')}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {(showAllTech ? item.technologies : item.technologies.slice(0, 6)).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {item.technologies.length > 6 && !showAllTech && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary h-auto p-0"
                    onClick={() => setShowAllTech(true)}
                  >
                    +{item.technologies.length - 6} more
                  </Button>
                )}
              </div>

              {item.live_url && (
                <div className="mt-6">
                  <Button variant="default" className="w-full" asChild>
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer">
                      Visit Live Project
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-surface/50 rounded-card">
            <p className="text-sm text-text-muted">
              This project showcases our expertise in {categoryLabel}. 
              We worked closely with {item.client_name} to deliver a solution that exceeded their expectations.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}