'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, deleteDocument } from '@/lib/firestore';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function DashboardProductsPage() {
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: '' });

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const results = await getDocuments('products', [
        { field: 'storeId', op: '==', value: user.uid }
      ]);
      setProducts(results || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Gagal memuat produk');
    }
    setLoading(false);
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id,
      productName: product.name
    });
  };

  const confirmDelete = async () => {
    const toastId = toast.loading('Menghapus produk...');
    try {
      const result = await deleteDocument('products', deleteModal.productId);
      if (result.success) {
        toast.success('Produk berhasil dihapus', { id: toastId });
        setProducts(products.filter(p => p.id !== deleteModal.productId));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal menghapus produk', { id: toastId });
    } finally {
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Produk Saya</h1>
          <p className="text-sm text-on-surface-variant">Kelola daftar produk toko Anda</p>
        </div>
        <Link href="/dashboard/produk/baru" className="btn-primary shadow-button flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Produk
        </Link>
      </div>

      {loading ? (
        <div className="glass-card p-6 rounded-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-surface-container rounded w-full mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-4 border-b border-outline-variant/50">
                <div className="w-16 h-16 bg-surface-container rounded-lg"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-surface-container rounded w-1/3"></div>
                  <div className="h-3 bg-surface-container rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Belum Ada Produk</h3>
          <p className="text-on-surface-variant mb-6 max-w-md">
            Anda belum menambahkan produk apapun. Mulai tambahkan produk pertama Anda untuk mulai berjualan.
          </p>
          <Link href="/dashboard/produk/baru" className="btn-primary">
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container/50 text-xs text-on-surface-variant uppercase border-b border-outline-variant/50">
                <tr>
                  <th className="px-6 py-4 font-bold w-16">Foto</th>
                  <th className="px-6 py-4 font-bold">Info Produk</th>
                  <th className="px-6 py-4 font-bold">Harga</th>
                  <th className="px-6 py-4 font-bold">Stok</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/50">
                        <img 
                          src={product.images?.[0] || '/images/placeholder-product.png'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/produk/${product.slug || product.id}`} className="font-bold text-on-surface hover:text-primary transition-colors line-clamp-1 mb-1">
                        {product.name}
                      </Link>
                      <p className="text-xs text-on-surface-variant">{product.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-on-surface">
                        {formatCurrency(product.discountPrice || product.price)}
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-on-surface-variant line-through mt-0.5">
                          {formatCurrency(product.price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? 'text-error' : 'text-on-surface'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                        product.isActive 
                          ? 'bg-success/10 text-success' 
                          : 'bg-outline-variant/20 text-on-surface-variant'
                      }`}>
                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dashboard/produk/${product.id}/edit`}
                          className="p-2 text-on-surface-variant hover:text-primary bg-surface-container rounded-lg hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-on-surface-variant hover:text-error bg-surface-container rounded-lg hover:bg-error/10 transition-colors"
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface w-full max-w-sm rounded-[24px] p-6 shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Hapus Produk?</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Apakah Anda yakin ingin menghapus produk <span className="font-semibold text-on-surface">"{deleteModal.productName}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                className="px-5 py-2.5 rounded-xl font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-semibold bg-error text-white hover:bg-error-dark transition-colors shadow-button"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
