'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createDocument } from '@/lib/firestore';
import { validateRequired, validatePhone, validateForm } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatters';
import { BANKS, PROVINCES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  const { items, getCartTotal, getCartCount, clearCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [shippingInfo, setShippingInfo] = useState({
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  
  const [selectedBank, setSelectedBank] = useState('');

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Silakan masuk terlebih dahulu');
      router.push('/masuk?redirect=/checkout');
    }
    
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/keranjang');
    }
  }, [user, authLoading, items, router]);

  // Pre-fill user data
  useEffect(() => {
    if (userProfile && shippingInfo.recipientName === '') {
      setShippingInfo(prev => ({
        ...prev,
        recipientName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        province: userProfile.province || '',
        postalCode: userProfile.postalCode || '',
      }));
    }
  }, [userProfile]);

  if (authLoading || !user || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateStep1 = () => {
    const config = {
      recipientName: { value: shippingInfo.recipientName, validators: [validateRequired] },
      phone: { value: shippingInfo.phone, validators: [validatePhone] },
      address: { value: shippingInfo.address, validators: [validateRequired] },
      city: { value: shippingInfo.city, validators: [validateRequired] },
      province: { value: shippingInfo.province, validators: [validateRequired] },
      postalCode: { value: shippingInfo.postalCode, validators: [validateRequired] },
    };
    
    const { isValid, errors: validationErrors } = validateForm(config);
    setErrors(validationErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error('Mohon lengkapi semua data pengiriman dengan benar');
      }
    } else if (step === 2) {
      if (!selectedBank) {
        toast.error('Pilih metode pembayaran terlebih dahulu');
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Memproses pesanan Anda...');
    
    try {
      // Group items by store for the order document
      // In a real app, you might want to create separate order documents per store
      // But for this MVP, we'll create one master order with nested store items
      
      const totalAmount = getCartTotal();
      
      const orderData = {
        customerId: user.uid,
        customerName: userProfile?.displayName || user.email,
        customerEmail: user.email,
        shippingInfo,
        items,
        totalAmount,
        paymentMethod: 'bank_transfer',
        paymentBank: selectedBank,
        status: 'pending', // pending, paid, processing, shipped, completed, cancelled
      };
      
      const result = await createDocument('orders', orderData);
      
      if (result.success) {
        clearCart();
        toast.success('Pesanan berhasil dibuat!', { id: toastId });
        router.push(`/pesanan/${result.id}/bayar`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal membuat pesanan', { id: toastId });
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const shippingCost = 15000; // Flat rate for MVP
  const total = subtotal + shippingCost;

  return (
    <div className="section-container section-spacing bg-surface min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-6">Checkout</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[
            { num: 1, label: 'Pengiriman' },
            { num: 2, label: 'Pembayaran' },
            { num: 3, label: 'Konfirmasi' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-surface px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.num ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant'
              }`}>
                {step > s.num ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : s.num}
              </div>
              <span className={`text-xs font-semibold ${step >= s.num ? 'text-primary' : 'text-on-surface-variant'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3">
          {/* STEP 1: Shipping Info */}
          {step === 1 && (
            <div className="glass-card p-6 md:p-8 rounded-[24px] animate-fade-in-up">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Alamat Pengiriman
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Nama Penerima</label>
                  <input
                    name="recipientName"
                    type="text"
                    value={shippingInfo.recipientName}
                    onChange={handleShippingChange}
                    className={`input-field ${errors.recipientName ? 'border-error' : ''}`}
                    placeholder="Nama lengkap penerima"
                  />
                  {errors.recipientName && <p className="mt-1 text-xs text-error">{errors.recipientName}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Nomor Telepon / WhatsApp</label>
                  <input
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className={`input-field ${errors.phone ? 'border-error' : ''}`}
                    placeholder="08123456789"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Alamat Lengkap</label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className={`input-field min-h-[100px] resize-y ${errors.address ? 'border-error' : ''}`}
                    placeholder="Nama jalan, gedung, no. rumah, RT/RW, kelurahan, kecamatan"
                  ></textarea>
                  {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Provinsi</label>
                  <select
                    name="province"
                    value={shippingInfo.province}
                    onChange={handleShippingChange}
                    className={`input-field appearance-none bg-white ${errors.province ? 'border-error' : ''}`}
                  >
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                  {errors.province && <p className="mt-1 text-xs text-error">{errors.province}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Kota / Kabupaten</label>
                  <input
                    name="city"
                    type="text"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className={`input-field ${errors.city ? 'border-error' : ''}`}
                    placeholder="Contoh: Kota Bandung"
                  />
                  {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Kode Pos</label>
                  <input
                    name="postalCode"
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingChange}
                    className={`input-field ${errors.postalCode ? 'border-error' : ''}`}
                    placeholder="Contoh: 40123"
                  />
                  {errors.postalCode && <p className="mt-1 text-xs text-error">{errors.postalCode}</p>}
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button onClick={handleNextStep} className="btn-primary px-8">
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="glass-card p-6 md:p-8 rounded-[24px] animate-fade-in-up">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Metode Pembayaran
              </h2>
              
              <div className="bg-info/10 text-info p-4 rounded-xl mb-6 flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="text-sm">
                  <p className="font-bold mb-1">Transfer Bank Manual (MVP)</p>
                  <p>Untuk saat ini, pembayaran dilakukan dengan cara transfer manual. Anda perlu mengunggah bukti transfer setelah membuat pesanan.</p>
                </div>
              </div>

              <div className="space-y-4">
                {BANKS.map((bank) => (
                  <label 
                    key={bank.id} 
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedBank === bank.id 
                        ? 'border-secondary bg-secondary/5' 
                        : 'border-outline-variant hover:border-secondary/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-white border border-outline-variant rounded flex items-center justify-center font-bold text-primary">
                        {bank.logo}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{bank.name}</p>
                        <p className="text-sm text-on-surface-variant">Transfer Manual</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      selectedBank === bank.id ? 'border-secondary bg-secondary' : 'border-outline-variant'
                    }`}>
                      {selectedBank === bank.id && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {/* Hidden radio input for accessibility */}
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={bank.id}
                      checked={selectedBank === bank.id}
                      onChange={() => setSelectedBank(bank.id)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
              
              <div className="flex justify-between mt-8 pt-6 border-t border-outline-variant">
                <button onClick={handlePrevStep} className="px-6 py-3 font-semibold text-on-surface-variant hover:text-primary transition-colors">
                  Kembali
                </button>
                <button onClick={handleNextStep} className="btn-primary px-8">
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="glass-card p-6 md:p-8 rounded-[24px] animate-fade-in-up">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Konfirmasi Pesanan
              </h2>

              <div className="space-y-6">
                {/* Shipping Review */}
                <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-on-surface">Alamat Pengiriman</h3>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-primary hover:text-secondary">Ubah</button>
                  </div>
                  <p className="font-semibold text-on-surface mb-1">{shippingInfo.recipientName} <span className="text-on-surface-variant font-normal">({shippingInfo.phone})</span></p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}
                  </p>
                </div>

                {/* Payment Review */}
                <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-on-surface">Metode Pembayaran</h3>
                    <button onClick={() => setStep(2)} className="text-xs font-bold text-primary hover:text-secondary">Ubah</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-white border border-outline-variant rounded flex items-center justify-center font-bold text-sm text-primary">
                      {BANKS.find(b => b.id === selectedBank)?.logo}
                    </div>
                    <p className="font-semibold text-on-surface">Transfer {BANKS.find(b => b.id === selectedBank)?.name}</p>
                  </div>
                </div>

                {/* Items Review (Simplified) */}
                <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/50">
                  <h3 className="font-bold text-on-surface mb-4">Produk yang Dibeli ({getCartCount()} barang)</h3>
                  <div className="space-y-4">
                    {items.slice(0, 3).map(item => (
                      <div key={item.productId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <p className="truncate text-on-surface">{item.name}</p>
                        </div>
                        <div className="text-on-surface-variant mx-4 whitespace-nowrap">x{item.qty}</div>
                        <div className="font-semibold text-on-surface whitespace-nowrap">{formatCurrency(item.price * item.qty)}</div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="text-center text-sm text-on-surface-variant font-medium pt-2">
                        Dan {items.length - 3} produk lainnya...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8 pt-6 border-t border-outline-variant">
                <button 
                  onClick={handlePrevStep} 
                  disabled={isSubmitting}
                  className="px-6 py-3 font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleSubmitOrder} 
                  disabled={isSubmitting}
                  className="btn-primary px-8 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Buat Pesanan'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-6 rounded-2xl sticky top-24 shadow-lg border border-outline-variant/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-on-surface mb-6">Ringkasan Belanja</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Harga Produk</span>
                <span className="font-semibold text-on-surface">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Ongkos Kirim</span>
                <span className="font-semibold text-on-surface">{formatCurrency(shippingCost)}</span>
              </div>
              
              <div className="h-px bg-outline-variant/50 w-full my-4"></div>
              
              <div className="flex justify-between text-lg font-bold">
                <span className="text-on-surface">Total Tagihan</span>
                <span className="text-secondary">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 text-xs text-primary font-medium flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              <p>Transaksi Anda dienkripsi dan aman. Pembayaran akan diteruskan ke penjual setelah barang diterima.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
