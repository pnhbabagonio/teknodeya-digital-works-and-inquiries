'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Rocket,
  Heart,
  Lightbulb,
  Target,
  Users,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const values = [
  {
    icon: Lightbulb,
    title: 'Curiosity',
    description:
      'We ask better questions before we write a single line of code or sketch a single pixel.',
  },
  {
    icon: Heart,
    title: 'Craft',
    description:
      'We obsess over the details that turn a good product into one people love using every day.',
  },
  {
    icon: Target,
    title: 'Clarity',
    description:
      'No jargon, no smoke and mirrors. We keep communication clear from kickoff to launch.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description:
      'Your team becomes our team. The best work happens when we build together as partners.',
  },
]

const milestones = [
  {
    year: '2019',
    title: 'Where it started',
    description:
      'Teknodeya was founded as a small studio of designers and developers passionate about clean, useful software.',
  },
  {
    year: '2021',
    title: 'Going full‑stack',
    description:
      'We expanded our offering across web, mobile, UI/UX, and brand to deliver end‑to‑end digital products.',
  },
  {
    year: '2023',
    title: 'A growing partnership',
    description:
      'Our roster grew to include startups, agencies, and enterprise teams across multiple industries.',
  },
  {
    year: 'Today',
    title: 'Designing for the future',
    description:
      'We continue to ship modern, scalable, and beautifully crafted digital experiences for ambitious teams.',
  },
]

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
    transition: { duration: 0.6 },
  },
}

export function AboutContent() {
  return (
    <div className="space-y-20">
      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-primary/20">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold">
                Our Mission
              </h2>
            </div>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              At Teknodeya, our mission is simple — to design and build digital
              products that feel effortless to use and powerful to operate. We
              partner with founders, product teams, and organizations who care
              about the details, helping them ship modern web and mobile
              experiences that actually move the needle.
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* Values */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            What we <span className="gradient-text">stand for</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            A handful of principles guide every project we take on and every
            partnership we build.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value) => {
            const Icon = value.icon
            return (
              <motion.div key={value.title} variants={itemVariants}>
                <Card className="h-full hover-lift group">
                  <CardHeader>
                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary to-secondary" />
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {value.title}
                    </CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Story / Timeline */}
      <section className="bg-surface/30 rounded-card border border-white/5 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Our <span className="gradient-text">story</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            From a two‑person studio to a trusted partner for digital teams
            around the globe.
          </p>
        </motion.div>

        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto"
        >
          <div
            aria-hidden
            className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent"
          />
          {milestones.map((m, i) => (
            <motion.li
              key={m.year}
              variants={itemVariants}
              className="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-10 mb-10 last:mb-0"
            >
              <div
                className={
                  i % 2 === 0
                    ? 'md:text-right md:pr-10'
                    : 'md:col-start-2 md:pl-10'
                }
              >
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-primary">
                    {m.year}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {m.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {m.description}
                </p>
              </div>
              <span className="absolute left-1.5 md:left-1/2 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
            </motion.li>
          ))}
        </motion.ol>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {[
          { value: '100+', label: 'Projects Completed', icon: Rocket },
          { value: '50+', label: 'Happy Clients', icon: Users },
          { value: '5+', label: 'Years Experience', icon: Code2 },
          { value: '24/7', label: 'Ongoing Support', icon: Sparkles },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-heading font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-text-muted">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="border-primary/20 max-w-3xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Have an idea worth building?
            </h2>
            <p className="text-text-muted mb-6">
              Tell us about your project and we&apos;ll get back to you within
              24–48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/inquiry">
                  Start Your Project
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
