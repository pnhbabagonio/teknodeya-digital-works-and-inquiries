import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaqList } from '@/components/sections/faq-list'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about working with Teknodeya — pricing, timelines, process, and ongoing support.',
  openGraph: {
    title: 'FAQ | Teknodeya',
    description:
      'Frequently asked questions about working with Teknodeya — pricing, timelines, process, and ongoing support.',
  },
}

export default function FAQPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-balance">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto text-pretty">
            Everything you need to know about working with Teknodeya. Can&apos;t
            find what you&apos;re looking for? Reach out and we&apos;ll be happy
            to help.
          </p>
        </div>

        <FaqList />

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-text-muted mb-4">
            Still have questions? We&apos;d love to hear from you.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/inquiry">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
