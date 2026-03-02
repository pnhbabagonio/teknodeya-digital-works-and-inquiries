// components/sections/cta-section.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(0,186,242,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,154,60,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Ready to Bring Your
            <span className="gradient-text block">Idea to Life?</span>
          </h2>
          
          <p className="text-lg text-text-muted mb-8">
            Let's collaborate and create something extraordinary together. 
            Whether you have a clear vision or just a spark of an idea, we're here to help.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="secondary" className="group" asChild>
                <Link href="/inquiry">
                  Start Your Project
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="group" asChild>
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/5"
          >
            <p className="text-sm text-text-muted mb-4">Trusted by innovative companies worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {/* Add company logos here if needed */}
              <span className="text-text-muted/30 text-lg font-bold">TechCorp</span>
              <span className="text-text-muted/30 text-lg font-bold">InnovateLabs</span>
              <span className="text-text-muted/30 text-lg font-bold">DesignStudio</span>
              <span className="text-text-muted/30 text-lg font-bold">FutureTech</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}