'use client'

import { FormEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LockKeyhole, UserPlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { loginUser, signupUser } from '@/lib/user-api'
import { setUserSession } from '@/lib/user-auth'
import { isStrongPassword, PASSWORD_RULE_TEXT } from '@/lib/auth-validation'

interface AuthActionModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthActionModal({ open, onClose, onSuccess }: AuthActionModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)

    try {
      if (mode === 'signup') {
        if (!isStrongPassword(password)) {
          toast.error(PASSWORD_RULE_TEXT)
          return
        }

        if (password !== confirmPassword) {
          toast.error('Password and confirm password must match')
          return
        }

        await signupUser(name.trim(), email.trim().toLowerCase(), password)
        toast.success('Account created. Please login to continue.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        return
      }

      const payload = await loginUser(email.trim().toLowerCase(), password)
      setUserSession(payload.token, payload.user)
      toast.success('Login successful')
      onClose()
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Continue Action</p>
                <h3 className="text-2xl font-bold mt-1">{mode === 'login' ? 'Login' : 'Sign Up'}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {mode === 'signup' && <p className="mt-2 text-xs text-muted-foreground">{PASSWORD_RULE_TEXT}</p>}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-3 font-semibold disabled:opacity-60"
              >
                {mode === 'login' ? <LockKeyhole className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isSubmitting
                  ? mode === 'login'
                    ? 'Logging In...'
                    : 'Creating Account...'
                  : mode === 'login'
                    ? 'Login'
                    : 'Create Account'}
              </button>
            </form>

            <button
              onClick={() => {
                const nextMode = mode === 'login' ? 'signup' : 'login'
                setMode(nextMode)
                setPassword('')
                setConfirmPassword('')
              }}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === 'login' ? 'New user? Create an account' : 'Already have an account? Login'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
