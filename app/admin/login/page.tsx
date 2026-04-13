'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { loginAdmin } from '@/lib/content-api'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('1234')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = await loginAdmin(email, password)
      localStorage.setItem('adminToken', payload.token)
      router.push('/admin/dashboard')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-24 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-black/10 dark:bg-white/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl p-8 md:p-10 shadow-2xl"
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Enterprise Admin Access
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">Megaplex Prime Control</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Secure sign-in for authorized administrators managing global brand content operations.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2 block">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter secure password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 text-background font-semibold disabled:opacity-60 hover:opacity-90"
          >
            <LockKeyhole className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/80 text-xs text-muted-foreground flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Premium Control Suite
          </span>
          <span>Compliance-ready admin interface</span>
        </div>
      </motion.div>
    </main>
  )
}
