'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments } from '@/lib/firestore';
import { formatDateTime } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { DEMO_EVENTS } from '@/app/event/page';

export default function DashboardEventPage() {
  const { user, userProfile } = useAuth();
  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const fetchRegistrations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const constraints = [{ field: 'storeId', operator: '==', value: user.uid }];
      const data = await getDocuments('event_registrations', constraints, 'appliedAt');
      
      // Map event images from DEMO_EVENTS
      const enrichedData = data.map(reg => {
        const evt = DEMO_EVENTS.find(e => e.id === reg.eventId);
        return {
          ...reg,
          image: evt?.image || '',
          price: evt?.price || 0,
        };
      });
      
      setRegistrations(enrichedData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error('Gagal memuat data event');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/20">Disetujui</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded-full border border-error/20">Ditolak</span>;
      case 'pending':
      default:
        return <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">Menunggu Verifikasi</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Event Saya</h1>
          <p className="text-sm text-on-surface-variant">Kelola pengajuan tenant Anda untuk berbagai event</p>
        </div>
        <Link href="/event" className="btn-primary text-sm shadow-sm flex items-center justify-center w-full sm:w-auto">
          Cari Event Baru
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
              <div className="flex gap-4"><div className="w-20 h-20 bg-surface-container rounded-xl"></div><div className="flex-1 space-y-2"><div className="h-5 bg-surface-container rounded w-1/3"></div><div className="h-4 bg-surface-container rounded w-1/4"></div></div></div>
            </div>
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-outline-variant/50">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">Belum Ada Pengajuan</h3>
          <p className="text-on-surface-variant mb-6 max-w-md">
            Anda belum mendaftar sebagai tenant di event manapun. Temukan bazaar menarik untuk memperluas jangkauan pasar Anda.
          </p>
          <Link href="/event" className="btn-primary px-8">
            Lihat Kalender Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="glass-card rounded-2xl overflow-hidden shadow-sm border border-outline-variant/50 hover:shadow-md transition-shadow">
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 relative rounded-xl overflow-hidden bg-surface-container">
                  {reg.image ? (
                    <img src={reg.image} alt={reg.eventName} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-on-surface-variant/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <h3 className="text-lg font-bold text-on-surface line-clamp-1">{reg.eventName}</h3>
                    {getStatusBadge(reg.status)}
                  </div>
                  
                  <div className="text-sm text-on-surface-variant mb-4 space-y-1">
                    <p>Dikirim pada: {formatDateTime(reg.appliedAt)}</p>
                    <p>PIC: {reg.contactName} ({reg.phone})</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-auto">
                    <Link href={`/event/${reg.eventId}`} className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                      Lihat Detail Event
                    </Link>
                  </div>
                </div>
                
                {/* Actions based on status */}
                <div className="border-t sm:border-t-0 sm:border-l border-outline-variant/50 pt-4 sm:pt-0 sm:pl-6 flex flex-col justify-center min-w-[200px]">
                  {reg.status === 'pending' && (
                    <div className="bg-surface-container/50 rounded-xl p-4 text-center">
                      <p className="text-xs text-on-surface-variant mb-1">Status saat ini</p>
                      <p className="text-sm font-semibold text-on-surface">Proses Review</p>
                      <p className="text-[10px] text-on-surface-variant mt-2 leading-tight">Penyelenggara akan menghubungi Anda maksimal 3 hari kerja.</p>
                    </div>
                  )}
                  {reg.status === 'approved' && (
                    <div className="bg-success/5 rounded-xl p-4 text-center border border-success/20">
                      <p className="text-xs text-success mb-1">Selamat!</p>
                      <p className="text-sm font-semibold text-on-surface">Proposal Disetujui</p>
                      <p className="text-[10px] text-on-surface-variant mt-2 leading-tight">Mohon selesaikan pembayaran dan koordinasi via WhatsApp.</p>
                    </div>
                  )}
                  {reg.status === 'rejected' && (
                    <div className="bg-error/5 rounded-xl p-4 text-center border border-error/20">
                      <p className="text-sm font-semibold text-on-surface">Proposal Ditolak</p>
                      <p className="text-[10px] text-on-surface-variant mt-2 leading-tight">Maaf, slot telah penuh atau produk tidak sesuai tema.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
