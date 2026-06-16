'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const { user, userProfile, loading } = useAuth();
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/kategori', label: 'Kategori' },
    { href: '/event', label: 'Event' },
  ];

  const cartCount = getCartCount();

  if (isDashboard) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-nav border-b border-outline-variant/50'
          : 'bg-white border-b border-outline-variant'
      }`}
    >
      <nav className="max-w-container mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-light rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">T</span>
            </div>
            <span className="font-display text-xl font-extrabold text-primary">
              Thrivea
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-primary font-bold border-b-2 border-secondary pb-1'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari produk UMKM..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/keranjang"
            className="relative p-2 text-on-surface-variant hover:text-secondary transition-all rounded-lg hover:bg-secondary/5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* User Area */}
          {loading ? (
            <div className="w-8 h-8 rounded-full skeleton" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-sm font-bold">
                      {(userProfile?.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-card-hover border border-outline-variant/50 py-2 animate-scale-in">
                  <div className="px-4 py-3 border-b border-outline-variant/50">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {userProfile?.displayName || 'Pengguna'}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {user.email}
                    </p>
                  </div>
                  {userProfile?.role === 'seller' && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard Toko
                    </Link>
                  )}
                  <Link
                    href="/pesanan"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Pesanan Saya
                  </Link>
                  <hr className="my-1 border-outline-variant/50" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      import('@/lib/auth').then((m) => m.logOut());
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/masuk"
                className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-4 py-2 text-sm font-bold bg-secondary text-white rounded-xl hover:brightness-110 transition-all shadow-button"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-secondary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant animate-slide-down">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari produk UMKM..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all outline-none"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-sm font-medium border-b border-outline-variant/30 ${
                  pathname === link.href ? 'text-secondary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
