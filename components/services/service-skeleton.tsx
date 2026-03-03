// components/services/service-skeleton.tsx
'use client'

import { Card } from '@/components/ui/card'

export function ServiceSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10" />
        
        {/* Category Badge */}
        <div className="h-5 w-24 bg-primary/10 rounded-full" />
        
        {/* Title */}
        <div className="h-6 bg-primary/10 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-primary/10 rounded w-full" />
          <div className="h-4 bg-primary/10 rounded w-5/6" />
        </div>
        
        {/* Features */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-primary/10 rounded w-1/3" />
          <div className="space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-4 w-4 bg-primary/10 rounded" />
                <div className="h-4 bg-primary/10 rounded flex-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Price & Time */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-4 bg-primary/10 rounded" />
          <div className="h-4 bg-primary/10 rounded" />
        </div>
        
        {/* Button */}
        <div className="h-10 bg-primary/10 rounded" />
      </div>
    </Card>
  )
}