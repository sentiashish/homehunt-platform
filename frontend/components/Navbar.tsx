'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';
import { clearUserSession, getUserProfile, isUserLoggedIn } from '@/lib/user-auth';
import { getSavedPropertyIds } from '@/lib/wishlist';
import { toast } from 'sonner';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState('Account');
  const [savedCount, setSavedCount] = useState(0);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const syncAuthUi = () => {
      setLoggedIn(isUserLoggedIn());
      const profile = getUserProfile();
      setFirstName(profile?.name ? profile.name.split(' ')[0] : 'Account');
      setSavedCount(getSavedPropertyIds().length);
    };

    syncAuthUi();

    const handleStorage = () => syncAuthUi();
    const handleAuthChange = () => syncAuthUi();
    const handleWishlistChange = () => syncAuthUi();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('user-auth-changed', handleAuthChange);
    window.addEventListener('wishlist-changed', handleWishlistChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user-auth-changed', handleAuthChange);
      window.removeEventListener('wishlist-changed', handleWishlistChange);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current) {
        return;
      }

      if (!accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAccountMenu(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navItems: Array<{ label: 'Home' | 'Properties' | 'About' | 'Contact'; href: string }> = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Properties', href: '/properties' },
    { label: 'Contact', href: '/contact' },
  ];
  const showAdminEntry = !loggedIn && !pathname.startsWith('/admin');

  const handleSignOut = () => {
    clearUserSession();
    setLoggedIn(false);
    setShowAccountMenu(false);
    toast.success('Signed out successfully');
  };

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
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
              <span className="text-white dark:text-black font-bold text-sm">H</span>
            </motion.div>
            <span className="text-lg font-semibold hidden sm:inline tracking-tight text-gray-900 dark:text-gray-50">
              HomeHunt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div key={item.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  prefetch
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-accent/15 text-accent'
                      : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {loggedIn ? (
              <>
                <Link
                  href="/wishlist"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {savedCount > 0 ? savedCount : 'Wishlist'}
                </Link>
                <div ref={accountMenuRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setShowAccountMenu((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {firstName}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black shadow-xl p-1 z-50">
                      <Link
                        href="/account"
                        onClick={() => setShowAccountMenu(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        My Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90 transition-colors"
              >
                Login
              </Link>
            )}

            {showAdminEntry && (
              <Link
                href="/admin/login"
                className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Admin
              </Link>
            )}
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
                key={item.label}
                href={item.href}
                prefetch
                className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent/15 text-accent'
                    : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {loggedIn ? (
              <>
                <Link
                  href="/wishlist"
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Wishlist ({savedCount})
                </Link>
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
              <>
                <Link
                  href="/login"
                  className="mt-2 mx-4 inline-flex items-center justify-center rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                {showAdminEntry && (
                  <Link
                    href="/admin/login"
                    className="mx-4 mt-2 inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

