'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';
import { DEMO_EVENTS } from '../page';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from Firestore
    // For MVP, we use the demo data
    const foundEvent = DEMO_EVENTS.find(e => e.id === params.id);
    setEvent(foundEvent || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-surface">
        <div className="h-64 md:h-96 bg-surface-container w-full"></div>
        <div className="section-container relative -mt-20 z-10">
          <div className="glass-card p-8 rounded-3xl h-96"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="section-container section-spacing text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-display font-bold mb-4 text-on-surface">Event Tidak Ditemukan</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">Event yang Anda cari mungkin sudah berakhir atau tautan tidak valid.</p>
        <Link href="/event" className="btn-primary">Kembali ke Daftar Event</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Event Hero */}
      <div className="h-64 md:h-[400px] w-full relative bg-surface-container overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute top-6 left-6 text-sm font-semibold text-white/80 flex gap-2">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/event" className="hover:text-white transition-colors">Event</Link>
        </div>
      </div>

      <div className="section-container relative -mt-20 md:-mt-32 z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3">
            <div className="glass-card p-6 md:p-10 rounded-[32px] shadow-xl mb-8 animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {event.category}
                </span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                  event.status === 'open' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'open' ? 'bg-success' : 'bg-error'}`}></div>
                  {event.status === 'open' ? 'Pendaftaran Buka' : 'Kuota Penuh'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-on-surface mb-6 leading-tight">
                {event.name}
              </h1>

              <div className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl mb-8 border border-outline-variant/50">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium mb-0.5">Penyelenggara</p>
                  <p className="font-bold text-on-surface">{event.organizer}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-3">Tentang Event</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                {/* Simulated tenant list for buyers */}
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-4">Tenant UMKM yang Berpartisipasi</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Placeholder tenants */}
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-outline-variant/50 rounded-xl hover:bg-surface-container transition-colors">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                          T{i}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-sm text-on-surface truncate">Toko UMKM {i}</p>
                          <p className="text-xs text-on-surface-variant">{event.category}</p>
                        </div>
                      </div>
                    ))}
                    {event.tenantSlots > 6 && (
                      <div className="flex items-center gap-3 p-3 border border-outline-variant/50 border-dashed rounded-xl justify-center bg-surface-container/30 text-on-surface-variant text-sm font-semibold">
                        + {event.tenantSlots - 6} Tenant Lainnya
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="glass-card p-6 md:p-8 rounded-[32px] shadow-xl sticky top-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-bold text-lg text-on-surface mb-6 border-b border-outline-variant/50 pb-4">Info Pelaksanaan</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">Tanggal</p>
                    <p className="font-bold text-on-surface">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">Waktu</p>
                    <p className="font-bold text-on-surface">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">Lokasi</p>
                    <p className="font-bold text-on-surface">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container p-5 rounded-2xl mb-6">
                <p className="text-sm text-on-surface-variant mb-2">Harga Sewa Tenant (Standar)</p>
                <p className="text-3xl font-display font-bold text-primary mb-4">{formatCurrency(event.price)}</p>
                
                <div className="h-px w-full bg-outline-variant/50 mb-4"></div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Kuota Tersedia</span>
                  <span className={`font-bold ${event.availableSlots > 0 ? 'text-on-surface' : 'text-error'}`}>
                    {event.availableSlots} / {event.tenantSlots} Slot
                  </span>
                </div>
              </div>

              {event.status === 'open' ? (
                <Link 
                  href={`/event/${event.id}/daftar`} 
                  className="w-full btn-primary py-4 shadow-button flex justify-center text-lg"
                >
                  Daftar Sebagai Tenant
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full bg-surface-container text-on-surface-variant font-bold py-4 rounded-xl cursor-not-allowed"
                >
                  Pendaftaran Ditutup
                </button>
              )}
              
              <p className="text-xs text-center text-on-surface-variant mt-4">
                Pendaftaran tenant khusus untuk Mitra Penjual UMKM yang sudah terdaftar.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
