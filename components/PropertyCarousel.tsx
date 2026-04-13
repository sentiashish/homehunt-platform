'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import PropertyCard, { Property } from './PropertyCard'

interface PropertyCarouselProps {
  properties: Property[]
  title?: string
  showTitle?: boolean
}

export default function PropertyCarousel({
  properties,
  title = 'Featured Properties',
  showTitle = true,
}: PropertyCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('carousel-container')
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount

      container.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      })

      setScrollPosition(newPosition)
      setCanScrollLeft(newPosition > 0)
      setCanScrollRight(newPosition < container.scrollWidth - container.clientWidth - 50)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16"
    >
      {showTitle && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="font-sans text-4xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Explore our handpicked selection of luxury properties</p>
        </div>
      )}

      <div className="relative group">
        {/* Carousel Container */}
        <motion.div
          id="carousel-container"
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 sm:px-6 lg:px-8"
          style={{ scrollBehavior: 'smooth', scrollPaddingLeft: '32px' }}
          onWheel={(e) => e.preventDefault()}
        >
          {properties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-shrink-0 w-80"
            >
              <PropertyCard property={property} variant="featured" />
            </motion.div>
          ))}
        </motion.div>

        {/* Left Arrow - Always visible for Netflix feel */}
        <motion.button
          onClick={() => handleScroll('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        {/* Right Arrow - Always visible for Netflix feel */}
        <motion.button
          onClick={() => handleScroll('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.section>
  )
}
