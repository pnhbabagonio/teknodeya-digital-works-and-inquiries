// components/sections/testimonials.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  client_name: string
  client_position: string
  client_company: string
  content: string
  rating: number
  avatar_url: string
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    async function loadTestimonials() {
      const supabase = createClient()
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('order_index')

      if (data) {
        setTestimonials(data)
      }
      setLoading(false)
    }

    loadTestimonials()
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection)
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection
        if (nextIndex < 0) nextIndex = testimonials.length - 1
        if (nextIndex >= testimonials.length) nextIndex = 0
        return nextIndex
      })
    },
    [testimonials.length]
  )

  useEffect(() => {
    if (testimonials.length === 0) return

    const interval = setInterval(() => {
      paginate(1)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length, paginate])

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto animate-pulse">
            <CardContent className="p-8">
              <div className="h-20 bg-primary/20 rounded mb-4" />
              <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto" />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const testimonial = testimonials[currentIndex]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Don't just take our word for it – hear what our clients have to say
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="w-full"
            >
              <Card className="border-primary/20">
                <CardContent className="p-8 md:p-12">
                  {/* Rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-text-muted"
                        )}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-center mb-6">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex items-center justify-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarImage src={testimonial.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.client_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.client_name}</p>
                      <p className="text-sm text-text-muted">
                        {testimonial.client_position}
                        {testimonial.client_company && `, ${testimonial.client_company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 rounded-full"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 rounded-full"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}