'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { properties } from '@/lib/properties'
import { fetchProperties } from '@/lib/property-api'
import { getUserToken } from '@/lib/user-auth'
import { getSavedPropertyIds, removeSavedProperty } from '@/lib/wishlist'

export default function WishlistPage() {
  const router = useRouter()
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [propertyList, setPropertyList] = useState(properties)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getUserToken()) {
      toast.message('Please login to view your wishlist')
      router.push('/login')
      return
    }

    const loadSaved = () => {
      setSavedIds(getSavedPropertyIds())
    }

    async function loadCatalog() {
      try {
        const payload = await fetchProperties()
        setPropertyList(payload)
      } catch {
        setPropertyList(properties)
      } finally {
        setLoading(false)
      }
    }

    loadSaved()
    loadCatalog()

    const handleWishlistChange = () => loadSaved()
    window.addEventListener('wishlist-changed', handleWishlistChange)

    return () => window.removeEventListener('wishlist-changed', handleWishlistChange)
  }, [router])

  const savedProperties = useMemo(
    () => propertyList.filter((property) => savedIds.includes(property.id)),
    [propertyList, savedIds]
  )

  const handleRemove = (propertyId: string) => {
    removeSavedProperty(propertyId)
    toast.success('Removed from wishlist')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Your Collection</p>
              <h1 className="text-3xl md:text-4xl font-bold">Wishlist</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
              <Heart className="w-4 h-4 text-accent" />
              {savedProperties.length} saved
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-[420px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : savedProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-10 text-center"
            >
              <Heart className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No saved properties yet</h2>
              <p className="text-muted-foreground mb-6">Tap the heart icon on any property to add it here.</p>
              <button
                onClick={() => router.push('/properties')}
                className="inline-flex items-center rounded-lg bg-foreground text-background px-5 py-2.5 font-semibold"
              >
                Browse Properties
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedProperties.map((property) => (
                <div key={property.id} className="relative">
                  <button
                    onClick={() => handleRemove(property.id)}
                    className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-white/95 border border-border px-3 py-1.5 text-xs font-semibold hover:bg-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
