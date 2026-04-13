'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { fetchCurrentUser } from '@/lib/user-api'
import { clearUserSession, getUserToken } from '@/lib/user-auth'

interface AccountUser {
  id: string
  name: string
  email: string
  createdAt?: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getUserToken()

    if (!token) {
      router.push('/login')
      return
    }

    async function loadUser() {
      try {
        const payload = await fetchCurrentUser(token)
        setUser(payload.user)
      } catch {
        clearUserSession()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-7 w-48 rounded bg-muted" />
                <div className="h-5 w-64 rounded bg-muted" />
                <div className="h-5 w-56 rounded bg-muted" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-3">Welcome, {user?.name}</h1>
                <p className="text-muted-foreground mb-1">Email: {user?.email}</p>
                <p className="text-muted-foreground">Your account is active and ready.</p>
              </>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
