'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Our Team', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Properties',
      links: [
        { label: 'Browse All', href: '/properties' },
        { label: 'Featured', href: '#' },
        { label: 'New Listings', href: '#' },
        { label: 'Sold', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ]

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ]

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <span className="font-bold text-white dark:text-black">L</span>
              </div>
              <span className="font-sans font-semibold text-lg text-black dark:text-white">Luxe</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
              Discover exceptional premium properties curated for clients across Mumbai and India.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">hello@megaplexprime.in</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">Bandra Kurla Complex, Mumbai 400051</span>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          {footerSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-gray-400 hover:text-luxury-gold transition-colors text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-luxury-gray-700 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Luxe Properties. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, color: '#C9A14A' }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-luxury-gold transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
