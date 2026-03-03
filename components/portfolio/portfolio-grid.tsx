// components/portfolio/portfolio-grid.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PortfolioModal } from './portfolio-modal'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { ExternalLink, Calendar, User, Code2 } from 'lucide-react'

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

const categories = [
  { value: 'all', label: 'All Projects' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'creative-design', label: 'Creative Design' },
]

export function PortfolioGrid() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    loadPortfolio()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items)
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, items])

  const loadPortfolio = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('completion_date', { ascending: false })

    if (data) {
      setItems(data)
      setFilteredItems(data)
    }
    setLoading(false)
  }

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  // Generate random heights for masonry grid
  const getRandomHeight = () => {
    const heights = [280, 320, 360, 400, 440]
    return heights[Math.floor(Math.random() * heights.length)]
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-[4/3] bg-primary/10" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-primary/10 rounded w-3/4" />
              <div className="h-3 bg-primary/10 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="rounded-full"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Masonry Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => handleItemClick(item)}
              className="cursor-pointer"
              style={{
                gridRow: `span ${Math.ceil(getRandomHeight() / 100)}`,
              }}
            >
              <Card className="group relative overflow-hidden h-full border-0">
                <div className="relative w-full h-full min-h-[300px]">
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
                      'absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent transition-opacity duration-300',
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
                    
                    {/* Technologies */}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-white border-white/20">
                            {tech}
                          </Badge>
                        ))}
                        {item.technologies.length > 3 && (
                          <Badge variant="outline" className="text-white border-white/20">
                            +{item.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button size="sm" variant="secondary" className="w-fit">
                      View Project
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-text-muted">No projects found in this category.</p>
        </motion.div>
      )}

      {/* Portfolio Modal */}
      <PortfolioModal
        item={selectedItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}