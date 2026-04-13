'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, CheckCircle, Circle, Archive } from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  property: string
  message: string
  date: string
  status: 'new' | 'contacted' | 'archived'
}

const inquiries: Inquiry[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    property: 'Modern Penthouse with Skyline Views',
    message: 'Very interested in this property. Can we schedule a viewing?',
    date: '2024-04-14',
    status: 'new',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 234-5678',
    property: 'Beachfront Villa with Pool',
    message: 'Would like more information about financing options.',
    date: '2024-04-13',
    status: 'contacted',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 345-6789',
    property: 'Contemporary Downtown Loft',
    message: 'Interested in this property for investment purposes.',
    date: '2024-04-12',
    status: 'archived',
  },
  {
    id: '4',
    name: 'Emma Williams',
    email: 'emma@example.com',
    phone: '+1 (555) 456-7890',
    property: 'Historic Estate with Gardens',
    message: 'Love this property! When can we visit?',
    date: '2024-04-11',
    status: 'new',
  },
]

export default function AdminInquiriesPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'archived'>('all')

  const filteredInquiries =
    filterStatus === 'all' ? inquiries : inquiries.filter((i) => i.status === filterStatus)

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

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-serif text-4xl font-bold mb-2">Inquiries</h1>
        <p className="text-muted-foreground">Manage property inquiries from interested clients</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex gap-2 mb-8 flex-wrap"
      >
        {(['all', 'new', 'contacted', 'archived'] as const).map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === status
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inquiries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 bg-card rounded-xl shadow-md overflow-hidden"
        >
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => {
                const StatusIcon = getStatusIcon(inquiry.status)
                return (
                  <motion.div
                    key={inquiry.id}
                    whileHover={{ backgroundColor: 'var(--muted)' }}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="p-6 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                        <p className="text-sm text-muted-foreground">{inquiry.property}</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.2 }}>
                        <StatusIcon
                          className={`w-5 h-5 ${
                            inquiry.status === 'new'
                              ? 'text-blue-600'
                              : inquiry.status === 'contacted'
                                ? 'text-emerald-600'
                                : 'text-gray-600'
                          }`}
                        />
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{inquiry.message}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">{inquiry.date}</span>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>No inquiries with this status</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-card rounded-xl shadow-md overflow-hidden"
        >
          {selectedInquiry ? (
            <div className="p-6">
              <div className="mb-6 pb-6 border-b border-border">
                <h3 className="font-serif text-2xl font-bold mb-2">{selectedInquiry.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedInquiry.property}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Email</label>
                  <motion.a
                    href={`mailto:${selectedInquiry.email}`}
                    whileHover={{ color: 'var(--accent)' }}
                    className="block text-sm mt-1"
                  >
                    {selectedInquiry.email}
                  </motion.a>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Phone</label>
                  <motion.a
                    href={`tel:${selectedInquiry.phone}`}
                    whileHover={{ color: 'var(--accent)' }}
                    className="block text-sm mt-1"
                  >
                    {selectedInquiry.phone}
                  </motion.a>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
                  <p className="text-sm mt-1">{selectedInquiry.date}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Message</label>
                  <p className="text-sm mt-2 leading-relaxed">{selectedInquiry.message}</p>
                </div>

                <div className="pt-6 border-t border-border space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Mark as Contacted
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-all"
                  >
                    Archive
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 border border-destructive text-destructive rounded-lg font-semibold hover:bg-destructive/10 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground h-full flex items-center justify-center">
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
