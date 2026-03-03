// app/portfolio/page.tsx
import { Metadata } from 'next'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'

export const metadata: Metadata = {
  title: 'Our Portfolio',
  description: 'Explore our collection of successful projects across web development, mobile apps, UI/UX design, and creative design.',
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Discover how we've helped businesses transform their ideas into powerful digital experiences
          </p>
        </div>

        {/* Portfolio Grid with Filters */}
        <PortfolioGrid />
      </div>
    </main>
  )
}