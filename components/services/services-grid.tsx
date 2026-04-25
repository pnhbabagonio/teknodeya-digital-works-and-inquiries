// components/services/services-grid.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ServiceCard } from './service-card'
import { ServiceSkeleton } from './service-skeleton'
import { createClient } from '@/lib/supabase/client'
import {
  Globe,
  Smartphone,
  Palette,
  PenTool,
  Code2,
  Zap,
  Shield,
  Rocket,
} from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  category: string
  icon: string
  features?: string[]
  price_range?: string
  delivery_time?: string
}

const categoryIcons = {
  'web-development': Globe,
  'mobile-app': Smartphone,
  'ui-ux-design': Palette,
  'creative-design': PenTool,
}

const tabs = [
  { value: 'all', label: 'All Services' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'creative-design', label: 'Creative Design' },
]

const validCategories = new Set([
  'web-development',
  'mobile-app',
  'ui-ux-design',
  'creative-design',
])

export function ServicesGrid() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const initialTab =
    categoryParam && validCategories.has(categoryParam) ? categoryParam : 'all'

  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    loadServices()
  }, [])

  // Sync tab when the user navigates between footer links on the same page
  useEffect(() => {
    if (categoryParam && validCategories.has(categoryParam)) {
      setActiveTab(categoryParam)
    } else if (!categoryParam) {
      setActiveTab('all')
    }
  }, [categoryParam])

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredServices(services)
    } else {
      setFilteredServices(services.filter(service => service.category === activeTab))
    }
  }, [activeTab, services])

  const loadServices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('order_index')

    if (data) {
      // Add mock features for demo purposes
      const enhancedServices = data.map(service => ({
        ...service,
        features: getMockFeatures(service.category),
        price_range: getMockPriceRange(service.category),
        delivery_time: getMockDeliveryTime(service.category),
      }))
      setServices(enhancedServices)
    }
    setLoading(false)
  }

  // Mock data generators for demonstration
  const getMockFeatures = (category: string) => {
    const features = {
      'web-development': [
        'Custom React/Next.js Development',
        'Responsive Design',
        'API Integration',
        'Performance Optimization',
        'SEO Ready',
        'Admin Dashboard',
      ],
      'mobile-app': [
        'iOS & Android Development',
        'Cross-platform Solutions',
        'Push Notifications',
        'Offline Support',
        'App Store Deployment',
        'Analytics Integration',
      ],
      'ui-ux-design': [
        'User Research',
        'Wireframing',
        'Interactive Prototypes',
        'Usability Testing',
        'Design Systems',
        'Accessibility Compliance',
      ],
      'creative-design': [
        'Brand Identity',
        'Logo Design',
        'Marketing Materials',
        'Social Media Assets',
        'Motion Graphics',
        'Print Design',
      ],
    }
    return features[category as keyof typeof features] || []
  }

  const getMockPriceRange = (category: string) => {
    const prices = {
      'web-development': '₱5,000 - ₱25,000',
      'mobile-app': '₱10,000 - ₱40,000',
      'ui-ux-design': '₱3,000 - ₱15,000',
      'creative-design': '₱1,000 - ₱8,000',
    }
    return prices[category as keyof typeof prices] || 'Custom Quote'
  }

  const getMockDeliveryTime = (category: string) => {
    const times = {
      'web-development': '4-12 weeks',
      'mobile-app': '8-20 weeks',
      'ui-ux-design': '2-6 weeks',
      'creative-design': '1-4 weeks',
    }
    return times[category as keyof typeof times] || 'Varies by project'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ServiceSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Tabs Navigation */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-background rounded-full px-6 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-text-muted">No services found in this category.</p>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p className="text-text-muted mb-4">
          Not sure which service you need? Let's discuss your project.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/inquiry">
            Get a Free Consultation
            <Rocket className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
