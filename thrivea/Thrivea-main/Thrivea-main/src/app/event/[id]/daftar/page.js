'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createDocument } from '@/lib/firestore';
import { formatCurrency } from '@/utils/formatters';
import { validateRequired, validatePhone, validateForm } from '@/utils/validators';
import toast from 'react-hot-toast';
import { DEMO_EVENTS } from '../../page';

export default function EventRegistrationPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    proposal: '',
    boothRequirements: ''
  });

  // Protect route & check seller role
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Silakan masuk untuk mendaftar event');
        router.push(`/masuk?redirect=/event/${params.id}/daftar`);
      } else if (userProfile && userProfile.role !== 'seller') {
        toast.error('Hanya Mitra Penjual yang dapat mendaftar tenant');
        router.push(`/event/${params.id}`);
      }
    }
  }, [user, userProfile, authLoading, router, params.id]);

  useEffect(() => {
    // In a real app, fetch from Firestore
    const foundEvent = DEMO_EVENTS.find(e => e.id === params.id);
    
    if (foundEvent) {
      if (foundEvent.status !== 'open') {
        toast.error('Pendaftaran untuk event ini sudah ditutup');
        router.push(`/event/${params.id}`);
      } else {
        setEvent(foundEvent);
      }
    } else {
      router.push('/event');
    }
    
    // Pre-fill user data
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        contactName: userProfile.displayName || '',
        phone: userProfile.phone || ''
      }));
    }
    
    setLoading(false);
  }, [params.id, userProfile, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const config = {
      contactName: { value: formData.contactName, validators: [validateRequired] },
      phone: { value: formData.phone, validators: [validatePhone] },
      proposal: { value: formData.proposal, validators: [validateRequired] },
    };
    
    const { isValid, errors: validationErrors } = validateForm(config);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Mohon lengkapi formulir dengan benar');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim proposal pendaftaran...');
    
    try {
      // Create registration document
      const regData = {
        eventId: event.id,
        eventName: event.name,
        storeId: user.uid,
        storeName: userProfile?.storeName || 'Toko UMKM',
        contactName: formData.contactName,
        phone: formData.phone,
        proposal: formData.proposal,
        boothRequirements: formData.boothRequirements,
        status: 'pending', // pending, approved, rejected
        appliedAt: new Date().toISOString()
      };
      
      const result = await createDocument('event_registrations', regData);
      
      if (result.success) {
        toast.success('Pendaftaran berhasil dikirim!', { id: toastId });
        setIsSuccess(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal mengirim pendaftaran', { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading || !user || (userProfile && userProfile.role !== 'seller')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="section-container section-spacing min-h-[80vh] flex flex-col items-center justify-center bg-surface animate-fade-in">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-on-surface mb-4 text-center">Proposal Berhasil Dikirim!</h2>
        <p className="text-on-surface-variant text-center max-w-md mb-8">
          Terima kasih. Proposal pengajuan tenant Anda untuk event <span className="font-bold text-on-surface">{event?.name}</span> telah diterima oleh penyelenggara. Kami akan menghubungi Anda melalui nomor telepon yang diberikan jika proposal disetujui.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/event" className="btn-primary">
            Cek Status Pendaftaran
          </Link>
          <Link href="/event" className="px-6 py-3 font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors text-center">
            Kembali ke Kalender Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-8">
        <Link href={`/event/${event?.id}`} className="inline-flex items-center text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Detail Event
        </Link>
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Pendaftaran Tenant</h1>
        <p className="text-on-surface-variant">Isi proposal pendaftaran untuk mengikuti event ini</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-[24px] animate-fade-in-up">
            <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-4 items-start">
              <svg className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold text-primary mb-1">Informasi Pendaftaran</h3>
                <p className="text-sm text-on-surface-variant">Anda hanya perlu mengirimkan proposal singkat dan nomor telepon. Pembayaran biaya sewa tenant ({formatCurrency(event?.price)}) <strong>hanya dilakukan setelah proposal Anda disetujui</strong> oleh pihak penyelenggara.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant/50 pb-4">Data Penanggung Jawab</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Nama Kontak <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`input-field ${errors.contactName ? 'border-error' : ''}`}
                  placeholder="Nama PIC"
                />
                {errors.contactName && <p className="mt-1 text-xs text-error">{errors.contactName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Nomor WhatsApp <span className="text-error">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-error' : ''}`}
                  placeholder="08123456789"
                />
                {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Proposal Singkat <span className="text-error">*</span></label>
                <textarea
                  name="proposal"
                  value={formData.proposal}
                  onChange={handleChange}
                  rows={4}
                  className={`input-field resize-y ${errors.proposal ? 'border-error' : ''}`}
                  placeholder="Jelaskan produk unggulan yang akan Anda jual, rentang harga, dan mengapa produk Anda cocok untuk event ini..."
                ></textarea>
                {errors.proposal && <p className="mt-1 text-xs text-error">{errors.proposal}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Kebutuhan Booth / Stand (Opsional)</label>
                <textarea
                  name="boothRequirements"
                  value={formData.boothRequirements}
                  onChange={handleChange}
                  rows={2}
                  className="input-field resize-y"
                  placeholder="Contoh: Butuh colokan listrik tambahan 1000W untuk oven, dsb."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-outline-variant/50">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary px-8 flex justify-center items-center shadow-button w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Kirim Proposal'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Event Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl sticky top-24 shadow-lg border border-outline-variant/50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold text-on-surface mb-4">Event yang Dipilih</h3>
            
            <div className="flex gap-4 mb-6">
              <img src={event?.image} alt={event?.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-on-surface line-clamp-2 text-sm mb-1">{event?.name}</h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {event?.date}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm border-t border-outline-variant/50 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status Toko Anda</span>
                <span className="font-semibold text-primary">{userProfile?.storeName || 'Toko UMKM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Harga Sewa</span>
                <span className="font-bold text-on-surface">{formatCurrency(event?.price)}</span>
              </div>
            </div>
            
            <div className="bg-surface-container rounded-xl p-4 text-xs text-on-surface-variant leading-relaxed">
              Dengan mengirim proposal, Anda menyetujui syarat & ketentuan event. Penyelenggara berhak menolak tenant jika tidak sesuai dengan tema event.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
