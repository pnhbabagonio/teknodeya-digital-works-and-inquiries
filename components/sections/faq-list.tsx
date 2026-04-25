'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FaqItem {
  category: string
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    category: 'Getting Started',
    question: 'What kinds of projects does Teknodeya work on?',
    answer:
      'We design and build web applications, mobile apps, marketing websites, dashboards, and brand experiences. If it lives on a screen and needs to feel great to use, we can probably help.',
  },
  {
    category: 'Getting Started',
    question: 'How do I start a project with you?',
    answer:
      "The fastest way is to fill out the inquiry form on our site. Share your goals, timeline, and any context you have — we'll review it and get back to you within 24–48 hours with next steps.",
  },
  {
    category: 'Pricing',
    question: 'How much does a project cost?',
    answer:
      "Every engagement is scoped based on goals, complexity, and timeline. After our initial discovery call we'll send a detailed proposal with clear deliverables and pricing — no surprises later.",
  },
  {
    category: 'Pricing',
    question: 'Do you offer fixed-price or hourly engagements?',
    answer:
      'Both. Most product builds are scoped as fixed-price phases so you can plan with confidence. For ongoing work, retainers, or open-ended exploration we also offer hourly engagements.',
  },
  {
    category: 'Process',
    question: 'How long does a typical project take?',
    answer:
      'Marketing sites usually ship in 3–6 weeks. Product MVPs typically take 2–4 months. Larger platforms run longer and are broken into clearly defined phases so you see value early and often.',
  },
  {
    category: 'Process',
    question: 'How involved will I be during the project?',
    answer:
      'As involved as you want to be. We share progress regularly, run weekly syncs, and keep an open line of communication so you can give feedback continuously rather than only at the end.',
  },
  {
    category: 'Technology',
    question: 'What technologies do you use?',
    answer:
      "We default to modern, well-supported tooling — React, Next.js, TypeScript, Tailwind CSS, and Node.js on the web; React Native on mobile; and Postgres or managed BaaS for data. We'll always recommend what best fits your goals.",
  },
  {
    category: 'Technology',
    question: 'Will I own the code and designs?',
    answer:
      'Yes. Once a project is delivered and paid for, you own all of the source code, design files, and assets we produced for you.',
  },
  {
    category: 'Support',
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Absolutely. We offer optional support and maintenance plans that cover bug fixes, performance monitoring, dependency updates, and product iteration after launch.',
  },
  {
    category: 'Support',
    question: 'Can you take over an existing project?',
    answer:
      "Yes. We frequently inherit, audit, and extend existing codebases. We'll start with a short engagement to assess the project and recommend a plan forward.",
  },
]

const categories = Array.from(new Set(faqs.map((f) => f.category)))

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
            {category}
          </h2>
          <div className="space-y-3">
            {faqs
              .map((faq, originalIndex) => ({ faq, originalIndex }))
              .filter(({ faq }) => faq.category === category)
              .map(({ faq, originalIndex }) => {
                const isOpen = openIndex === originalIndex
                return (
                  <Card
                    key={faq.question}
                    className={cn(
                      'transition-colors duration-300',
                      isOpen ? 'border-primary/40' : 'hover:border-white/10'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : originalIndex)
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                    >
                      <span className="font-heading text-base md:text-lg font-semibold text-text-primary">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-text-muted shrink-0 transition-transform duration-300',
                          isOpen && 'rotate-180 text-primary'
                        )}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 md:px-6 pb-5 md:pb-6 -mt-1 text-text-muted leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
