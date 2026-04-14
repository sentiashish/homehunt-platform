'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Building2, Compass, Handshake, BadgeCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'

const pillars = [
  {
    title: 'Curated Inventory',
    description:
      'Each project is handpicked for architecture quality, location value, and long-term livability.',
    icon: Building2,
  },
  {
    title: 'Transparent Guidance',
    description:
      'From shortlist to site visit and paperwork, every step is clear, documented, and client-first.',
    icon: Handshake,
  },
  {
    title: 'Market Intelligence',
    description:
      'Real-time trend signals and neighborhood context to help buyers make confident decisions.',
    icon: Compass,
  },
]

const trustPoints = [
  'Dedicated relationship manager for every inquiry',
  'Verified project information and disclosure-first process',
  'Priority site-visit scheduling and premium walkthrough support',
  'Post-booking assistance for documentation and onboarding',
]

const teamMembers = [
  {
    name: 'Aarav Mehta',
    role: 'Head of Advisory',
    focus: 'Luxury buyer strategy and portfolio matching',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Nisha Kapoor',
    role: 'Client Success Lead',
    focus: 'Site visits, experience flow, and onboarding',
    image: '/placeholder-user.jpg',
  },
  {
    name: 'Rohan Iyer',
    role: 'Market Intelligence',
    focus: 'Micro-market insights and pricing confidence',
    image: '/placeholder-user.jpg',
  },
]

const timeline = [
  {
    phase: '01. Discovery',
    title: 'Understand Your Intent',
    description: 'We map lifestyle goals, timeline, and budget fit before shortlisting any project.',
  },
  {
    phase: '02. Curation',
    title: 'Build a Sharp Shortlist',
    description: 'Only high-fit options are presented with clear pros, trade-offs, and context.',
  },
  {
    phase: '03. Decision',
    title: 'Evaluate with Confidence',
    description: 'Guided walkthroughs, verification-first documentation, and negotiation support.',
  },
  {
    phase: '04. Onboarding',
    title: 'Close Smoothly',
    description: 'Structured handover support with post-booking assistance and follow-through.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <HeroSection
        title="About HomeHunt"
        subtitle="A modern luxury real estate experience built for clarity, trust, and high-conviction decisions."
        backgroundImage="/properties/countryside-8.jpg"
        showScrollIndicator={false}
      />

      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="rounded-2xl border border-border bg-card p-7 md:p-9">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Our Perspective
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">Luxury should feel effortless, not confusing.</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                HomeHunt was built to simplify premium property discovery for modern buyers. We blend curation,
                design, and operational precision so clients can move from exploration to ownership with confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 md:p-9">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Our Mission
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">Deliver trust-first real estate experiences.</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We prioritize transparency, responsiveness, and quality control at every touchpoint so clients always
                know what to expect and why a decision matters.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Why Clients Choose Us</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              A balance of premium design standards and practical execution that keeps the buying journey smooth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-border bg-background p-6"
                >
                  <div className="inline-flex rounded-xl bg-accent/15 p-3 text-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border bg-card p-8 md:p-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Client Promise</h2>
            <p className="mt-3 text-muted-foreground">
              We keep communication precise and proactive so your journey stays premium from first click to handover.
            </p>

            <div className="mt-7 space-y-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <BadgeCheck className="w-5 h-5 text-accent mt-0.5" />
                  <p className="text-sm md:text-base text-foreground/90">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Team</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Specialists who combine premium service standards with practical real estate execution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.focus}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Journey Timeline</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              A clear, client-friendly workflow designed to keep decisions fast and stress-free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">{item.phase}</p>
                <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}