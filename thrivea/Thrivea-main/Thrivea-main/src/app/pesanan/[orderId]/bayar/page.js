'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocument, updateDocument } from '@/lib/firestore';
import { uploadPaymentProof } from '@/lib/storage';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { BANKS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function UploadPaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId;
  const fileInputRef = useRef(null);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/masuk');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!user || !orderId) return;
      
      try {
        const orderData = await getDocument('orders', orderId);
        
        if (orderData) {
          // Verify ownership
          if (orderData.customerId !== user.uid) {
            toast.error('Anda tidak memiliki akses ke pesanan ini');
            router.push('/pesanan');
            return;
          }
          
          setOrder(orderData);
          
          if (orderData.status !== 'pending') {
            setIsSuccess(true);
          }
        } else {
          toast.error('Pesanan tidak ditemukan');
          router.push('/pesanan');
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error('Gagal mengambil data pesanan');
      }
      setLoading(false);
    }
    
    fetchOrder();
  }, [user, orderId, router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Gunakan format gambar JPG, PNG, atau WEBP');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    
    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Pilih file bukti pembayaran terlebih dahulu');
      return;
    }
    
    setIsUploading(true);
    const toastId = toast.loading('Mengunggah bukti pembayaran...');
    
    try {
      // 1. Upload to Storage
      const uploadResult = await uploadPaymentProof(file, orderId);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      // 2. Update Firestore Order
      const updateResult = await updateDocument('orders', orderId, {
        status: 'paid',
        paymentProofUrl: uploadResult.url,
        paidAt: new Date().toISOString()
      });
      
      if (!updateResult.success) {
        throw new Error(updateResult.error);
      }
      
      toast.success('Bukti pembayaran berhasil diunggah!', { id: toastId });
      setIsSuccess(true);
    } catch (error) {
      toast.error(error.message || 'Gagal mengunggah bukti pembayaran', { id: toastId });
      setIsUploading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  const bank = BANKS.find(b => b.id === order.paymentBank) || BANKS[0];

  if (isSuccess) {
    return (
      <div className="section-container section-spacing min-h-[80vh] flex flex-col items-center justify-center bg-surface animate-fade-in">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-on-surface mb-4">Pembayaran Berhasil Dikirim</h2>
        <p className="text-on-surface-variant text-center max-w-md mb-8">
          Terima kasih. Kami telah menerima bukti pembayaran Anda. Pesanan akan segera diproses oleh penjual setelah verifikasi selesai.
        </p>
        <div className="flex gap-4">
          <Link href="/pesanan" className="btn-primary">
            Kembali ke Daftar Pesanan
          </Link>
          <Link href="/marketplace" className="px-6 py-3 font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">
            Belanja Lagi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-8">
        <Link href="/pesanan" className="inline-flex items-center text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Pesanan Saya
        </Link>
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Selesaikan Pembayaran</h1>
        <p className="text-on-surface-variant">Order ID: #{order.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Payment Instructions */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[24px] animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Transfer ke Rekening</h2>
              <div className="w-16 h-10 bg-white border border-outline-variant rounded flex items-center justify-center font-bold text-sm text-primary">
                {bank.logo}
              </div>
            </div>
            
            <div className="bg-surface-container rounded-xl p-5 mb-6">
              <p className="text-sm text-on-surface-variant mb-1">Nomor Rekening</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-on-surface tracking-wider font-mono">{bank.accountNumber}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(bank.accountNumber);
                    toast.success('Nomor rekening disalin!');
                  }}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <p className="text-sm font-semibold text-on-surface mt-2">a/n {bank.accountName}</p>
            </div>
            
            <div>
              <p className="text-sm text-on-surface-variant mb-1">Total yang harus dibayar</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-display font-bold text-secondary">{formatCurrency(order.totalAmount)}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(order.totalAmount.toString());
                    toast.success('Nominal disalin!');
                  }}
                  className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
              <div className="bg-warning/10 text-warning-dark p-3 rounded-lg mt-4 text-xs font-medium flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p>Pastikan jumlah transfer <strong>tepat sama</strong> hingga 3 digit terakhir untuk mempercepat proses verifikasi.</p>
              </div>
            </div>
          </div>
          
          {/* Order Summary Summary */}
          <div className="glass-card p-6 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold text-on-surface mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tanggal</span>
                <span className="font-medium">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Jumlah Produk</span>
                <span className="font-medium">{order.items.reduce((acc, item) => acc + item.qty, 0)} barang</span>
              </div>
              <div className="pt-3 border-t border-outline-variant/50">
                <p className="text-on-surface-variant mb-1">Dikirim ke:</p>
                <p className="font-medium line-clamp-2">{order.shippingInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Upload Area */}
        <div className="w-full lg:w-1/2">
          <div className="glass-card p-6 md:p-8 rounded-[24px] sticky top-24 shadow-lg border border-outline-variant/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-bold text-on-surface mb-6">Upload Bukti Transfer</h2>
            
            <div className="mb-8">
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-primary aspect-[3/4] sm:aspect-[4/3] bg-surface-container group">
                  <img src={preview} alt="Bukti Pembayaran" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-secondary bg-white border-none shadow-lg text-primary"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container/30 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <h3 className="font-bold text-on-surface mb-1">Tap untuk memilih foto</h3>
                  <p className="text-sm text-on-surface-variant max-w-xs">
                    Upload foto struk / screenshot m-banking bukti transfer (Maks. 5MB, format JPG/PNG)
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full btn-primary py-4 text-lg shadow-button flex justify-center items-center"
            >
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Kirim Bukti Pembayaran'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
