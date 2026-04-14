'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDays, Camera, Heart, Mail, MessageSquareText, UserRound } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { fetchCurrentUser } from '@/lib/user-api'
import { clearUserSession, getUserToken } from '@/lib/user-auth'
import { getSavedPropertyIds } from '@/lib/wishlist'
import { fetchProperties } from '@/lib/property-api'
import { formatINR } from '@/lib/currency'
import { getLocalInquiryHistory, InquiryRecord } from '@/lib/inquiry-api'
import { properties, Property } from '@/lib/properties'

interface AccountUser {
  id: string
  name: string
  email: string
  createdAt?: string
}

type AccountTab = 'overview' | 'queries' | 'liked'

const ACCOUNT_PHOTO_KEY = 'userAccountPhoto'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AccountTab>('overview')
  const [photo, setPhoto] = useState<string>('')
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [savedProperties, setSavedProperties] = useState<Property[]>([])

  useEffect(() => {
    const token = getUserToken()

    if (!token) {
      router.push('/login')
      return
    }

    const authToken = token

    async function loadUser() {
      try {
        const [payload, catalog] = await Promise.all([
          fetchCurrentUser(authToken),
          fetchProperties().catch(() => properties),
        ])

        setUser(payload.user)
        setPhoto(localStorage.getItem(ACCOUNT_PHOTO_KEY) || '')
        setInquiries(getLocalInquiryHistory())

        const savedIds = getSavedPropertyIds()
        setSavedProperties(catalog.filter((property) => savedIds.includes(property.id)))
      } catch {
        clearUserSession()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  useEffect(() => {
    const handleWishlistChange = async () => {
      const catalog = await fetchProperties().catch(() => properties)
      const savedIds = getSavedPropertyIds()
      setSavedProperties(catalog.filter((property) => savedIds.includes(property.id)))
    }

    window.addEventListener('wishlist-changed', handleWishlistChange)
    return () => window.removeEventListener('wishlist-changed', handleWishlistChange)
  }, [])

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return 'Recently joined'
    return new Date(user.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [user?.createdAt])

  const initials = useMemo(() => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [user?.name])

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = typeof reader.result === 'string' ? reader.result : ''
      if (!imageData) return
      setPhoto(imageData)
      localStorage.setItem(ACCOUNT_PHOTO_KEY, imageData)
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-7 w-48 rounded bg-muted" />
                <div className="h-5 w-64 rounded bg-muted" />
                <div className="h-5 w-56 rounded bg-muted" />
              </div>
            ) : (
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border" />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-foreground text-background flex items-center justify-center text-2xl font-bold">
                        {initials}
                      </div>
                    )}
                    <label
                      htmlFor="profile-photo"
                      className="absolute -bottom-2 -right-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground shadow"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                    <input id="profile-photo" type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold">{user?.name}</h1>
                    <p className="mt-1 text-muted-foreground">Personal account dashboard</p>
                    <p className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      Member since {memberSince}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                  <div className="rounded-xl border border-border px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Liked</p>
                    <p className="text-2xl font-bold mt-1">{savedProperties.length}</p>
                  </div>
                  <div className="rounded-xl border border-border px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Queries</p>
                    <p className="text-2xl font-bold mt-1">{inquiries.length}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {!loading && (
            <>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'overview', label: 'My Account', icon: UserRound },
                  { key: 'queries', label: 'My Complaints & Queries', icon: MessageSquareText },
                  { key: 'liked', label: 'Liked Properties', icon: Heart },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key as AccountTab)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-card text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-6">My Account Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Full Name</p>
                      <p className="font-semibold text-lg">{user?.name}</p>
                    </div>
                    <div className="rounded-xl border border-border p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Email</p>
                      <p className="font-semibold text-lg inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'queries' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-2">My Complaints & Queries</h2>
                  <p className="text-sm text-muted-foreground mb-6">Shows your latest submitted inquiries from this device.</p>

                  {inquiries.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <p className="text-muted-foreground">No queries yet. Submit one from property pages or contact form.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((item) => (
                        <div key={item.id} className="rounded-xl border border-border p-4">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-semibold">{item.property || 'General Enquiry'}</p>
                            <span className="text-xs rounded-full px-2.5 py-1 w-fit bg-muted text-muted-foreground">
                              {(item.status || 'new').toUpperCase()}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'Recently'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'liked' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h2 className="text-2xl font-semibold mb-2">Liked Properties</h2>
                  <p className="text-sm text-muted-foreground mb-6">Your saved homes collection.</p>

                  {savedProperties.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center">
                      <p className="text-muted-foreground mb-4">No liked properties yet.</p>
                      <Link
                        href="/properties"
                        className="inline-flex items-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background"
                      >
                        Browse Properties
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedProperties.map((property) => (
                        <Link
                          key={property.id}
                          href={`/properties/${property.id}`}
                          className="rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex gap-3">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="h-20 w-24 rounded-lg object-cover"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold line-clamp-1">{property.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{property.location}</p>
                              <p className="mt-2 text-accent font-semibold">{formatINR(property.price)}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
