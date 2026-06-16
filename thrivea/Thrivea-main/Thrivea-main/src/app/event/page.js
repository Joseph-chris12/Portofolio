'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';

// Demo data for events since we haven't implemented a CMS for events yet
export const DEMO_EVENTS = [
  {
    id: 'evt-001',
    name: 'Festival Kuliner Nusantara 2026',
    date: '15-17 Agustus 2026',
    time: '10:00 - 22:00 WIB',
    location: 'Gelora Bung Karno, Senayan, Jakarta',
    description: 'Festival kuliner terbesar tahun ini yang menghadirkan lebih dari 200 tenant UMKM kuliner dari seluruh nusantara. Diadakan dalam rangka memperingati Hari Kemerdekaan.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    category: 'Kuliner',
    tenantSlots: 200,
    availableSlots: 45,
    price: 1500000,
    status: 'open',
    organizer: 'Nusantara Event Organizer'
  },
  {
    id: 'evt-002',
    name: 'Bandung Creative Market',
    date: '5-6 September 2026',
    time: '09:00 - 21:00 WIB',
    location: 'Kiara Artha Park, Bandung',
    description: 'Wadah bagi para pelaku industri kreatif, fashion, dan kerajinan tangan lokal. Temukan produk-produk unik langsung dari kreatornya.',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80',
    category: 'Fashion & Kerajinan',
    tenantSlots: 100,
    availableSlots: 12,
    price: 850000,
    status: 'open',
    organizer: 'BDG Creative Hub'
  },
  {
    id: 'evt-003',
    name: 'Pameran Kopi Spesialti Indonesia',
    date: '20-22 November 2026',
    time: '10:00 - 20:00 WIB',
    location: 'JCC Senayan, Jakarta',
    description: 'Ajang bertemunya para petani kopi, roaster, dan penikmat kopi seluruh Indonesia. Ada kompetisi barista, talkshow, dan bazar biji kopi nusantara.',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
    category: 'Makanan & Minuman',
    tenantSlots: 80,
    availableSlots: 0,
    price: 2500000,
    status: 'full',
    organizer: 'Asosiasi Kopi Spesialti Indonesia'
  }
];

export default function EventListPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const filters = ['Semua', 'Kuliner', 'Fashion & Kerajinan', 'Makanan & Minuman'];

  const filteredEvents = activeFilter === 'Semua' 
    ? DEMO_EVENTS 
    : DEMO_EVENTS.filter(e => e.category === activeFilter);

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-primary/5 pt-12 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <span className="px-4 py-1.5 bg-white text-primary text-sm font-bold rounded-full border border-primary/20 shadow-sm inline-block mb-6">
            Event Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-on-surface mb-6 leading-tight">
            Temukan Event & Bazaar <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Terbaik untuk UMKM Anda
            </span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            Jelajahi berbagai event dan bazaar yang akan datang. Daftarkan toko Anda sebagai tenant untuk memperluas jangkauan pasar.
          </p>
          
          <div className="max-w-xl mx-auto flex bg-white p-2 rounded-2xl shadow-lg border border-outline-variant">
            <div className="flex-1 flex items-center px-4">
              <svg className="w-5 h-5 text-on-surface-variant mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Cari event, lokasi, atau kategori..." 
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface p-0"
              />
            </div>
            <button className="btn-primary px-6 py-3">Cari</button>
          </div>
        </div>
      </div>

      <div className="section-container relative -mt-8 z-10">
        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white text-on-surface-variant border border-outline-variant hover:border-primary/50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {filteredEvents.map(event => (
            <Link key={event.id} href={`/event/${event.id}`} className="card-interactive group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/50 transition-all">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${event.status === 'open' ? 'bg-success' : 'bg-error'}`}></div>
                  <span className="text-xs font-bold text-on-surface">
                    {event.status === 'open' ? 'Pendaftaran Buka' : 'Kuota Penuh'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-xs font-bold text-primary">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {event.name}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                    <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="line-clamp-2">{event.location}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Harga Sewa Tenant</p>
                    <p className="font-bold text-on-surface">{formatCurrency(event.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant mb-1">Sisa Slot</p>
                    <p className={`font-bold ${event.availableSlots > 0 ? 'text-primary' : 'text-error'}`}>
                      {event.availableSlots} / {event.tenantSlots}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
