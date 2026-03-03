// app/services/page.tsx
import { Metadata } from 'next'
import { ServicesGrid } from '@/components/services/services-grid'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our comprehensive range of digital services including web development, mobile apps, UI/UX design, and creative design solutions.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            We offer end-to-end digital solutions tailored to your business needs, 
            combining creativity with technical excellence
          </p>
        </div>

        {/* Services Grid with Tabs */}
        <ServicesGrid />
      </div>
    </main>
  )
}