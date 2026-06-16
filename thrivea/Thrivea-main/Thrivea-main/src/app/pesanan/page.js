'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firestore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { ORDER_STATUS } from '@/utils/constants';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  
  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/masuk');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoading(true);
      try {
        const results = await getDocuments(
          'orders', 
          [{ field: 'customerId', op: '==', value: user.uid }], 
          'createdAt'
        );
        setOrders(results);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    }
    
    fetchOrders();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'Semua', label: 'Semua' },
    { id: 'pending', label: 'Belum Bayar' },
    { id: 'processing', label: 'Diproses' },
    { id: 'shipped', label: 'Dikirim' },
    { id: 'completed', label: 'Selesai' },
  ];

  const filteredOrders = activeTab === 'Semua' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Pesanan Saya</h1>
        <p className="text-on-surface-variant">Lacak dan kelola riwayat pesanan Anda</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between mb-4"><div className="h-4 skeleton w-1/4"></div><div className="h-6 skeleton w-24 rounded-full"></div></div>
              <div className="flex gap-4 mb-4"><div className="w-20 h-20 skeleton rounded-xl"></div><div className="flex-1"><div className="h-5 skeleton w-3/4 mb-2"></div><div className="h-4 skeleton w-1/4"></div></div></div>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/50"><div className="h-4 skeleton w-1/3"></div><div className="h-10 skeleton w-32 rounded-xl"></div></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Tidak Ada Pesanan</h3>
          <p className="text-on-surface-variant mb-6">
            {activeTab === 'Semua' 
              ? 'Anda belum pernah membuat pesanan.' 
              : `Anda tidak memiliki pesanan dengan status "${tabs.find(t => t.id === activeTab)?.label}".`}
          </p>
          <Link href="/marketplace" className="btn-primary">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const statusConfig = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
            const isPending = order.status === 'pending';
            
            return (
              <div key={order.id} className="glass-card rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}>
                {/* Order Header */}
                <div className="bg-surface-container/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/50">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-on-surface">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-on-surface-variant">{formatDateTime(order.createdAt)}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${statusConfig.color}`}>
                    {statusConfig.label}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-6 divide-y divide-outline-variant/30">
                  {order.items.map((item, i) => (
                    <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-outline-variant/30" />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h4 className="font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors cursor-pointer mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mb-2">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                              {item.storeName}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold text-on-surface">{formatCurrency(item.price)}</p>
                            <p className="text-xs text-on-surface-variant">x{item.qty}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="bg-surface-container/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/50">
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">Total Belanja</p>
                    <p className="text-lg font-bold text-secondary">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Action buttons based on status */}
                    {isPending ? (
                      <Link 
                        href={`/pesanan/${order.id}/bayar`}
                        className="btn-primary w-full sm:w-auto flex justify-center items-center gap-2"
                      >
                        Upload Bukti Bayar
                      </Link>
                    ) : order.status === 'shipped' ? (
                      <button className="btn-secondary w-full sm:w-auto">
                        Pesanan Diterima
                      </button>
                    ) : order.status === 'completed' ? (
                      <button className="px-6 py-2.5 bg-white border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container transition-colors w-full sm:w-auto">
                        Beri Ulasan
                      </button>
                    ) : (
                      <button className="px-6 py-2.5 bg-white border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container transition-colors w-full sm:w-auto">
                        Detail Pesanan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
