'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { logOut } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [pathname, isMobile]);

  // Protect route
  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('Silakan masuk untuk mengakses dashboard');
        router.push('/masuk');
      } else if (userProfile && userProfile.role !== 'seller') {
        toast.error('Halaman ini khusus untuk Mitra Penjual');
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || (userProfile && userProfile.role !== 'seller')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logOut();
    router.push('/masuk');
  };

  const navItems = [
    { 
      name: 'Ringkasan', 
      path: '/dashboard', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> 
    },
    { 
      name: 'Produk Saya', 
      path: '/dashboard/produk', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> 
    },
    { 
      name: 'Pesanan Masuk', 
      path: '/dashboard/pesanan', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> 
    },
    { 
      name: 'Event Saya', 
      path: '/dashboard/event', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
    },
    { 
      name: 'Pengaturan Toko', 
      path: '/dashboard/toko', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-outline-variant/50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      }`}>
        <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center h-[72px]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">T</span>
            </div>
            <span className="text-xl font-display font-extrabold text-primary">Thrivea</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full ml-1">Mitra</span>
          </Link>
          
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.path);
              
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface hover:bg-surface-container hover:text-primary'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-outline-variant/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-error hover:bg-error/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-surface">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-outline-variant/50 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-on-surface hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-xl font-bold text-on-surface hidden sm:block">
              Mitra Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-primary hover:text-secondary hidden sm:block">
              Lihat Toko
            </Link>
            <div className="h-8 w-px bg-outline-variant/50 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{userProfile?.displayName}</p>
                <p className="text-xs text-on-surface-variant">{userProfile?.storeName || 'Toko UMKM'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
