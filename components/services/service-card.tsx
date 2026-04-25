// components/services/service-card.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Smartphone,
  Palette,
  PenTool,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    category: string
    icon: string
    features?: string[]
    price_range?: string
    delivery_time?: string
  }
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

export function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = iconMap[service.icon as keyof typeof iconMap] || Globe
  const categoryColor = categoryColors[service.category as keyof typeof categoryColors] || 'from-primary to-secondary'

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden group hover-lift hover-glow border-0 bg-surface/50 backdrop-blur-sm">
        {/* Gradient Background */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br',
            categoryColor
          )}
        />

        {/* Icon Background */}
        <div
          className={cn(
            'pointer-events-none absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-500',
            categoryColor
          )}
        />

        <CardHeader>
          {/* Icon */}
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 mb-4"
          >
            <div className={cn(
              'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center',
              categoryColor
            )}>
              <Icon className="h-7 w-7 text-white" />
            </div>
          </motion.div>

          {/* Category Badge */}
          <Badge variant="outline" className="w-fit mb-2">
            {service.category.split('-').join(' ')}
          </Badge>

          {/* Title */}
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="line-clamp-2">
            {service.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary">Key Features:</p>
              <div className="space-y-1">
                {service.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {service.features.length > 3 && (
                  <p className="text-xs text-primary mt-1">
                    +{service.features.length - 3} more features
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {service.price_range && (
              <div className="flex items-center gap-1.5 text-sm">
                <span
                  aria-hidden="true"
                  className="inline-flex h-4 w-4 items-center justify-center text-primary font-bold leading-none"
                >
                  ₱
                </span>
                <span className="text-text-muted">{service.price_range}</span>
              </div>
            )}
            {service.delivery_time && (
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-text-muted">{service.delivery_time}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="relative z-10">
          <Button
            variant="ghost"
            className="w-full group/btn"
            asChild
          >
            <Link href={`/inquiry?service=${service.category}`}>
              Start Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>

        {/* Hover Effect Sparkles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="pointer-events-none absolute top-4 right-4"
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </motion.div>
      </Card>
    </motion.div>
  )
}
