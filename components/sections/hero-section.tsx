// components/sections/hero-section.tsx
'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
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
  const [activeWord, setActiveWord] = useState<number | null>(null)
  
  // Smooth spring animations for parallax effects
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  })
  
  const opacity = useTransform(smoothProgress, [0, 1], [1, 0])
  const scale = useTransform(smoothProgress, [0, 1], [1, 0.9])
  const y = useTransform(smoothProgress, [0, 1], [0, 150])
  const blur = useTransform(smoothProgress, [0, 0.5, 1], [0, 2, 4])

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  }

  const wordVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  }

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

  // Enhanced particle system
  const floatingParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 15 + Math.random() * 20,
    delay: -Math.random() * 20,
    color: i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'secondary' : 'accent',
  }))

  const headlineWords = [
    { text: "We", highlight: false },
    { text: "design", highlight: false },
    { text: "and", highlight: false },
    { text: "build", highlight: false },
    { text: "your", highlight: true },
    { text: "ideas", highlight: true },
  ]

  // Don't render particles until after hydration
  if (!isMounted) {
    return (
      <section 
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/95"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(0,186,242,0.12),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(255,154,60,0.12),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[1.1]">
              We design and build
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">
                your ideas
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              <span className="inline-block px-6 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
                Transform your vision into reality with our expert team of designers and developers.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-[200px]" 
                asChild
              >
                <Link href="/services">
                  <span className="flex items-center justify-center">
                    Explore Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/25 min-w-[200px]" 
                asChild
              >
                <Link href="/inquiry">
                  <span className="flex items-center justify-center">
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
      {/* Enhanced Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: cursorVariant === "hover" ? 1.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.3,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: cursorVariant === "hover" ? 180 : 0,
          }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 bg-background/10 backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-1 h-1 rounded-full bg-primary/60" />
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Background with Dynamic Gradients */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
          style={{
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: [`${mousePosition.x * 0.02}px ${mousePosition.y * 0.02}px`],
          }}
        />
        
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute top-0 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/20 to-transparent blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-0 -right-20 w-[700px] h-[700px] rounded-full bg-gradient-to-l from-secondary/20 to-transparent blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-accent/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Enhanced Floating Particles */}
      {floatingParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-${particle.color}/20 dark:bg-${particle.color}/10`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            scale: [1, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, 1],
            opacity: [0.2, 0.5, 0.2, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div 
        style={{ opacity, scale, y, filter: `blur(${blur}px)` }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Animated Headline with Word-by-Word and Letter Animation */}
          <motion.div
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-[1.1]"
          >
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {headlineWords.map((word, wordIndex) => (
                <motion.span
                  key={wordIndex}
                  variants={wordVariants}
                  className="inline-block"
                  onHoverStart={() => setActiveWord(wordIndex)}
                  onHoverEnd={() => setActiveWord(null)}
                >
                  {word.text.split('').map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      custom={letterIndex + wordIndex * 10}
                      variants={letterVariants}
                      className={`inline-block transition-all duration-300 ${
                        word.highlight 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary' 
                          : ''
                      } ${activeWord === wordIndex ? 'scale-110' : ''}`}
                      style={{
                        display: 'inline-block',
                        transformOrigin: 'center bottom',
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  {wordIndex < headlineWords.length - 1 && (
                    <span className="inline-block w-2" />
                  )}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Description with Floating Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative mb-12"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                <span className="relative inline-block px-8 py-4 rounded-2xl bg-background/50 backdrop-blur-md border border-border/50 shadow-lg">
                  <motion.span
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10">
                    Transform your vision into reality with our expert team of designers and developers.
                    <span className="block text-sm mt-2 text-primary/70">We create powerful digital experiences that drive results.</span>
                  </span>
                </span>
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced CTA Buttons with Improved Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setCursorVariant("hover")}
              onHoverEnd={() => setCursorVariant("default")}
            >
              <Button 
                size="lg" 
                variant="default" 
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl shadow-primary/25 min-w-[220px] transition-all duration-300" 
                asChild
              >
                <Link href="/services">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    Explore Services
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setCursorVariant("hover")}
              onHoverEnd={() => setCursorVariant("default")}
            >
              <Button 
                size="lg" 
                variant="secondary" 
                className="group relative overflow-hidden bg-secondary hover:bg-secondary/90 text-secondary-foreground border-2 border-secondary/20 shadow-xl hover:shadow-2xl shadow-secondary/25 min-w-[220px] transition-all duration-300" 
                asChild
              >
                <Link href="/inquiry">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    Start Your Project
                    <motion.span
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="ml-2 h-4 w-4" />
                    </motion.span>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
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
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  )
}