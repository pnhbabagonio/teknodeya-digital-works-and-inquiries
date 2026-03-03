// components/portfolio/portfolio-filter.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Category {
  value: string
  label: string
  icon?: React.ReactNode
}

interface PortfolioFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function PortfolioFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: PortfolioFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <motion.div
          key={category.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              'rounded-full transition-all duration-300',
              selectedCategory === category.value && 'shadow-[0_0_20px_rgba(0,186,242,0.5)]'
            )}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.label}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}