'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clearUserSession, getUserProfile, isUserLoggedIn } from '@/lib/user-auth';
import { toast } from 'sonner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('Account');
  const [showLocations, setShowLocations] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const syncAuthUi = () => {
      setLoggedIn(isUserLoggedIn());
      const profile = getUserProfile();
      setFirstName(profile?.name ? profile.name.split(' ')[0] : 'Account');
    };

    syncAuthUi();

    const handleStorage = () => syncAuthUi();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore'];

  const handleSignOut = () => {
    clearUserSession();
    setLoggedIn(false);
    toast.success('Signed out successfully');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-md'
          : 'bg-white/70 dark:bg-black/60 backdrop-blur-sm'
      } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center"
            >
              <span className="text-white dark:text-black font-bold text-sm">L</span>
            </motion.div>
            <span className="text-lg font-semibold hidden sm:inline tracking-tight text-gray-900 dark:text-gray-50">
              Luxe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowLocations((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                {selectedCity}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showLocations && (
                <div className="absolute right-0 mt-2 w-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-xl p-1 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocations(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="hidden sm:inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  {firstName}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:inline-flex items-center rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90 transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Admin
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2 border-t border-gray-100 dark:border-gray-900 pt-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 py-2 text-xs uppercase tracking-[0.14em] text-gray-500">Projects in {selectedCity}</div>
            {loggedIn ? (
              <>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="mx-4 mt-1 w-[calc(100%-2rem)] rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-2 mx-4 inline-flex items-center justify-center rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              href="/admin/login"
              className="mx-4 mt-2 inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

