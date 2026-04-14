'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Maximize2, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { formatINR } from '@/lib/currency'
import { getUserToken } from '@/lib/user-auth'
import { saveProperty } from '@/lib/wishlist'
import AuthActionModal from './AuthActionModal'

export interface Property {
  id: string
  title: string
  location: string
  price: number
  image: string
  bedrooms: number
  area: number
  featured?: boolean
}

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'featured'
}

export default function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const [authOpen, setAuthOpen] = useState(false)
  const pendingActionRef = useRef<null | (() => void)>(null)

  const handleSaveProperty = () => {
    const result = saveProperty(property.id)

    if (result.added) {
      toast.success('Property saved to your account')
      return
    }

    toast.message('Property already saved')
  }

  const runProtectedAction = (action: () => void) => {
    if (!getUserToken()) {
      pendingActionRef.current = action
      setAuthOpen(true)
      return
    }

    action()
  }

  const handleSaveClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    runProtectedAction(handleSaveProperty)
  }

  const handleAuthSuccess = () => {
    if (pendingActionRef.current) {
      pendingActionRef.current()
      pendingActionRef.current = null
    }
  }

  if (variant === 'featured') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative group rounded-2xl overflow-hidden cursor-pointer h-96 flex-shrink-0 w-80 shadow-lg"
        >
          <motion.img
            src={property.image}
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-300" />

          <button
            onClick={handleSaveClick}
            className="absolute top-4 left-4 z-10 rounded-full bg-black/50 text-white p-2 backdrop-blur-sm hover:bg-black/70"
            aria-label="Save property"
          >
            <Heart className="w-4 h-4" />
          </button>

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="font-sans text-2xl font-bold text-white mb-2">{property.title}</h3>
              <p className="text-gray-200 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {property.location}
              </p>
              <p className="text-accent font-bold text-xl mb-4">{formatINR(property.price)}</p>
              <Link href={`/properties/${property.id}`}>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white hover:text-accent transition-colors font-semibold text-sm"
                >
                  View Property <ChevronRight className="w-4 h-4 ml-2" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <AuthActionModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group h-full"
      >
        <Link href={`/properties/${property.id}`}>
          <div className="netflix-scale bg-card rounded-2xl overflow-hidden card-elevation h-full flex flex-col border border-gray-100 dark:border-gray-900">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <motion.img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover object-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <button
                onClick={handleSaveClick}
                className="absolute top-4 left-4 z-10 rounded-full bg-white/90 text-gray-800 p-2 hover:bg-white"
                aria-label="Save property"
              >
                <Heart className="w-4 h-4" />
              </button>
              {property.featured && (
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="min-h-[3.5rem] font-sans text-xl font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                  {property.title}
                </h3>

                <p className="min-h-[1.5rem] text-gray-600 dark:text-gray-400 text-sm flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </p>

                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-accent font-bold text-2xl">{formatINR(property.price)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 dark:border-gray-900 pt-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Bed className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Maximize2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{property.area.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                className="mt-6 flex items-center text-accent hover:text-accent/70 transition-colors font-semibold text-sm"
              >
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      <AuthActionModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  )
}
