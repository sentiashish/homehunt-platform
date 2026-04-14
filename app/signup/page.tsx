'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import { signupUser } from '@/lib/user-api'
import { isStrongPassword, PASSWORD_RULE_TEXT } from '@/lib/auth-validation'

export default function UserSignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isStrongPassword(password)) {
      toast.error(PASSWORD_RULE_TEXT)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Password and confirm password must match')
      return
    }

    setIsSubmitting(true)

    try {
      await signupUser(name.trim(), email.trim().toLowerCase(), password)
      toast.success('Account created successfully. Please login to continue.')
      router.push(`/login?created=1&email=${encodeURIComponent(email.trim().toLowerCase())}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed')
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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Create Account</p>
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-muted-foreground mb-6">Join to save preferences and manage inquiries faster.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="mt-2 text-xs text-muted-foreground">{PASSWORD_RULE_TEXT}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-3 font-semibold disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-foreground hover:text-accent">
              Login
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
