'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import { loginUser } from '@/lib/user-api'
import { setUserSession } from '@/lib/user-auth'

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const created = params.get('created')
    const prefillEmail = params.get('email')

    if (prefillEmail) {
      setEmail(prefillEmail)
    }

    if (created === '1') {
      toast.success('Account created. Please login with your credentials.')
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter email and password')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = await loginUser(email.trim().toLowerCase(), password)
      setUserSession(payload.token, payload.user)
      toast.success('Welcome back. Login successful.')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto rounded-3xl border border-border bg-card p-8 shadow-xl"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">User Access</p>
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-muted-foreground mb-6">Sign in to continue your premium property journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 font-semibold disabled:opacity-60"
            >
              <LockKeyhole className="w-4 h-4" />
              {isSubmitting ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/signup" className="font-semibold text-foreground hover:text-accent">
              Create an account
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
