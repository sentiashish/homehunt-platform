'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Archive, CheckCircle, Circle, Mail, MessageSquare, Phone, RefreshCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { fetchInquiries, InquiryRecord, updateInquiryStatus } from '@/lib/inquiry-api'

export default function AdminInquiriesPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'archived'>('all')
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadInquiries() {
      const token = localStorage.getItem('adminToken')

      if (!token) {
        setError('Admin session not found. Please sign in again.')
        setIsLoading(false)
        return
      }

      try {
        const payload = await fetchInquiries(token)
        if (isMounted) {
          setInquiries(payload)
          setSelectedInquiry((current) => current || payload[0] || null)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load inquiries')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInquiries()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredInquiries = useMemo(
    () => (filterStatus === 'all' ? inquiries : inquiries.filter((inquiry) => inquiry.status === filterStatus)),
    [filterStatus, inquiries]
  )

  const summary = useMemo(
    () => ({
      total: inquiries.length,
      newCount: inquiries.filter((item) => item.status === 'new').length,
      contacted: inquiries.filter((item) => item.status === 'contacted').length,
      archived: inquiries.filter((item) => item.status === 'archived').length,
    }),
    [inquiries]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-emerald-100 text-emerald-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return Circle
      case 'contacted':
        return CheckCircle
      case 'archived':
        return Archive
      default:
        return Circle
    }
  }

  const formatDate = (value?: string) => {
    if (!value) return 'Recent'

    const date = new Date(value)
    return Number.isNaN(date.getTime())
      ? 'Recent'
      : date.toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: '2-digit',
        })
  }

  const refreshInquiries = async () => {
    const token = localStorage.getItem('adminToken')

    if (!token) {
      toast.error('Admin session not found')
      return
    }

    try {
      setIsLoading(true)
      const payload = await fetchInquiries(token)
      setInquiries(payload)
      setSelectedInquiry((current) => current || payload[0] || null)
      toast.success('Inquiries refreshed')
    } catch (loadError) {
      toast.error(loadError instanceof Error ? loadError.message : 'Failed to refresh inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  const changeStatus = async (status: InquiryRecord['status']) => {
    if (!selectedInquiry) return

    const token = localStorage.getItem('adminToken')

    if (!token) {
      toast.error('Admin session not found')
      return
    }

    setIsSaving(true)

    try {
      const updated = await updateInquiryStatus(selectedInquiry.id, status, token)
      setInquiries((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setSelectedInquiry(updated)
      toast.success(`Marked as ${status}`)
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : 'Failed to update inquiry')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Lead management</p>
          <h1 className="font-serif text-4xl font-bold mb-2">Inquiries</h1>
          <p className="text-muted-foreground">Track enquiries submitted from the website and contact popup.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={refreshInquiries}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </motion.button>
      </motion.div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total', value: summary.total, icon: MessageSquare },
          { label: 'New', value: summary.newCount, icon: Circle },
          { label: 'Contacted', value: summary.contacted, icon: CheckCircle },
          { label: 'Archived', value: summary.archived, icon: Archive },
        ].map((item, index) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold">{item.value}</p>
                </div>
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {(['all', 'new', 'contacted', 'archived'] as const).map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-5 py-2.5 font-semibold transition-all ${
              filterStatus === status
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          Loading enquiries...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-h-[760px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-span-2"
          >
            <div className="divide-y divide-border overflow-y-auto">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => {
                  const StatusIcon = getStatusIcon(inquiry.status)
                  const isSelected = selectedInquiry?.id === inquiry.id

                  return (
                    <motion.button
                      key={inquiry.id}
                      type="button"
                      whileHover={{ backgroundColor: 'var(--muted)' }}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`w-full px-6 py-5 text-left transition-colors ${
                        isSelected ? 'bg-muted/80' : 'bg-transparent'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                          <p className="text-sm text-muted-foreground">{inquiry.property || 'General Enquiry'}</p>
                        </div>
                        <StatusIcon
                          className={`mt-1 h-5 w-5 ${
                            inquiry.status === 'new'
                              ? 'text-blue-600'
                              : inquiry.status === 'contacted'
                                ? 'text-emerald-600'
                                : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{inquiry.message}</p>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </motion.button>
                  )
                })
              ) : (
                <div className="p-10 text-center text-muted-foreground">
                  <p>No inquiries with this status</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl border border-border bg-card shadow-sm"
          >
            {selectedInquiry ? (
              <div className="p-6">
                <div className="mb-6 border-b border-border pb-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Selected enquiry</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{selectedInquiry.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedInquiry.property || 'General Enquiry'}</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Email</label>
                    <a href={`mailto:${selectedInquiry.email}`} className="mt-1 block text-sm hover:text-accent">
                      {selectedInquiry.email}
                    </a>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Phone</label>
                    <a href={`tel:${selectedInquiry.phone}`} className="mt-1 block text-sm hover:text-accent">
                      {selectedInquiry.phone}
                    </a>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Received</label>
                    <p className="mt-1 text-sm">{formatDate(selectedInquiry.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Message</label>
                    <p className="mt-2 rounded-2xl border border-border bg-background p-4 text-sm leading-relaxed">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  <div className="grid gap-3 border-t border-border pt-5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSaving || selectedInquiry.status === 'contacted'}
                      onClick={() => changeStatus('contacted')}
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-accent-foreground transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Contacted
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSaving || selectedInquiry.status === 'archived'}
                      onClick={() => changeStatus('archived')}
                      className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 font-semibold transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </motion.button>
                    <motion.a
                      href={`mailto:${selectedInquiry.email}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 font-semibold transition-all hover:bg-muted"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Reply by Email
                    </motion.a>
                    <motion.a
                      href={`tel:${selectedInquiry.phone}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 font-semibold transition-all hover:bg-muted"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center rounded-xl border border-destructive text-destructive transition-all hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <p>Select an inquiry to view details</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
