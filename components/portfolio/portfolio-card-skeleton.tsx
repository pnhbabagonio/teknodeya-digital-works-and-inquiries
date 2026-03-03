// components/portfolio/portfolio-card-skeleton.tsx
'use client'

import { Card } from '@/components/ui/card'

export function PortfolioCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-primary/10" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-primary/10 rounded-full" />
          <div className="h-5 w-16 bg-primary/10 rounded-full" />
        </div>
        <div className="h-6 bg-primary/10 rounded w-3/4" />
        <div className="h-4 bg-primary/10 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-16 bg-primary/10 rounded-full" />
          <div className="h-6 w-16 bg-primary/10 rounded-full" />
          <div className="h-6 w-16 bg-primary/10 rounded-full" />
        </div>
      </div>
    </Card>
  )
}