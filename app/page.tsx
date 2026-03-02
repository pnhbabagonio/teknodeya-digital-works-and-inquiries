import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesTeaser } from '@/components/sections/services-teaser'
import { PortfolioTeaser } from '@/components/sections/portfolio-teaser'
import { WhyTeknodeya } from '@/components/sections/why-teknodeya'
import { Testimonials } from '@/components/sections/testimonials'
import { CTASection } from '@/components/sections/cta-section'

export const metadata: Metadata = {
  title: 'Teknodeya - We design and build your ideas',
  description: 'Transform your ideas into powerful digital experiences with Teknodeya. Expert web development, mobile apps, UI/UX design, and creative solutions.',
  openGraph: {
    title: 'Teknodeya - We design and build your ideas',
    description: 'Transform your ideas into powerful digital experiences with Teknodeya.',
    images: ['/assets/og-image.jpg'],
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesTeaser />
      <PortfolioTeaser />
      <WhyTeknodeya />
      <Testimonials />
      <CTASection />
    </main>
  )
}