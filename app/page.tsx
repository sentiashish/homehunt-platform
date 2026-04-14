'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Building2, CheckCircle2, Clock3, Mail, MapPin, Phone, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PropertyCarousel from '@/components/PropertyCarousel'
import Footer from '@/components/Footer'
import InquiryModal from '@/components/InquiryModal'
import SkeletonLoader from '@/components/SkeletonLoader'
import { properties } from '@/lib/properties'
import { fetchProperties } from '@/lib/property-api'
import { fetchContent } from '@/lib/content-api'
import { ContentData } from '@/lib/content-types'

export default function Home() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [propertyList, setPropertyList] = useState(properties)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    let retryTimer: NodeJS.Timeout | null = null

    async function loadContent(isRetry = false) {
      try {
        const payload = await fetchContent()
        if (isMounted) {
          setContent(payload)
          setError('')
        }
      } catch (loadError) {
        if (isMounted) {
          const message = loadError instanceof Error ? loadError.message : 'Failed to load content'
          setError(message)

          // Keep trying in the background so the homepage heals automatically when backend starts.
          retryTimer = setTimeout(() => {
            loadContent(true)
          }, isRetry ? 6000 : 3000)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadContent()

    return () => {
      isMounted = false
      if (retryTimer) {
        clearTimeout(retryTimer)
      }
    }
  }, [])

  useEffect(() => {
    const openModal = () => setIsInquiryOpen(true)

    window.addEventListener('open-contact-modal', openModal)

    const params = new URLSearchParams(window.location.search)
    if (params.get('contact') === '1') {
      const section = document.getElementById('contact')
      if (section) {
        const navOffset = 88
        const targetTop = section.getBoundingClientRect().top + window.scrollY - navOffset
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
      }
      setIsInquiryOpen(true)
      params.delete('contact')
      const nextQuery = params.toString()
      window.history.replaceState({}, '', nextQuery ? `/?${nextQuery}#contact` : '/#contact')
    }

    return () => {
      window.removeEventListener('open-contact-modal', openModal)
    }
  }, [])

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

  const featuredProperties = useMemo(() => propertyList.filter((property) => property.featured), [propertyList])

  const stats = [
    { value: '500+', label: 'Properties Sold' },
    { value: '50K+', label: 'Happy Clients' },
    { value: '20+', label: 'Years Experience' },
  ]

  const testimonials = [
    {
      name: 'Priya Malhotra',
      role: 'Founder, Fintech Startup',
      content:
        'The curation and professionalism were outstanding. Every interaction felt premium and efficient.',
      image: '/placeholder-user.jpg',
      rating: 5,
    },
    {
      name: 'Arjun Bedi',
      role: 'Private Investor',
      content:
        'Excellent advisory and clear communication from shortlist to site visit. Very high trust factor.',
      image: '/placeholder-user.jpg',
      rating: 5,
    },
    {
      name: 'Rhea Kapoor',
      role: 'Design Consultant',
      content:
        'The quality of projects and client support exceeded expectations. Highly recommended for luxury buyers.',
      image: '/placeholder-user.jpg',
      rating: 5,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <HeroSection
        title={content?.hero.title || 'Luxury Real Estate, Engineered for Mumbai'}
        subtitle={content?.hero.subtitle || 'Experience iconic homes in the city\'s most strategic locations.'}
        backgroundImage="/hero-bg.jpg"
        cta={{
          primary: { label: 'Explore Properties', href: '/properties' },
          secondary: { label: 'Contact Us', href: '/?contact=1#contact' },
        }}
      />

      {error && (
        <section className="py-4 bg-destructive/10 border-y border-destructive/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm md:text-base">
              Backend connection issue: {error}. Fallback content is shown and auto-retry is active.
            </p>
          </div>
        </section>
      )}

      <section className="py-16 bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">{stat.value}</div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PropertyCarousel
            properties={featuredProperties}
            title="Featured Properties"
            showTitle={true}
          />
        </div>
      </section>

      <section id="about" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <SkeletonLoader type="text" count={5} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-background p-8"
              >
                <h2 className="font-serif text-4xl font-bold mb-4">Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{content?.overview}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl border border-border bg-background p-8"
              >
                <h2 className="font-serif text-4xl font-bold mb-4">Connectivity</h2>
                <p className="text-muted-foreground leading-relaxed">{content?.connectivity}</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-4xl font-bold mb-4">Amenities</h2>
            <p className="text-muted-foreground">Designed to match high-performance city lifestyles.</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-xl border border-border p-6 bg-card animate-pulse h-44" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(content?.amenities || []).map((amenity) => (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-border p-6 bg-card"
                >
                  <h3 className="text-xl font-semibold mb-3">{amenity.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{amenity.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">About Megaplex Prime</h2>
              {isLoading ? <SkeletonLoader type="text" count={4} /> : <p className="text-muted-foreground leading-relaxed">{content?.about}</p>}
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-2xl font-semibold mb-4">Construction Updates</h3>
              <div className="space-y-3">
                {(content?.constructionUpdates || []).map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {(content?.faqs || []).map((faq) => (
              <details key={faq.question} className="rounded-xl border border-border bg-card p-5 group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-semibold">{faq.question}</span>
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Experience the Megaplex Prime difference through the eyes of our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card rounded-xl p-8 shadow-md hover:shadow-elevation transition-all"
              >
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-luxury-black via-[#111111] to-[#1C1C1C] py-14 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-luxury-gold/10 -mr-40 -mt-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/10 -ml-40 -mb-40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 max-w-2xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-luxury-gold backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              Private Client Desk
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Speak with a property advisor.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
              Quick help for site visits, pricing and availability.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-7"
            >
              <div className="mb-6 flex items-center gap-3 text-luxury-gold">
                <div className="rounded-full border border-luxury-gold/30 bg-luxury-gold/10 p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
                  Concierge support
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Phone,
                    label: 'Call directly',
                    value: '+91 98765 43210',
                    href: 'tel:+919876543210',
                  },
                  {
                    icon: Mail,
                    label: 'Email our team',
                    value: 'hello@megaplexprime.in',
                    href: 'mailto:hello@megaplexprime.in',
                  },
                  {
                    icon: MapPin,
                    label: 'Visit the office',
                    value: 'Bandra Kurla Complex, Mumbai 400051',
                    href: 'https://maps.google.com/?q=Bandra%20Kurla%20Complex%2C%20Mumbai%20400051',
                  },
                  {
                    icon: Clock3,
                    label: 'Response window',
                    value: 'Within 2 business hours',
                    href: '#contact',
                  },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-luxury-gold/30 hover:bg-white/10"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-luxury-gold/10 text-luxury-gold transition-colors group-hover:bg-luxury-gold group-hover:text-luxury-black">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-6 text-white">{item.value}</p>
                    </a>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/95 p-6 text-luxury-black shadow-2xl sm:p-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-luxury-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-600">
                <Clock3 className="h-4 w-4 text-luxury-gold" />
                Premium consultation
              </div>

              <h3 className="mt-5 font-serif text-2xl font-bold sm:text-3xl">Request a consultation.</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                Share your requirement and our team will call you quickly.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'Dedicated advisor',
                  'Fast shortlist and follow-up',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-luxury-gray-50 p-3.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <p className="text-sm leading-6 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsInquiryOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-luxury-black px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-luxury-black/90"
                >
                  <Clock3 className="h-4 w-4" />
                  Enquire now
                </button>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-4 text-sm font-semibold text-gray-800 transition-all hover:border-luxury-gold hover:text-luxury-gold"
                >
                  <Phone className="h-4 w-4" />
                  Call now
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-luxury-gold/20 bg-luxury-gold/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-luxury-gold">Fast access</p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Call now for immediate support.
                </p>
                <a
                  href="tel:+919876543210"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-luxury-black transition-colors hover:text-luxury-gold"
                >
                  Schedule a consultation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <InquiryModal
        open={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        source="homepage-contact"
        heroImage="/hero-bg.jpg"
      />

      <Footer />
    </main>
  )
}
