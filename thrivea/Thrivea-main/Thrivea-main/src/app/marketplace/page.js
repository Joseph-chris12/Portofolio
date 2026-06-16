'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getDocuments } from '@/lib/firestore';
import { CATEGORIES } from '@/utils/constants';

// --- Demo Data Fallback ---
const DEMO_PRODUCTS = [
  { id: '1', name: 'Rendang Daging Sapi Premium', slug: 'rendang-daging-sapi', price: 85000, category: 'Makanan & Minuman', images: ['https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&q=80'], rating: { average: 4.9 }, soldCount: 1250, storeId: '1', storeName: 'Dapur Minang', isActive: true },
  { id: '2', name: 'Kopi Arabika Gayo 250gr', slug: 'kopi-arabika-gayo', price: 75000, discountPrice: 62000, category: 'Makanan & Minuman', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80'], rating: { average: 4.8 }, soldCount: 890, storeId: '2', storeName: 'Kopi Ranah', isActive: true },
  { id: '3', name: 'Batik Tulis Pekalongan', slug: 'batik-tulis-pekalongan', price: 350000, category: 'Fashion & Tekstil', images: ['https://images.unsplash.com/photo-1569587112025-0d460e81a126?w=400&q=80'], rating: { average: 4.7 }, soldCount: 234, storeId: '3', storeName: 'Gaya Wastra', isActive: true },
  { id: '4', name: 'Vas Keramik Handmade', slug: 'vas-keramik-handmade', price: 150000, category: 'Kerajinan', images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80'], rating: { average: 4.6 }, soldCount: 567, storeId: '1', storeName: 'Keramik Bumi', isActive: true },
  { id: '5', name: 'Gelang Perak Bali', slug: 'gelang-perak-bali', price: 120000, discountPrice: 98000, category: 'Aksesoris', images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80'], rating: { average: 4.5 }, soldCount: 345, storeId: '4', storeName: 'Bali Silver', isActive: true },
  { id: '6', name: 'Sambal Matah Bali', slug: 'sambal-matah-bali', price: 35000, category: 'Makanan & Minuman', images: ['https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80'], rating: { average: 4.9 }, soldCount: 2100, storeId: '5', storeName: 'Bali Rasa', isActive: true },
  { id: '7', name: 'Tenun Ikat Sumba', slug: 'tenun-ikat-sumba', price: 450000, category: 'Fashion & Tekstil', images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80'], rating: { average: 5.0 }, soldCount: 78, storeId: '3', storeName: 'Gaya Wastra', isActive: true },
  { id: '8', name: 'Madu Hutan Kalimantan', slug: 'madu-hutan-kalimantan', price: 95000, discountPrice: 79000, category: 'Makanan & Minuman', images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80'], rating: { average: 4.8 }, soldCount: 670, storeId: '6', storeName: 'Borneo Naturals', isActive: true },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // If URL param changes, update state
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const constraints = [{ field: 'isActive', op: '==', value: true }];
        
        if (selectedCategory) {
          constraints.push({ field: 'category', op: '==', value: selectedCategory });
        }
        
        const firestoreProducts = await getDocuments('products', constraints, 'createdAt', 20);
        
        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        } else {
          // Filter demo data as fallback
          let filteredDemo = [...DEMO_PRODUCTS];
          if (selectedCategory) {
            const catObj = CATEGORIES.find(c => c.slug === selectedCategory);
            if (catObj) {
              filteredDemo = filteredDemo.filter(p => p.category === catObj.name);
            }
          }
          setProducts(filteredDemo);
        }
      } catch (error) {
        // Fallback to demo data on error
        let filteredDemo = [...DEMO_PRODUCTS];
        if (selectedCategory) {
          const catObj = CATEGORIES.find(c => c.slug === selectedCategory);
          if (catObj) {
            filteredDemo = filteredDemo.filter(p => p.category === catObj.name);
          }
        }
        setProducts(filteredDemo);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [selectedCategory]);

  // Client-side search & sort
  let displayedProducts = [...products];
  
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.storeName?.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'lowest') {
    displayedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortBy === 'highest') {
    displayedProducts.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortBy === 'popular') {
    displayedProducts.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  } else if (sortBy === 'rating') {
    displayedProducts.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
  }

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Marketplace</h1>
        <p className="text-on-surface-variant">Temukan produk UMKM pilihan dari seluruh Indonesia</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex gap-2 mb-4">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center w-12 h-12 bg-white border border-outline-variant rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 space-y-6`}>
          <div className="glass-card p-5">
            <h3 className="font-bold text-on-surface mb-4">Kategori</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category" 
                  checked={selectedCategory === ''} 
                  onChange={() => setSelectedCategory('')}
                  className="w-4 h-4 text-secondary focus:ring-secondary/30"
                />
                <span className={`text-sm group-hover:text-secondary transition-colors ${selectedCategory === '' ? 'font-bold text-secondary' : 'text-on-surface-variant'}`}>
                  Semua Kategori
                </span>
              </label>
              
              {CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat.slug} 
                    onChange={() => setSelectedCategory(cat.slug)}
                    className="w-4 h-4 text-secondary focus:ring-secondary/30"
                  />
                  <span className={`text-sm group-hover:text-secondary transition-colors ${selectedCategory === cat.slug ? 'font-bold text-secondary' : 'text-on-surface-variant'}`}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          {/* Top Bar: Desktop Search & Sort */}
          <div className="hidden lg:flex justify-between items-center mb-6 bg-white p-2 pl-4 rounded-2xl border border-outline-variant shadow-sm">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Cari produk atau toko..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-sm placeholder:text-on-surface-variant"
              />
              <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex items-center gap-2 border-l border-outline-variant pl-4 py-2">
              <span className="text-sm text-on-surface-variant">Urutkan:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terlaris</option>
                <option value="lowest">Harga Terendah</option>
                <option value="highest">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-on-surface-variant">
            Menampilkan <span className="font-bold text-on-surface">{displayedProducts.length}</span> produk {selectedCategory && `untuk kategori yang dipilih`}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="aspect-square skeleton mb-3 rounded-2xl" />
                  <div className="h-4 skeleton mb-2 w-3/4" />
                  <div className="h-5 skeleton mb-2 w-1/2" />
                  <div className="h-3 skeleton w-2/3" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayedProducts.map(product => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Produk tidak ditemukan</h3>
              <p className="text-on-surface-variant mb-6">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="btn-primary"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
