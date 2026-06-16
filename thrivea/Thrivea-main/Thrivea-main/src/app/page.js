'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getDocuments } from '@/lib/firestore';

/* ─── Reusable Card Components ─── */
function ProductCard({ product }) {
  return (
    <Link href={`/produk/${product.slug || product.id}`} className="card-interactive p-4 group">
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-surface-container">
        <img
          src={product.images?.[0] || '/images/placeholder-product.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discountPrice && (
          <div className="absolute top-2 left-2 badge-error text-[10px]">
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-on-surface truncate mb-1">{product.name}</h4>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-base font-bold text-secondary">
          Rp {(product.discountPrice || product.price)?.toLocaleString('id-ID')}
        </span>
        {product.discountPrice && (
          <span className="text-xs text-on-surface-variant line-through">
            Rp {product.price?.toLocaleString('id-ID')}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
        <svg className="w-3.5 h-3.5 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>{product.rating?.average?.toFixed(1) || '0.0'}</span>
        <span className="mx-1">•</span>
        <span>{product.soldCount || 0} terjual</span>
      </div>
    </Link>
  );
}

function StoreCard({ store }) {
  return (
    <Link href={`/toko/${store.slug || store.id}`} className="card-interactive p-6 group">
      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-surface-container">
        <img
          src={store.banner || store.logo || '/images/placeholder-store.png'}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary text-white rounded-lg text-xs font-bold">
          Terverifikasi
        </div>
      </div>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-bold text-on-surface">{store.name}</h4>
        <div className="flex items-center gap-1 text-secondary">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold">{store.rating?.average?.toFixed(1) || '5.0'}</span>
        </div>
      </div>
      <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
        {store.description || 'Produk UMKM berkualitas tinggi.'}
      </p>
      <div className="flex items-center gap-2 mb-4">
        {(store.tags || [store.category || 'UMKM']).slice(0, 2).map((tag, i) => (
          <span key={i} className="badge-secondary">{tag}</span>
        ))}
      </div>
      <button className="w-full py-2.5 bg-secondary-container/30 text-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all">
        Kunjungi Toko
      </button>
    </Link>
  );
}

/* ─── Static Data for Demo ─── */
const DEMO_CATEGORIES = [
  { id: 1, name: 'Makanan & Minuman', slug: 'makanan-minuman', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', desc: 'Kuliner nusantara berkualitas ekspor.' },
  { id: 2, name: 'Fashion & Tekstil', slug: 'fashion-tekstil', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80', desc: 'Estetika modern Nusantara dengan kain premium.' },
  { id: 3, name: 'Kerajinan', slug: 'kerajinan', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', desc: 'Seni kerajinan tangan Indonesia.' },
  { id: 4, name: 'Aksesoris', slug: 'aksesoris', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', desc: 'Aksesoris unik buatan lokal.' },
];

const DEMO_STORES = [
  { id: '1', name: 'Keramik Bumi', slug: 'keramik-bumi', description: 'Seni keramik kontemporer dari perajin Kasongan, Yogyakarta.', category: 'Kerajinan', tags: ['Industrial', 'Premium'], rating: { average: 4.9, count: 128 }, banner: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80', isVerified: true },
  { id: '2', name: 'Kopi Ranah', slug: 'kopi-ranah', description: 'Biji kopi pilihan dari dataran tinggi Gayo dengan standar ekspor.', category: 'Makanan & Minuman', tags: ['Agro-Trade', 'Organik'], rating: { average: 4.8, count: 256 }, banner: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80', isVerified: true },
  { id: '3', name: 'Gaya Wastra', slug: 'gaya-wastra', description: 'Inovasi fashion berkelanjutan modern berbasis tenun NTT.', category: 'Fashion & Tekstil', tags: ['Fashion', 'Ekspor'], rating: { average: 5.0, count: 89 }, banner: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80', isVerified: true },
];

const DEMO_PRODUCTS = [
  { id: '1', name: 'Rendang Daging Sapi Premium', slug: 'rendang-daging-sapi', price: 85000, images: ['https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80'], rating: { average: 4.9 }, soldCount: 1250, category: 'Makanan & Minuman' },
  { id: '2', name: 'Kopi Arabika Gayo 250gr', slug: 'kopi-arabika-gayo', price: 75000, discountPrice: 62000, images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80'], rating: { average: 4.8 }, soldCount: 890, category: 'Makanan & Minuman' },
  { id: '3', name: 'Batik Tulis Pekalongan', slug: 'batik-tulis-pekalongan', price: 350000, images: ['https://images.unsplash.com/photo-1569587112025-0d460e81a126?w=400&q=80'], rating: { average: 4.7 }, soldCount: 234, category: 'Fashion & Tekstil' },
  { id: '4', name: 'Vas Keramik Handmade', slug: 'vas-keramik-handmade', price: 150000, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80'], rating: { average: 4.6 }, soldCount: 567, category: 'Kerajinan' },
  { id: '5', name: 'Gelang Perak Bali', slug: 'gelang-perak-bali', price: 120000, discountPrice: 98000, images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80'], rating: { average: 4.5 }, soldCount: 345, category: 'Aksesoris' },
  { id: '6', name: 'Sambal Matah Bali', slug: 'sambal-matah-bali', price: 35000, images: ['https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80'], rating: { average: 4.9 }, soldCount: 2100, category: 'Makanan & Minuman' },
  { id: '7', name: 'Tenun Ikat Sumba', slug: 'tenun-ikat-sumba', price: 450000, images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80'], rating: { average: 5.0 }, soldCount: 78, category: 'Fashion & Tekstil' },
  { id: '8', name: 'Madu Hutan Kalimantan', slug: 'madu-hutan-kalimantan', price: 95000, discountPrice: 79000, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80'], rating: { average: 4.8 }, soldCount: 670, category: 'Makanan & Minuman' },
];

/* ─── Homepage ─── */
export default function HomePage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [stores, setStores] = useState(DEMO_STORES);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const firestoreProducts = await getDocuments('products', [{ field: 'isActive', op: '==', value: true }], 'createdAt', 8);
        if (firestoreProducts.length > 0) setProducts(firestoreProducts);
      } catch (e) { /* fallback to demo data */ }
      setLoadingProducts(false);

      try {
        const firestoreStores = await getDocuments('stores', [], 'createdAt', 3);
        if (firestoreStores.length > 0) setStores(firestoreStores);
      } catch (e) { /* fallback to demo data */ }
      setLoadingStores(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 nusantara-pattern"></div>
        <div className="section-container grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 py-12">
          <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full border border-secondary/10 w-fit">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold">Produk Lokal Berkualitas Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight">
              Memberdayakan<br />
              <span className="text-gradient-secondary">Perdagangan</span>
              <br />Nusantara Modern
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed">
              Akses langsung ke produk UMKM Indonesia terbaik yang terkurasi. Menghubungkan kerajinan lokal dengan standar perdagangan modern.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace" className="btn-primary text-base">
                Jelajahi Marketplace
              </Link>
              <Link href="/daftar" className="btn-secondary text-base">
                Mulai Berjualan
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block animate-fade-in">
            <div className="relative z-10 aspect-square rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <img
                alt="Produk kerajinan Indonesia artisanal"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 z-20 glass-card-strong p-6 rounded-2xl shadow-xl flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary m-0 leading-none">15rb+</p>
                <p className="text-xs font-semibold text-on-surface-variant">Mitra Terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kategori Unggulan ─── */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Kategori Unggulan</h2>
              <p className="text-base text-on-surface-variant">Jelajahi keberagaman sektor industri Indonesia</p>
            </div>
            <Link href="/kategori" className="text-secondary font-bold flex items-center gap-1 group text-sm">
              Lihat Semua
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[500px]">
            {/* Food - Large */}
            <Link href={`/marketplace?category=${DEMO_CATEGORIES[0].slug}`} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer min-h-[200px]">
              <img alt={DEMO_CATEGORIES[0].name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={DEMO_CATEGORIES[0].image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                <h3 className="text-xl md:text-2xl font-bold text-white">{DEMO_CATEGORIES[0].name}</h3>
                <p className="text-white/80 text-sm hidden md:block">{DEMO_CATEGORIES[0].desc}</p>
              </div>
              <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Jelajahi
              </div>
            </Link>

            {/* Fashion */}
            <Link href={`/marketplace?category=${DEMO_CATEGORIES[1].slug}`} className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer min-h-[140px]">
              <img alt={DEMO_CATEGORIES[1].name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={DEMO_CATEGORIES[1].image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-lg md:text-2xl font-bold text-white">{DEMO_CATEGORIES[1].name}</h3>
                <p className="text-white/80 text-sm hidden md:block">{DEMO_CATEGORIES[1].desc}</p>
              </div>
            </Link>

            {/* Kerajinan */}
            <Link href={`/marketplace?category=${DEMO_CATEGORIES[2].slug}`} className="relative group overflow-hidden rounded-3xl cursor-pointer min-h-[140px]">
              <img alt={DEMO_CATEGORIES[2].name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={DEMO_CATEGORIES[2].image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-sm font-bold text-white">{DEMO_CATEGORIES[2].name}</h3>
              </div>
            </Link>

            {/* Aksesoris */}
            <Link href={`/marketplace?category=${DEMO_CATEGORIES[3].slug}`} className="relative group overflow-hidden rounded-3xl cursor-pointer min-h-[140px]">
              <img alt={DEMO_CATEGORIES[3].name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={DEMO_CATEGORIES[3].image} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-sm font-bold text-white">{DEMO_CATEGORIES[3].name}</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Produk Populer ─── */}
      <section className="section-spacing bg-white">
        <div className="section-container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Produk Populer</h2>
              <p className="text-base text-on-surface-variant">Produk UMKM terlaris pilihan pembeli</p>
            </div>
            <Link href="/marketplace" className="text-secondary font-bold flex items-center gap-1 group text-sm">
              Lihat Semua
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="aspect-square skeleton mb-3 rounded-2xl" />
                  <div className="h-4 skeleton mb-2 w-3/4" />
                  <div className="h-5 skeleton mb-2 w-1/2" />
                  <div className="h-3 skeleton w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Penjual Terverifikasi ─── */}
      <section className="section-spacing bg-surface-container">
        <div className="section-container">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Penjual Terverifikasi</h2>
            <p className="text-base text-on-surface-variant">Mitra terpercaya dalam ekosistem Thrivea</p>
          </div>

          {loadingStores ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="h-48 skeleton rounded-2xl mb-4" />
                  <div className="h-5 skeleton mb-2 w-1/2" />
                  <div className="h-4 skeleton mb-4 w-3/4" />
                  <div className="h-10 skeleton rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="section-spacing">
        <div className="section-container">
          <div className="gradient-hero rounded-[32px] md:rounded-[48px] overflow-hidden relative p-10 md:p-20 text-center text-white">
            <div className="absolute inset-0 nusantara-pattern opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Siap Mengembangkan Bisnismu?</h2>
              <p className="text-base md:text-lg mb-8 opacity-90 leading-relaxed">
                Bergabunglah dengan jaringan Thrivea. Kami menyediakan infrastruktur dan dukungan untuk membawa produk lokal ke panggung yang lebih luas.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/daftar" className="px-8 py-4 bg-secondary text-on-secondary rounded-2xl text-lg font-bold hover:brightness-110 transition-all shadow-button">
                  Bergabung sebagai Penjual
                </Link>
                <Link href="#" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-lg font-bold hover:bg-white/20 transition-all">
                  Pusat Bantuan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
