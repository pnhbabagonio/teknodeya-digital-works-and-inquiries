// components/sections/hero-section.tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [cursorVariant, setCursorVariant] = useState("default")
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Fixed particle positions that won't change between server and client
  const floatingParticles = [
    { id: 1, x: 15, y: 20, size: 3, duration: 12, delay: 0 },
    { id: 2, x: 85, y: 30, size: 4, duration: 15, delay: -2 },
    { id: 3, x: 45, y: 70, size: 2.5, duration: 18, delay: -5 },
    { id: 4, x: 70, y: 15, size: 3.5, duration: 14, delay: -3 },
    { id: 5, x: 25, y: 85, size: 3, duration: 16, delay: -4 },
    { id: 6, x: 90, y: 60, size: 4.5, duration: 20, delay: -6 },
    { id: 7, x: 10, y: 45, size: 2, duration: 13, delay: -1 },
    { id: 8, x: 55, y: 90, size: 3.8, duration: 17, delay: -7 },
    { id: 9, x: 35, y: 35, size: 4.2, duration: 19, delay: -8 },
    { id: 10, x: 75, y: 75, size: 3.2, duration: 15, delay: -9 },
    { id: 11, x: 50, y: 50, size: 5, duration: 22, delay: -10 },
    { id: 12, x: 95, y: 80, size: 2.8, duration: 16, delay: -11 },
    { id: 13, x: 5, y: 95, size: 3.6, duration: 18, delay: -12 },
    { id: 14, x: 65, y: 40, size: 4.8, duration: 21, delay: -13 },
    { id: 15, x: 30, y: 10, size: 3.4, duration: 14, delay: -14 },
    { id: 16, x: 80, y: 55, size: 2.2, duration: 17, delay: -15 },
    { id: 17, x: 40, y: 65, size: 4.6, duration: 19, delay: -16 },
    { id: 18, x: 20, y: 25, size: 3.9, duration: 16, delay: -17 },
    { id: 19, x: 60, y: 45, size: 2.7, duration: 15, delay: -18 },
    { id: 20, x: 88, y: 88, size: 4.1, duration: 20, delay: -19 },
  ]

  // Don't render particles until after hydration to avoid mismatch
  if (!isMounted) {
    return (
      <section 
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/95"
      >
        {/* Simple background without particles for SSR */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(0,186,242,0.15),transparent_60%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,154,60,0.15),transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Static logo */}
            <div className="mb-8 relative">
              <Image
                src="/assets/official-logov2.png"
                alt="Teknodeya"
                width={220}
                height={74}
                className="mx-auto h-20 sm:h-24 w-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Static text */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
              We design and build
              <span className="block gradient-text">
                your ideas
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="inline-block bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/5 dark:to-secondary/5 px-6 py-3 rounded-2xl backdrop-blur-sm">
                Transform your vision into reality with our expert team of designers and developers. 
                We create powerful digital experiences that drive results.
              </span>
            </p>

            {/* Static buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-primary hover:bg-primary/90 shadow-xl" 
                asChild
              >
                <Link href="/services">
                  <span className="flex items-center">
                    Explore Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 backdrop-blur-sm" 
                asChild
              >
                <Link href="/inquiry">
                  <span className="flex items-center">
                    Start Your Project
                    <Sparkles className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/95"
    >
      {/* Custom Mouse Cursor - Subtle and Harmonious */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: cursorVariant === "hover" ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 shadow-lg" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary/60 to-secondary/60 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.15]">
        <div 
          className="absolute inset-0 bg-grid-pattern"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
      </div>

      {/* Floating Particles - Now with fixed positions */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20 dark:bg-primary/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.3, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-0 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-accent/30 to-primary/30 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(0,186,242,0.15),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,154,60,0.15),transparent_60%)]" />
      </div>

      <motion.div 
        style={{ opacity, scale, y }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Logo with Parallax */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="mb-8 relative"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            }}
            onHoverStart={() => setCursorVariant("hover")}
            onHoverEnd={() => setCursorVariant("default")}
          >
            <motion.div
              animate={{
                rotateY: [0, 10, -10, 0],
                rotateX: [0, -10, 10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Image
                src="/assets/official-logov2.png"
                alt="Teknodeya"
                width={220}
                height={74}
                className="mx-auto h-20 sm:h-24 w-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Tagline with Gradient Animation */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight"
            onHoverStart={() => setCursorVariant("hover")}
            onHoverEnd={() => setCursorVariant("default")}
          >
            We design and build
            <motion.span 
              className="block gradient-text animate-gradient"
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              your ideas
            </motion.span>
          </motion.h1>

          {/* Description with subtle background */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl sm:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
          >
          <motion.span 
            className="inline-block bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/5 dark:to-secondary/5 px-6 py-3 rounded-2xl backdrop-blur-sm"
            onHoverStart={() => setCursorVariant("hover")}
            onHoverEnd={() => setCursorVariant("default")}
          >
              Transform your vision into reality with our expert team of designers and developers. 
              We create powerful digital experiences that drive results.
            </motion.span>
          </motion.p>

          {/* CTA Buttons with Original Colors */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setCursorVariant("hover")}
              onHoverEnd={() => setCursorVariant("default")}
            >
              <Button 
                size="lg" 
                variant="default" 
                className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-primary hover:bg-primary/90" 
                asChild
              >
                <Link href="/services">
                  <span className="relative z-10 flex items-center">
                    Explore Services
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setCursorVariant("hover")}
              onHoverEnd={() => setCursorVariant("default")}
            >
              <Button 
                size="lg" 
                variant="secondary" 
                className="group relative overflow-hidden border-2 backdrop-blur-sm bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                asChild
              >
                <Link href="/inquiry">
                  <span className="relative z-10 flex items-center">
                    Start Your Project
                    <Sparkles className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Subtle Scroll Indicator - Redesigned for Harmony */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{
                y: [0, 6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="cursor-pointer group"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                })
              }}
            >
              {/* Minimalist scroll indicator - almost invisible */}
              <div className="relative">
                {/* Ultra-subtle line */}
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                {/* Tiny dot that fades in/out */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 -top-1"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-gradient-to-r from-primary/40 to-secondary/40" />
                </motion.div>
              </div>

              {/* Alternative: Minimal chevron that fades */}
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="w-3 h-3 text-primary/20 mx-auto mt-1" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}