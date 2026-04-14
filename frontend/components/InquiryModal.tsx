'use client'

import { FormEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CarFront, HandCoins, Mail, Phone, PhoneCall, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { submitInquiry } from '@/lib/inquiry-api'

interface InquiryModalProps {
  open: boolean
  onClose: () => void
  source?: string
  propertyId?: string
  propertyName?: string
  heroImage?: string
}

const countryCodes = [
  { label: 'India (+91)', value: '+91' },
  { label: 'United States (+1)', value: '+1' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'United Arab Emirates (+971)', value: '+971' },
]

export default function InquiryModal({ open, onClose, source = 'website', propertyId, propertyName, heroImage }: InquiryModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setCountryCode('+91')
  }, [open])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: `${countryCode} ${phone.trim()}`,
        property: propertyName || 'General Enquiry',
        propertyId,
        message: `Call back request for ${propertyName || 'general enquiry'}`,
        source,
      })

      toast.success('Your enquiry has been submitted successfully')
      setName('')
      setEmail('')
      setPhone('')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit enquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden rounded-2xl border-0 bg-transparent p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] sm:p-0"
      >
        <DialogTitle className="sr-only">
          {propertyName ? `Inquiry for ${propertyName}` : 'General enquiry form'}
        </DialogTitle>
        <div className="h-full w-full max-h-[calc(100vh-32px)] max-w-4xl overflow-y-auto rounded-2xl border border-border/50 bg-card text-card-foreground sm:max-h-[90vh]">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <aside
              className="p-6 lg:basis-[40%] lg:border-r lg:border-border/60"
              style={heroImage ? { backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              <div>
                <p className="text-xl font-extrabold leading-none tracking-tight sm:text-2xl text-luxury-black">HOMEHUNT</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">Luxury Desk, Mumbai</p>
              </div>

              <div className="mt-3 rounded-xl border border-[#E1E4EB] bg-white p-3 sm:p-4">
                <p className="text-xl font-serif font-semibold sm:text-2xl text-luxury-black">We Promise</p>
                <div className="mt-3 space-y-2 text-xs sm:space-y-2.5 sm:text-sm text-foreground">
                  <p className="flex items-center gap-2.5 font-medium">
                    <PhoneCall className="h-4 w-4 text-luxury-gold" />
                    Instant Call Back
                  </p>
                  <p className="flex items-center gap-2.5 font-medium">
                    <CarFront className="h-4 w-4 text-luxury-gold" />
                    Free Site Visit
                  </p>
                  <p className="flex items-center gap-2.5 font-medium">
                    <HandCoins className="h-4 w-4 text-luxury-gold" />
                    Trusted Pricing
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-luxury-gold" />
                    +91 98765 43210
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-luxury-gold" />
                    hello@homehunt.in
                  </p>
                </div>
              </div>
            </aside>

            <section className="relative h-full p-5 sm:p-6 lg:basis-[60%] lg:overflow-y-auto">
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close enquiry form"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-luxury-black text-white shadow-md transition-transform hover:scale-105"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>

              <h2 className="pr-8 text-lg font-bold leading-tight sm:text-xl text-foreground" style={{ whiteSpace: 'normal', wordBreak: 'keep-all' }}>
                Register Here & Avail The <span className="text-luxury-gold">Best Offers</span>
              </h2>

              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:gap-4">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40 sm:py-2.5"
                  placeholder="Your name"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40 sm:py-2.5"
                  placeholder="Email address"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-luxury-gold/40 sm:basis-2/5 sm:py-2.5"
                  >
                    {countryCodes.map((code) => (
                      <option key={code.value} value={code.value}>
                        {code.label}
                      </option>
                    ))}
                  </select>

                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    inputMode="tel"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40 sm:basis-3/5 sm:py-2.5"
                    placeholder="Phone number"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-[#9B1E56] bg-[#9B1E56] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#841947] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
                </motion.button>
              </form>
            </section>
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-border/70 bg-luxury-black px-4 py-3 text-lg font-semibold text-luxury-gold">
            <Phone className="h-4 w-4" />
            +91 98765 43210
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
