'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { getDocuments } from '@/lib/firestore';

// --- Demo Data Fallback ---
const DEMO_PRODUCT = { 
  id: '1', 
  name: 'Rendang Daging Sapi Premium', 
  slug: 'rendang-daging-sapi', 
  price: 85000, 
  discountPrice: 79000,
  category: 'Makanan & Minuman', 
  images: [
    'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=800&q=80',
    'https://images.unsplash.com/photo-1626200419188-f5a11eb19710?w=800&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'
  ], 
  description: 'Rendang Daging Sapi Premium dimasak menggunakan bumbu rempah pilihan khas Minang. Daging sapi pilihan yang empuk dipadu dengan bumbu rendang yang meresap sempurna. \n\nSangat cocok untuk lauk pauk sehari-hari maupun untuk hidangan spesial.\n\nBerat bersih: 250 gram\nKetahanan: 14 hari di suhu ruang, 2 bulan di dalam kulkas.',
  rating: { average: 4.9, count: 128 }, 
  soldCount: 1250, 
  storeId: '1', 
  storeName: 'Dapur Minang',
  stock: 45,
  isActive: true 
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        // Try fetch by slug
        const results = await getDocuments('products', [{ field: 'slug', op: '==', value: slug }]);
        if (results && results.length > 0) {
          setProduct(results[0]);
        } else {
          // Try fetch by ID (fallback)
          const resultsById = await getDocuments('products', [{ field: '__name__', op: '==', value: slug }]);
          if (resultsById && resultsById.length > 0) {
            setProduct(resultsById[0]);
          } else {
            // Fallback to demo
            setProduct(DEMO_PRODUCT);
          }
        }
      } catch (error) {
        setProduct(DEMO_PRODUCT);
      }
      setLoading(false);
    }
    
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    if (!product || product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="section-container section-spacing animate-pulse">
        <div className="h-4 bg-surface-container rounded w-48 mb-8"></div>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-surface-container rounded-2xl mb-4"></div>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-surface-container rounded-xl"></div>
              <div className="w-20 h-20 bg-surface-container rounded-xl"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-surface-container rounded w-3/4"></div>
            <div className="h-6 bg-surface-container rounded w-1/4"></div>
            <div className="h-10 bg-surface-container rounded w-1/3 my-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-container rounded"></div>
              <div className="h-4 bg-surface-container rounded"></div>
              <div className="h-4 bg-surface-container rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-container section-spacing text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <Link href="/marketplace" className="btn-primary">Kembali ke Marketplace</Link>
      </div>
    );
  }

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-on-surface-variant mb-8 animate-fade-in">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
        <span className="mx-2">/</span>
        <Link href={`/marketplace?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-on-surface font-semibold truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left: Images */}
        <div className="w-full lg:w-5/12 animate-fade-in-up">
          <div className="aspect-square bg-surface-container rounded-[32px] overflow-hidden mb-4 relative">
            <img 
              src={product.images?.[activeImage] || '/images/placeholder-product.png'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPrice && (
              <div className="absolute top-4 left-4 badge-error text-sm px-3 py-1">
                Diskon {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-primary' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-7/12 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="flex items-center text-warning font-bold">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-base">{product.rating?.average?.toFixed(1) || '0.0'}</span>
              <span className="text-on-surface-variant font-normal ml-1">({product.rating?.count || 0} ulasan)</span>
            </div>
            <div className="w-1 h-1 bg-outline rounded-full"></div>
            <div className="text-on-surface-variant">
              Terjual <span className="font-semibold text-on-surface">{product.soldCount || 0}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-4xl font-bold text-secondary mb-2">
              Rp {currentPrice?.toLocaleString('id-ID')}
            </div>
            {product.discountPrice && (
              <div className="text-lg text-on-surface-variant line-through">
                Rp {product.price?.toLocaleString('id-ID')}
              </div>
            )}
          </div>

          <div className="h-px bg-outline-variant/50 w-full mb-8"></div>

          {/* Store Mini Card */}
          <Link href={`/toko/${product.storeId}`} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl mb-8 group hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {product.storeName ? product.storeName.charAt(0) : 'T'}
              </div>
              <div>
                <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                  {product.storeName}
                </h3>
                <div className="text-xs text-secondary font-semibold flex items-center gap-1 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Terverifikasi
                </div>
              </div>
            </div>
            <div className="btn-secondary py-2 px-4 text-sm bg-white border border-outline-variant">
              Kunjungi Toko
            </div>
          </Link>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-on-surface mb-3">Deskripsi Produk</h3>
            <div className="text-on-surface-variant leading-relaxed whitespace-pre-line text-sm md:text-base">
              {product.description || 'Tidak ada deskripsi.'}
            </div>
          </div>

          {/* Action Area (Sticky on mobile) */}
          <div className="mt-auto lg:sticky lg:bottom-4 glass-card p-4 lg:p-6 rounded-[24px] shadow-lg flex flex-col sm:flex-row items-center gap-4 z-40 fixed bottom-0 left-0 w-full lg:static lg:w-auto pb-safe">
            <div className="flex items-center justify-between bg-surface-container rounded-xl p-1 w-full sm:w-auto h-12 sm:h-14">
              <button 
                onClick={handleDecreaseQty}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              <span className="w-10 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={handleIncreaseQty}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                disabled={product.stock <= quantity}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            
            <div className="flex gap-2 w-full">
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-3 sm:py-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors flex justify-center items-center gap-2 h-12 sm:h-14"
              >
                <svg className="w-5 h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                + Keranjang
              </button>
              <Link 
                href="/keranjang"
                onClick={handleAddToCart}
                className="flex-1 py-3 sm:py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all shadow-button flex justify-center items-center h-12 sm:h-14"
              >
                Beli Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for mobile sticky bottom bar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}
