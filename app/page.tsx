'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, MapPin, Star } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PropertyCarousel from '@/components/PropertyCarousel'
import Footer from '@/components/Footer'
import SkeletonLoader from '@/components/SkeletonLoader'
import { properties } from '@/lib/properties'
import { fetchContent } from '@/lib/content-api'
import { ContentData } from '@/lib/content-types'

export default function Home() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

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

  const featuredProperties = useMemo(() => properties.filter((property) => property.featured), [])

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
          secondary: { label: 'Contact Us', href: '#contact' },
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

      <section id="contact" className="py-20 bg-luxury-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/10 rounded-full -ml-48 -mb-48" />

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-5xl font-bold mb-6">Ready to Visit the Site?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Speak with our Mumbai sales team and schedule your premium walkthrough.
          </p>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-2 px-10 py-4 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black font-bold rounded-lg transition-all shadow-lg text-lg"
          >
            <MapPin className="w-5 h-5" />
            Schedule a Consultation
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
