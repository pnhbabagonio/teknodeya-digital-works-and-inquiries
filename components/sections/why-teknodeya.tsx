// components/sections/why-teknodeya.tsx
'use client'

import { motion } from 'framer-motion'
import {
  Rocket,
  Users,
  Clock,
  Shield,
  HeartHandshake,
  Sparkles,
  Code2,
  Palette,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const features = [
  {
    icon: Rocket,
    title: 'Innovation First',
    description: 'We stay ahead of the curve with cutting-edge technologies and creative solutions.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Users,
    title: 'Client-Centered',
    description: 'Your vision and goals drive every decision we make throughout the project.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'We respect your time and deliver projects on schedule without compromising quality.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous testing and code reviews ensure the highest quality deliverables.',
    color: 'from-secondary to-primary',
  },
  {
    icon: HeartHandshake,
    title: 'Long-term Partnership',
    description: 'We build lasting relationships with ongoing support and maintenance.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Sparkles,
    title: 'Creative Excellence',
    description: 'Our designs are not just beautiful – they tell your brand\'s story.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Maintainable, scalable, and well-documented code for future growth.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Palette,
    title: 'Pixel Perfect',
    description: 'Attention to every detail ensures a polished final product.',
    color: 'from-secondary to-primary',
  },
]

export function WhyTeknodeya() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="py-20 bg-surface/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why <span className="gradient-text">Teknodeya?</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We combine technical expertise with creative vision to deliver exceptional results
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            function cn(...inputs: ClassValue[]) {
              return twMerge(clsx(inputs))
            }

            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-lift group">
                  <CardHeader>
                    <div className="relative mb-4">
                      <div className={cn(
                        "absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-r ${feature.color}`
                      )} />
                      <div className={cn(
                        "relative w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center",
                        feature.color
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '100+', label: 'Projects Completed', icon: Rocket },
            { value: '50+', label: 'Happy Clients', icon: Users },
            { value: '5+', label: 'Years Experience', icon: Clock },
            { value: '24/7', label: 'Support', icon: HeartHandshake },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-heading font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}