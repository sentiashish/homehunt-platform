'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { formatINRCompact } from '@/lib/currency'

interface FilterSidebarProps {
  onFilterChange?: (filters: {
    priceMin: number
    priceMax: number
    location: string
    propertyType: string
  }) => void
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<string | null>('price')
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 5000000,
    location: '',
    propertyType: '',
  })

  const locations = ['New York', 'Los Angeles', 'Miami', 'San Francisco', 'Chicago']
  const propertyTypes = ['Apartment', 'House', 'Condo', 'Penthouse', 'Villa']

  const handleFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-xl p-6 shadow-md"
    >
      <h3 className="font-serif text-xl font-bold mb-6">Filters</h3>

      {/* Price Range */}
      <div className="mb-6">
        <motion.button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center mb-4 pb-4 border-b border-border"
        >
          <span className="font-semibold">Price Range</span>
          <motion.div
            animate={{ rotate: expanded === 'price' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {expanded === 'price' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Min Price</label>
              <input
                type="range"
                min="0"
                max="5000000"
                step="100000"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-semibold mt-2">
                {formatINRCompact(filters.priceMin)}
              </p>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Max Price</label>
              <input
                type="range"
                min="0"
                max="5000000"
                step="100000"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm font-semibold mt-2">
                {formatINRCompact(filters.priceMax)}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Location */}
      <div className="mb-6">
        <motion.button
          onClick={() => toggleSection('location')}
          className="w-full flex justify-between items-center mb-4 pb-4 border-b border-border"
        >
          <span className="font-semibold">Location</span>
          <motion.div
            animate={{ rotate: expanded === 'location' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {expanded === 'location' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {locations.map((loc) => (
              <motion.label
                key={loc}
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ x: 5 }}
              >
                <input
                  type="checkbox"
                  checked={filters.location === loc}
                  onChange={(e) => handleFilterChange('location', e.target.checked ? loc : '')}
                  className="w-4 h-4 rounded cursor-pointer accent-accent"
                />
                <span className="text-sm group-hover:text-accent transition-colors">{loc}</span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Property Type */}
      <div>
        <motion.button
          onClick={() => toggleSection('type')}
          className="w-full flex justify-between items-center mb-4 pb-4 border-b border-border"
        >
          <span className="font-semibold">Property Type</span>
          <motion.div
            animate={{ rotate: expanded === 'type' ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {expanded === 'type' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {propertyTypes.map((type) => (
              <motion.label
                key={type}
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ x: 5 }}
              >
                <input
                  type="checkbox"
                  checked={filters.propertyType === type}
                  onChange={(e) => handleFilterChange('propertyType', e.target.checked ? type : '')}
                  className="w-4 h-4 rounded cursor-pointer accent-accent"
                />
                <span className="text-sm group-hover:text-accent transition-colors">{type}</span>
              </motion.label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Reset Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setFilters({
            priceMin: 0,
            priceMax: 5000000,
            location: '',
            propertyType: '',
          })
        }}
        className="w-full mt-8 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-semibold"
      >
        Reset Filters
      </motion.button>
    </motion.div>
  )
}
