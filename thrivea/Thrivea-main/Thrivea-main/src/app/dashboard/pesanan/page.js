'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, updateDocument } from '@/lib/firestore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { ORDER_STATUS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function DashboardOrdersPage() {
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // In a real MVP, we need to filter orders that contain items from this store
      // Since our current model puts the whole cart into one order, we fetch all orders
      // and then filter the items on the client side for this MVP.
      const allOrders = await getDocuments('orders', [], 'createdAt');
      
      const storeOrders = allOrders.map(order => {
        // Filter items that belong to this store
        const storeItems = order.items.filter(item => item.storeId === user.uid);
        if (storeItems.length > 0) {
          // Calculate total for this store's items
          const storeTotal = storeItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
          return {
            ...order,
            items: storeItems,
            totalAmount: storeTotal // Override total amount for this store only
          };
        }
        return null;
      }).filter(Boolean); // Remove nulls (orders with no items from this store)
      
      setOrders(storeOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Gagal memuat pesanan');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const toastId = toast.loading('Memperbarui status pesanan...');
    try {
      const result = await updateDocument('orders', orderId, { status: newStatus });
      if (result.success) {
        toast.success(`Pesanan ditandai sebagai ${ORDER_STATUS[newStatus.toUpperCase()].label}`, { id: toastId });
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrder(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal memperbarui status pesanan', { id: toastId });
    }
  };

  const tabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'pending', label: 'Belum Bayar' },
    { id: 'paid', label: 'Perlu Diproses' },
    { id: 'processing', label: 'Sedang Diproses' },
    { id: 'shipped', label: 'Sedang Dikirim' },
    { id: 'completed', label: 'Selesai' },
  ];

  const filteredOrders = activeTab === 'Semua' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Pesanan Masuk</h1>
          <p className="text-sm text-on-surface-variant">Kelola pesanan dari pembeli</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
        {tabs.map((tab) => {
          const count = tab.id === 'Semua' 
            ? orders.length 
            : orders.filter(o => o.status === tab.id).length;
            
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-outline-variant/30 text-on-surface'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
              <div className="flex justify-between mb-4"><div className="h-4 bg-surface-container rounded w-1/4"></div><div className="h-6 bg-surface-container rounded-full w-24"></div></div>
              <div className="flex gap-4 mb-4"><div className="w-16 h-16 bg-surface-container rounded-xl"></div><div className="flex-1 space-y-2"><div className="h-4 bg-surface-container rounded w-1/2"></div><div className="h-3 bg-surface-container rounded w-1/4"></div></div></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Tidak Ada Pesanan</h3>
          <p className="text-on-surface-variant mb-6">
            {activeTab === 'Semua' 
              ? 'Belum ada pesanan yang masuk ke toko Anda.' 
              : `Tidak ada pesanan dengan status "${tabs.find(t => t.id === activeTab)?.label}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
            
            return (
              <div key={order.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-surface-container/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-on-surface">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-outline-variant hidden sm:inline">•</span>
                    <span className="text-on-surface-variant">{formatDateTime(order.createdAt)}</span>
                    <span className="text-outline-variant hidden sm:inline">•</span>
                    <span className="text-on-surface font-semibold">{order.customerName}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${statusConfig.color}`}>
                    {statusConfig.label}
                  </div>
                </div>

                <div className="p-6 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <img src={order.items[0].image} alt={order.items[0].name} className="w-16 h-16 rounded-xl object-cover border border-outline-variant/30" />
                      {order.items.length > 1 && (
                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-surface border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-on-surface">
                          +{order.items.length - 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface line-clamp-1 mb-1">{order.items[0].name}</h4>
                      <p className="text-sm text-on-surface-variant">{order.items.length} barang x {formatCurrency(order.items[0].price)}</p>
                    </div>
                    <div className="text-right pl-4">
                      <p className="text-xs text-on-surface-variant mb-1">Total Pesanan</p>
                      <p className="font-bold text-secondary text-lg">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="bg-surface-container/30 px-6 py-3 flex justify-end gap-3 border-t border-outline-variant/50">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Detail
                  </button>
                  {order.status === 'paid' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'processing')}
                      className="btn-primary py-2 px-6 text-sm shadow-sm"
                    >
                      Proses Pesanan
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'shipped')}
                      className="btn-primary py-2 px-6 text-sm shadow-sm"
                    >
                      Kirim Pesanan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in sm:p-6 overflow-y-auto">
          <div className="bg-surface w-full max-w-2xl rounded-[24px] shadow-2xl flex flex-col max-h-full animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/50">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Detail Pesanan</h3>
                <p className="text-sm text-on-surface-variant">#{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Status Header */}
              <div className="bg-surface-container rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-on-surface-variant mb-1">Status Pesanan</p>
                  <p className="font-bold text-on-surface">{ORDER_STATUS[selectedOrder.status.toUpperCase()]?.label}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant mb-1">Tanggal Pesan</p>
                  <p className="font-bold text-on-surface">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div>
                <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Info Pengiriman
                </h4>
                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/50">
                  <p className="font-semibold text-on-surface mb-1">{selectedOrder.shippingInfo?.recipientName} <span className="text-on-surface-variant font-normal">({selectedOrder.shippingInfo?.phone})</span></p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {selectedOrder.shippingInfo?.address}, {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.province} {selectedOrder.shippingInfo?.postalCode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Produk Dipesan
                </h4>
                <div className="border border-outline-variant/50 rounded-xl divide-y divide-outline-variant/50">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-surface-container" />
                      <div className="flex-1">
                        <p className="font-semibold text-on-surface line-clamp-1">{item.name}</p>
                        <p className="text-sm text-on-surface-variant">x{item.qty}</p>
                      </div>
                      <div className="font-bold text-on-surface">
                        {formatCurrency(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-surface-container/50 flex justify-between items-center rounded-b-xl">
                    <p className="font-semibold text-on-surface">Total Pesanan Toko Anda</p>
                    <p className="font-bold text-secondary text-lg">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedOrder.paymentProofUrl && (
                <div>
                  <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Bukti Pembayaran
                  </h4>
                  <a href={selectedOrder.paymentProofUrl} target="_blank" rel="noreferrer" className="block max-w-[200px] border border-outline-variant rounded-xl overflow-hidden hover:border-primary transition-colors cursor-pointer relative group">
                    <img src={selectedOrder.paymentProofUrl} alt="Bukti Transfer" className="w-full aspect-[3/4] object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Lihat Penuh</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-outline-variant/50 bg-surface-container/30 rounded-b-[24px] flex flex-wrap justify-end gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Tutup
              </button>
              
              {/* Action Buttons based on status */}
              {selectedOrder.status === 'paid' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  className="btn-primary py-2.5 px-6"
                >
                  Proses Pesanan
                </button>
              )}
              {selectedOrder.status === 'processing' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                  className="btn-primary py-2.5 px-6"
                >
                  Kirim Pesanan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
