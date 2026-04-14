'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  cta?: {
    primary: { label: string; href: string }
    secondary?: { label: string; href: string }
  }
  showScrollIndicator?: boolean
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage = '/hero-bg.jpg',
  cta,
  showScrollIndicator = true,
}: HeroSectionProps) {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <motion.img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            {title}
          </h1>
        </motion.div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-sans text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
          >
            <motion.a
              href={cta.primary.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all shadow-lg"
            >
              {cta.primary.label}
            </motion.a>
            {cta.secondary && (
              <motion.a
                href={cta.secondary.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
              >
                {cta.secondary.label}
              </motion.a>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <ChevronDown className="text-white w-8 h-8 opacity-70" />
        </motion.div>
      )}
    </div>
  )
}
