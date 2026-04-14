'use client'

import { FormEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CarFront, HandCoins, Mail, Phone, PhoneCall, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
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
        className="fixed top-1/2 left-1/2 z-50 h-[min(86vh,640px)] w-[min(94vw,980px)] max-w-none -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-[0_24px_90px_rgba(0,0,0,0.42)]"
      >
        <div className="max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-card text-card-foreground">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside
              className="p-5 lg:border-r lg:border-border/60"
              style={heroImage ? { backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              <p className="text-2xl font-extrabold leading-none tracking-tight text-luxury-black">MEGAPLEX PRIME</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Luxury Desk, Mumbai</p>

              <div className="mt-3 h-[calc(100%-54px)] rounded-xl border border-[#E1E4EB] bg-white p-4">
                <p className="text-3xl font-serif font-semibold text-luxury-black">We Promise</p>
                <div className="mt-4 space-y-2.5 text-sm text-foreground">
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
                    hello@megaplexprime.in
                  </p>
                </div>
              </div>
            </aside>

            <section className="relative h-full p-5 sm:p-6">
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close enquiry form"
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-luxury-black text-white shadow-md transition-transform hover:scale-105"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>

              <h2
                className="max-w-[36rem] pr-10 text-2xl font-bold leading-tight text-foreground sm:text-3xl"
                style={{ whiteSpace: 'normal', wordBreak: 'keep-all' }}
              >
                Register Here And Avail The <span className="text-luxury-gold">Best Offers</span>
              </h2>

              <form onSubmit={handleSubmit} className="mt-5 flex h-[calc(100%-76px)] flex-col gap-4">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40"
                  placeholder="Name"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40"
                  placeholder="Email Address"
                />

                <div className="grid gap-3 sm:grid-cols-[0.45fr_0.55fr]">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-luxury-gold/40"
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
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/40"
                    placeholder="Phone number"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 inline-flex w-full items-center justify-center rounded-md border border-[#9B1E56] bg-[#9B1E56] px-6 py-3.5 text-xl font-semibold text-white transition-colors hover:bg-[#841947] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Get Instant Call Back'}
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
