'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Home, MessageSquare, LogOut, Menu, X, ShieldCheck } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Home },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false)
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    setIsCheckingAuth(false)
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-background" />
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.replace('/admin/login?signedOut=1')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border"
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-border">
            <div className="w-10 h-10 bg-luxury-gold rounded-lg flex items-center justify-center text-luxury-black font-bold">
              L
            </div>
            <span className="font-serif font-bold text-lg">Luxe Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    pathname === item.href
                      ? 'bg-accent/15 text-accent'
                      : 'text-foreground hover:bg-muted hover:text-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-border">
            <div className="mb-3 px-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Secure Session</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background/80 text-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive transition-colors font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </span>
              <ShieldCheck className="w-4 h-4 opacity-70" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col overflow-hidden"
        animate={{ marginLeft: sidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20 bg-card border-b border-border px-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Admin Console</span>
              <span className="text-sm font-semibold">Operations</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold shadow-sm">
              OP
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
