'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Group items by store
  const storeGroups = items.reduce((groups, item) => {
    const storeId = item.storeId || 'unknown';
    if (!groups[storeId]) {
      groups[storeId] = {
        storeName: item.storeName || 'Toko',
        items: []
      };
    }
    groups[storeId].items.push(item);
    return groups;
  }, {});

  const handleCheckout = () => {
    if (!user) {
      router.push('/masuk?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="section-container section-spacing min-h-[70vh] flex flex-col items-center justify-center text-center bg-surface">
        <div className="w-48 h-48 bg-surface-container rounded-full flex items-center justify-center mb-8 text-on-surface-variant">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-on-surface mb-3">Keranjang Kosong</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">
          Sepertinya Anda belum memilih produk apapun. Jelajahi marketplace kami untuk menemukan produk UMKM terbaik.
        </p>
        <Link href="/marketplace" className="btn-primary px-8">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Keranjang Belanja</h1>
        <p className="text-on-surface-variant">Anda memiliki {getCartCount()} produk di keranjang</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 space-y-6">
          {Object.entries(storeGroups).map(([storeId, group]) => (
            <div key={storeId} className="glass-card rounded-2xl overflow-hidden animate-fade-in-up">
              {/* Store Header */}
              <div className="bg-surface-container/50 px-6 py-4 flex items-center justify-between border-b border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {group.storeName.charAt(0)}
                  </div>
                  <h3 className="font-bold text-on-surface">{group.storeName}</h3>
                </div>
                <Link href={`/toko/${storeId}`} className="text-sm font-semibold text-primary hover:text-secondary">
                  Kunjungi Toko
                </Link>
              </div>

              {/* Store Items */}
              <div className="divide-y divide-outline-variant/50">
                {group.items.map((item) => (
                  <div key={item.productId} className="p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    {/* Product Image */}
                    <Link href={`/produk/${item.productId}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/produk/${item.productId}`} className="text-lg font-semibold text-on-surface hover:text-primary transition-colors block mb-1 truncate">
                        {item.name}
                      </Link>
                      <div className="text-secondary font-bold mb-4">
                        {formatCurrency(item.price)}
                      </div>
                      
                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-9">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.qty - 1)}
                            className="w-9 h-full flex items-center justify-center bg-surface-container hover:bg-outline-variant/30 text-on-surface-variant transition-colors"
                            disabled={item.qty <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-on-surface">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.qty + 1)}
                            className="w-9 h-full flex items-center justify-center bg-surface-container hover:bg-outline-variant/30 text-on-surface-variant transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error/10"
                          title="Hapus item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <button 
              onClick={clearCart}
              className="text-sm font-semibold text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl sticky top-24 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-display font-bold text-on-surface mb-6">Ringkasan Belanja</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Harga ({getCartCount()} barang)</span>
                <span className="font-semibold">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimasi Ongkos Kirim</span>
                <span>Dihitung saat checkout</span>
              </div>
              
              <div className="h-px bg-outline-variant/50 w-full my-4"></div>
              
              <div className="flex justify-between text-lg font-bold">
                <span className="text-on-surface">Total Tagihan</span>
                <span className="text-secondary">{formatCurrency(getCartTotal())}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full btn-primary py-4 shadow-button flex justify-center items-center gap-2"
            >
              Lanjut ke Checkout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            
            {!user && (
              <p className="text-xs text-center text-on-surface-variant mt-4">
                Anda akan diminta masuk atau mendaftar untuk menyelesaikan pesanan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
