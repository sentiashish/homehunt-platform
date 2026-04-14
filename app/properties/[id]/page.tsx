'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PropertyCarousel from '@/components/PropertyCarousel'
import { properties } from '@/lib/properties'
import { motion } from 'framer-motion'
import { Download, Phone, Mail, MapPin, Bed, Maximize2, Calendar, ChevronLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { formatINR } from '@/lib/currency'
import { getUserToken } from '@/lib/user-auth'
import AuthActionModal from '@/components/AuthActionModal'
import InquiryModal from '@/components/InquiryModal'
import { saveProperty } from '@/lib/wishlist'
import { toast } from 'sonner'
import { fetchProperties } from '@/lib/property-api'

interface PropertyDetailsPageProps {
  params: {
    id: string
  }
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const [propertyList, setPropertyList] = useState(properties)
  const property = propertyList.find((p) => p.id === params.id)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const pendingActionRef = useRef<null | (() => void)>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProperties() {
      try {
        const payload = await fetchProperties()
        if (isMounted) {
          setPropertyList(payload)
        }
      } catch {
        if (isMounted) {
          setPropertyList(properties)
        }
      }
    }

    loadProperties()

    return () => {
      isMounted = false
    }
  }, [])

  const similarProperties = propertyList.filter(
    (p) => p.id !== params.id && p.location === property?.location
  )

  if (!property) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">Property Not Found</h1>
            <Link href="/properties" className="text-accent hover:underline">
              Back to Properties
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const runProtectedAction = (action: () => void) => {
    if (!getUserToken()) {
      pendingActionRef.current = action
      setAuthOpen(true)
      return
    }

    action()
  }

  const handleSave = () => {
    const result = saveProperty(property.id)

    if (result.added) {
      toast.success('Property saved to your account')
      return
    }

    toast.message('Property already saved')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <section className="pt-32 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/properties" className="flex items-center text-accent hover:text-accent/80 group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
        </div>
      </section>

      {/* Hero Image Gallery */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-elevation"
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* Thumbnail Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mt-6"
          >
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-24 rounded-lg bg-muted cursor-pointer hover:ring-2 ring-accent transition-all overflow-hidden"
              >
                <img
                  src={property.image}
                  alt={`${property.title} view ${idx}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Property Info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="font-serif text-5xl font-bold mb-2">{property.title}</h1>
              <p className="text-lg text-muted-foreground flex items-center mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {property.location}
              </p>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8 pb-8 border-b border-border"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-accent font-bold text-4xl">{formatINR(property.price)}</p>
                  <button
                    onClick={() => runProtectedAction(handleSave)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
                  >
                    <Heart className="w-4 h-4" />
                    Save Property
                  </button>
                </div>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 mb-12"
              >
                <div className="bg-card rounded-lg p-6">
                  <Bed className="w-6 h-6 text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <Maximize2 className="w-6 h-6 text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="text-2xl font-bold">{property.area.toLocaleString()}</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <Calendar className="w-6 h-6 text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Year Built</p>
                  <p className="text-2xl font-bold">{property.yearBuilt}</p>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="font-serif text-3xl font-bold mb-4">About This Property</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{property.description}</p>
              </motion.div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-12"
                >
                  <h2 className="font-serif text-3xl font-bold mb-6">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center space-x-3 p-4 bg-card rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-2 h-2 bg-luxury-gold rounded-full" />
                        <span className="font-medium">{amenity}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Card */}
              <div className="bg-card rounded-xl p-8 shadow-md sticky top-32">
                <h3 className="font-serif text-2xl font-bold mb-6">Ready to Inquire?</h3>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInquiryModal(true)}
                    className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Send Inquiry
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { window.location.href = 'tel:+919876543210' }}
                    className="w-full flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-all"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { window.location.href = 'mailto:sales@megaplexprime.in' }}
                    className="w-full flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-all"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Agent
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.success('Brochure download started')}
                    className="w-full flex items-center justify-center px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Brochure
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PropertyCarousel
              properties={similarProperties}
              title="Similar Properties in This Location"
              showTitle={true}
            />
          </div>
        </section>
      )}

      <Footer />

      <InquiryModal
        open={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        source="property-details"
        propertyId={property.id}
        propertyName={property.title}
        heroImage={property.image}
      />

      <AuthActionModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          if (pendingActionRef.current) {
            pendingActionRef.current()
            pendingActionRef.current = null
          }
        }}
      />
    </main>
  )
}
