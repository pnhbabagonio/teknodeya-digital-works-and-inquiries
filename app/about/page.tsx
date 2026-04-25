import { Metadata } from 'next'
import { AboutContent } from '@/components/sections/about-content'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about Teknodeya — a passionate team of designers and developers turning ambitious ideas into powerful digital experiences.',
  openGraph: {
    title: 'About Teknodeya',
    description:
      'Learn more about Teknodeya — a passionate team of designers and developers turning ambitious ideas into powerful digital experiences.',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-balance">
            About <span className="gradient-text">Teknodeya</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto text-pretty">
            We&apos;re a digital studio dedicated to designing and building ideas
            that move businesses forward.
          </p>
        </div>

        <AboutContent />
      </div>
    </main>
  )
}
