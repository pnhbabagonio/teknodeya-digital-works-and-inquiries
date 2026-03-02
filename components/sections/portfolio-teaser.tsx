// components/sections/portfolio-teaser.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  client_name: string
}

export function PortfolioTeaser() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    async function loadPortfolio() {
      const supabase = createClient()
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('featured', true)
        .order('order_index')
        .limit(6)

      if (data) {
        setItems(data)
      }
      setLoading(false)
    }

    loadPortfolio()
  }, [])

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-64" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Explore some of our recent projects that showcase our expertise and creativity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              <Card className="group cursor-pointer overflow-hidden border-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className={cn(
                      'object-cover transition-transform duration-700',
                      hoveredId === item.id ? 'scale-110' : 'scale-100'
                    )}
                  />
                  
                  {/* Overlay */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-300',
                      hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />

                  {/* Content */}
                  <div
                    className={cn(
                      'absolute inset-0 p-6 flex flex-col justify-end transition-all duration-300',
                      hoveredId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    )}
                  >
                    <Badge variant="secondary" className="w-fit mb-2">
                      {item.category.split('-').join(' ')}
                    </Badge>
                    <h3 className="text-xl font-heading font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/80 mb-3">
                      {item.client_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="gap-2">
                        View Project
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}