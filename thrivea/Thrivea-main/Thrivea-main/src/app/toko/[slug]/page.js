'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDocuments } from '@/lib/firestore';
import { formatNumber } from '@/utils/formatters';

// --- Demo Data ---
const DEMO_STORE = {
  id: '1',
  name: 'Keramik Bumi',
  slug: 'keramik-bumi',
  description: 'Keramik Bumi adalah studio keramik kontemporer yang berbasis di sentra kerajinan Kasongan, Yogyakarta. Kami memproduksi berbagai macam keramik fungsional dan dekoratif dengan teknik hand-built dan wheel-throwing. Setiap karya kami adalah unik dan dibuat dengan penuh gairah oleh tangan-tangan perajin lokal.',
  category: 'Kerajinan',
  tags: ['Handmade', 'Lokal', 'Ramah Lingkungan'],
  logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&q=80',
  banner: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=80',
  rating: { average: 4.9, count: 128 },
  isVerified: true,
  createdAt: new Date('2024-01-15'),
  location: 'Yogyakarta, DI Yogyakarta'
};

const DEMO_PRODUCTS = [
  { id: '4', name: 'Vas Keramik Handmade', slug: 'vas-keramik-handmade', price: 150000, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80'], rating: { average: 4.6 }, soldCount: 567, category: 'Kerajinan' },
  { id: '11', name: 'Piring Keramik Estetik', slug: 'piring-keramik', price: 85000, images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80'], rating: { average: 4.9 }, soldCount: 342, category: 'Kerajinan' },
  { id: '12', name: 'Gelas Kopi Tembikar', slug: 'gelas-kopi-tembikar', price: 65000, discountPrice: 55000, images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80'], rating: { average: 4.8 }, soldCount: 890, category: 'Kerajinan' },
  { id: '13', name: 'Set Mangkuk Ramen', slug: 'set-mangkuk-ramen', price: 250000, images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80'], rating: { average: 5.0 }, soldCount: 124, category: 'Kerajinan' },
];

export default function StorePage() {
  const params = useParams();
  const slug = params.slug;
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('produk');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Try fetch store by slug or ID
        let storeData = null;
        let storeId = slug;
        
        const slugResults = await getDocuments('stores', [{ field: 'slug', op: '==', value: slug }]);
        if (slugResults && slugResults.length > 0) {
          storeData = slugResults[0];
          storeId = storeData.id;
        } else {
          const idResults = await getDocuments('stores', [{ field: '__name__', op: '==', value: slug }]);
          if (idResults && idResults.length > 0) {
            storeData = idResults[0];
          }
        }
        
        if (storeData) {
          setStore(storeData);
          // Fetch products for this store
          const productResults = await getDocuments('products', [
            { field: 'storeId', op: '==', value: storeId },
            { field: 'isActive', op: '==', value: true }
          ]);
          setProducts(productResults);
        } else {
          // Fallback to demo
          setStore(DEMO_STORE);
          setProducts(DEMO_PRODUCTS);
        }
      } catch (error) {
        setStore(DEMO_STORE);
        setProducts(DEMO_PRODUCTS);
      }
      setLoading(false);
    }
    
    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse bg-surface">
        <div className="h-48 md:h-64 bg-surface-container w-full"></div>
        <div className="section-container relative -mt-16 z-10">
          <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-surface-container border-4 border-white shadow-sm flex-shrink-0"></div>
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-8 bg-surface-container rounded w-1/3"></div>
              <div className="h-4 bg-surface-container rounded w-1/4"></div>
              <div className="h-4 bg-surface-container rounded w-full"></div>
              <div className="h-4 bg-surface-container rounded w-5/6"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="aspect-square skeleton mb-3 rounded-2xl" />
                <div className="h-4 skeleton mb-2 w-3/4" />
                <div className="h-5 skeleton mb-2 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="section-container section-spacing text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Toko tidak ditemukan</h2>
        <Link href="/marketplace" className="btn-primary">Kembali ke Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-20">
      {/* Banner */}
      <div className="h-48 md:h-72 w-full relative bg-surface-container overflow-hidden">
        <img 
          src={store.banner || '/images/placeholder-store-banner.jpg'} 
          alt={`Banner ${store.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="section-container relative -mt-16 md:-mt-20 z-10">
        {/* Store Profile Card */}
        <div className="glass-card p-6 md:p-8 rounded-[32px] shadow-lg mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Logo */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                <img 
                  src={store.logo || '/images/placeholder-store.png'} 
                  alt={`Logo ${store.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {store.isVerified && (
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-secondary text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm" title="Toko Terverifikasi">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-on-surface mb-1">
                    {store.name}
                  </h1>
                  <p className="text-on-surface-variant text-sm font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {store.location || 'Indonesia'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="btn-primary shadow-button py-2 px-5 text-sm">
                    Ikuti Toko
                  </button>
                  <button className="btn-secondary bg-white py-2 px-4 text-sm border border-outline-variant">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-outline-variant/50 mb-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-on-surface-variant font-medium mb-1">Penilaian</p>
                  <p className="font-bold text-on-surface flex items-center justify-center sm:justify-start gap-1">
                    <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {store.rating?.average?.toFixed(1) || '0.0'} <span className="text-xs text-on-surface-variant font-normal">({store.rating?.count || 0})</span>
                  </p>
                </div>
                <div className="text-center sm:text-left border-l border-outline-variant/50 pl-4">
                  <p className="text-xs text-on-surface-variant font-medium mb-1">Produk</p>
                  <p className="font-bold text-on-surface text-base">{products.length}</p>
                </div>
                <div className="text-center sm:text-left border-l border-outline-variant/50 pl-4">
                  <p className="text-xs text-on-surface-variant font-medium mb-1">Pengikut</p>
                  <p className="font-bold text-on-surface text-base">{formatNumber(1250)}</p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                {store.description}
              </p>
            </div>
          </div>
        </div>

        {/* Store Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Tabs */}
          <div className="flex border-b border-outline-variant/50 mb-6">
            <button 
              onClick={() => setActiveTab('produk')}
              className={`pb-3 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors relative ${activeTab === 'produk' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Produk ({products.length})
              {activeTab === 'produk' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('ulasan')}
              className={`pb-3 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors relative ${activeTab === 'ulasan' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Ulasan Toko
              {activeTab === 'ulasan' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('profil')}
              className={`pb-3 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors relative ${activeTab === 'profil' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Profil Lengkap
              {activeTab === 'profil' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'produk' && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.length > 0 ? products.map(product => (
                <Link key={product.id} href={`/produk/${product.slug || product.id}`} className="card-interactive p-3 sm:p-4 group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-container">
                    <img
                      src={product.images?.[0] || '/images/placeholder-product.png'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discountPrice && (
                      <div className="absolute top-2 left-2 badge-error text-[10px] sm:text-xs">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-on-surface truncate mb-1" title={product.name}>{product.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 mb-2">
                    <span className="text-sm sm:text-base font-bold text-secondary">
                      Rp {(product.discountPrice || product.price)?.toLocaleString('id-ID')}
                    </span>
                    {product.discountPrice && (
                      <span className="text-[10px] sm:text-xs text-on-surface-variant line-through">
                        Rp {product.price?.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-on-surface-variant">
                    <svg className="w-3 h-3 text-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
                    <span className="mx-0.5">•</span>
                    <span>{product.soldCount || 0} terjual</span>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center text-on-surface-variant">
                  Toko ini belum memiliki produk.
                </div>
              )}
            </div>
          )}

          {activeTab === 'ulasan' && (
            <div className="glass-card p-8 rounded-3xl text-center">
              <div className="w-20 h-20 bg-surface-container rounded-full mx-auto flex items-center justify-center text-on-surface-variant mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Ulasan Toko (MVP)</h3>
              <p className="text-on-surface-variant">
                Fitur ulasan lengkap akan segera hadir. Saat ini toko {store.name} memiliki rating rata-rata <span className="font-bold text-warning">{store.rating?.average?.toFixed(1)}</span> dari {store.rating?.count} ulasan produk.
              </p>
            </div>
          )}

          {activeTab === 'profil' && (
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-on-surface mb-4">Tentang {store.name}</h3>
              <div className="text-on-surface-variant leading-relaxed space-y-4 whitespace-pre-line">
                {store.description}
              </div>
              
              <h4 className="font-bold text-on-surface mt-8 mb-3">Kategori Produk Utama</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {(store.tags || []).map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-surface-container text-on-surface-variant text-sm font-medium rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
