'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import FilterSidebar from '@/components/FilterSidebar'
import HeroSection from '@/components/HeroSection'
import { properties } from '@/lib/properties'
import { motion } from 'framer-motion'
import { LayoutGrid, LayoutList, Search } from 'lucide-react'

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 5000000,
    location: '',
    propertyType: '',
  })

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = property.price >= filters.priceMin && property.price <= filters.priceMax

      const matchesLocation = !filters.location || property.location.includes(filters.location)

      return matchesSearch && matchesPrice && matchesLocation
    })
  }, [searchTerm, filters])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <HeroSection
        title="Luxury Properties"
        subtitle="Browse our exclusive collection of premium properties"
        backgroundImage="/placeholder.jpg"
        showScrollIndicator={false}
      />

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FilterSidebar onFilterChange={setFilters} />
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and View Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                </div>

                {/* View Toggle and Results Count */}
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      <LayoutList className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Properties Grid/List */}
              {filteredProperties.length > 0 ? (
                <motion.div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-6'
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground text-lg mb-4">No properties match your search</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm('')
                      setFilters({
                        priceMin: 0,
                        priceMax: 5000000,
                        location: '',
                        propertyType: '',
                      })
                    }}
                    className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
