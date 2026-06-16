'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firestore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { ORDER_STATUS } from '@/utils/constants';

export default function DashboardHomePage() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    newOrders: 0,
    rating: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        // Fetch products
        const products = await getDocuments('products', [
          { field: 'storeId', op: '==', value: user.uid }
        ]);
        
        // Fetch orders
        const orders = await getDocuments('orders', [
          // Simplified for MVP. In reality, we'd need a more complex query 
          // or flattened data to find orders containing products from this store.
        ], 'createdAt', 5);
        
        // Fetch store for rating
        const stores = await getDocuments('stores', [
          { field: '__name__', op: '==', value: user.uid }
        ]);
        
        const store = stores[0] || {};
        
        setStats({
          totalSales: 15250000, // Hardcoded for demo MVP
          activeProducts: products.filter(p => p.isActive).length,
          newOrders: 3, // Hardcoded for demo MVP
          rating: store.rating?.average || 0
        });
        
        // Demo recent orders if empty
        if (orders.length === 0) {
          setRecentOrders([
            { id: 'ORD-123', customerName: 'Budi Santoso', totalAmount: 150000, status: 'paid', createdAt: new Date() },
            { id: 'ORD-124', customerName: 'Siti Aminah', totalAmount: 450000, status: 'pending', createdAt: new Date(Date.now() - 86400000) },
            { id: 'ORD-125', customerName: 'Rudi Hermawan', totalAmount: 85000, status: 'processing', createdAt: new Date(Date.now() - 172800000) },
          ]);
        } else {
          setRecentOrders(orders);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      
      setLoading(false);
    }
    
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-surface-container rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-surface-container rounded-2xl"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Penjualan', 
      value: formatCurrency(stats.totalSales), 
      icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      bg: 'bg-primary/5'
    },
    { 
      title: 'Pesanan Baru', 
      value: stats.newOrders, 
      icon: <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
      bg: 'bg-secondary/5'
    },
    { 
      title: 'Produk Aktif', 
      value: stats.activeProducts, 
      icon: <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      bg: 'bg-info/5'
    },
    { 
      title: 'Rating Rata-rata', 
      value: stats.rating.toFixed(1), 
      icon: <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
      bg: 'bg-warning/5'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Dashboard Penjual</h1>
          <p className="text-sm text-on-surface-variant">Ringkasan aktivitas toko Anda hari ini</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/produk/baru" className="btn-primary text-sm shadow-button">
            Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => (
          <div key={index} className={`glass-card p-6 rounded-2xl border-none ${card.bg}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                {card.icon}
              </div>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant mb-1">{card.title}</p>
            <h3 className="text-2xl font-display font-bold text-on-surface">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
            <h3 className="font-bold text-on-surface">Pesanan Terbaru</h3>
            <Link href="/dashboard/pesanan" className="text-sm font-semibold text-primary hover:text-secondary">
              Lihat Semua
            </Link>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-container/50 text-xs text-on-surface-variant uppercase">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Pembeli</th>
                  <th className="px-6 py-4 font-bold">Tanggal</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {recentOrders.map((order) => {
                  const statusConfig = ORDER_STATUS[order.status.toUpperCase()] || ORDER_STATUS.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-on-surface">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-on-surface">{order.customerName}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{formatDateTime(order.createdAt)}</td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <h3 className="font-bold text-on-surface mb-6">Pusat Bantuan UMKM</h3>
          
          <div className="space-y-4 flex-1">
            <a href="#" className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-container group-hover:bg-white flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Tingkatkan Penjualan</h4>
                <p className="text-xs text-on-surface-variant">Tips optimasi foto dan deskripsi produk.</p>
              </div>
            </a>
            
            <a href="#" className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-container group-hover:bg-white flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-1">Panduan Pengemasan</h4>
                <p className="text-xs text-on-surface-variant">Cara mengemas produk agar aman saat pengiriman.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
