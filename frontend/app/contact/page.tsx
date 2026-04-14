import { BadgeCheck, Building2, Mail, Phone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const promisePoints = ['Instant Call Back', 'Free Site Visit', 'Trusted Pricing']

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2F7]">
      <Navbar />

      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/75 shadow-[0_26px_80px_-38px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="relative flex h-full min-h-[560px] flex-col justify-between overflow-hidden p-7 sm:p-10">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/properties/mansion-1.jpg')" }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/78 via-[#0B1220]/70 to-[#0B1220]/58 backdrop-blur-[2px]" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                    <Building2 className="h-4 w-4" />
                    Premium Contact Desk
                  </div>

                  <h1 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">HOMEHUNT</h1>
                  <p className="mt-2 text-base text-white/85 sm:text-lg">Luxury Desk, Mumbai</p>

                  <div className="mt-8 rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-md sm:p-6">
                    <h2 className="text-lg font-semibold text-white">We Promise</h2>
                    <div className="mt-4 space-y-3">
                      {promisePoints.map((point) => (
                        <div key={point} className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/8 px-3 py-2.5">
                          <BadgeCheck className="h-5 w-5 shrink-0 text-[#14B8A6]" />
                          <p className="text-sm font-medium text-white sm:text-base">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                  <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-white/90 transition-colors hover:text-white sm:text-base">
                    <Phone className="h-4 w-4 text-[#14B8A6]" />
                    Phone: +91 98765 43210
                  </a>
                  <a href="mailto:hello@homehunt.in" className="flex items-center gap-3 text-sm text-white/90 transition-colors hover:text-white sm:text-base">
                    <Mail className="h-4 w-4 text-[#14B8A6]" />
                    Email: hello@homehunt.in
                  </a>
                </div>
              </div>

              <div className="flex h-full min-h-[560px] flex-col justify-center bg-white p-7 sm:p-10">
                <div className="mx-auto w-full max-w-lg">
                  <h2 className="text-3xl font-semibold leading-tight text-[#0B1220] sm:text-4xl">
                    Register Here And Avail The Best Offers
                  </h2>

                  <form className="mt-8 space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="lead-name" className="text-sm font-medium text-slate-700">
                        Name
                      </label>
                      <input
                        id="lead-name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.55)] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lead-email" className="text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <input
                        id="lead-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.55)] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                      <div className="space-y-1.5">
                        <label htmlFor="lead-country-code" className="text-sm font-medium text-slate-700">
                          Country Code
                        </label>
                        <select
                          id="lead-country-code"
                          name="countryCode"
                          defaultValue="+91"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.55)] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
                        >
                          <option value="+91">India (+91)</option>
                          <option value="+1">USA (+1)</option>
                          <option value="+44">UK (+44)</option>
                          <option value="+971">UAE (+971)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="lead-phone" className="text-sm font-medium text-slate-700">
                          Phone Number
                        </label>
                        <input
                          id="lead-phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.55)] outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#7C3AED] px-5 text-sm font-semibold text-white shadow-[0_16px_35px_-20px_rgba(124,58,237,0.95)] transition hover:bg-[#6D28D9]"
                    >
                      Get Instant Call Back
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}