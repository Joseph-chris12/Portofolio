'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import { createDocumentWithId } from '@/lib/firestore';
import { validateEmail, validateRequired, validatePassword, validatePhone, validateForm } from '@/utils/validators';
import { CATEGORIES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('customer'); // 'customer' or 'seller'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Seller specific fields
    storeName: '',
    phone: '',
    category: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (!authLoading && user) {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleNextStep = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate form based on role
    const formConfig = {
      name: { value: formData.name, validators: [validateRequired] },
      email: { value: formData.email, validators: [validateEmail] },
      password: { value: formData.password, validators: [validatePassword] },
    };
    
    if (role === 'seller') {
      formConfig.storeName = { value: formData.storeName, validators: [validateRequired] };
      formConfig.phone = { value: formData.phone, validators: [validatePhone] };
      formConfig.category = { value: formData.category, validators: [validateRequired] };
    }
    
    let { isValid, errors: validationErrors } = validateForm(formConfig);
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Password tidak cocok';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Membuat akun Anda...');
    
    try {
      // 1. Create Auth User
      const authResult = await signUpWithEmail(formData.email, formData.password, formData.name);
      
      if (!authResult.success) {
        throw new Error(authResult.error);
      }
      
      const newUser = authResult.user;
      
      // 2. Create User Document
      await createDocumentWithId('users', newUser.uid, {
        email: formData.email,
        displayName: formData.name,
        role: role,
        phone: role === 'seller' ? formData.phone : null,
      });
      
      // 3. If Seller, create Store Document
      if (role === 'seller') {
        // Simple slug generation
        const slug = formData.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        await createDocumentWithId('stores', newUser.uid, {
          ownerId: newUser.uid,
          name: formData.storeName,
          slug: slug,
          category: formData.category,
          isVerified: false,
          rating: { average: 0, count: 0 },
        });
        
        toast.success('Pendaftaran penjual berhasil! Mengalihkan ke dashboard...', { id: toastId });
        router.push('/dashboard');
        return;
      }
      
      toast.success('Pendaftaran berhasil! Selamat datang di Thrivea.', { id: toastId });
      router.push('/');
      
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat mendaftar.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Membuka Google...');
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      // For Google sign-in during registration, if they selected "seller" role
      // we need to check if they already have a user document, and if not, create one
      // Since this is MVP, we'll let AuthContext handle the basic document creation
      // but they'll be registered as a customer by default.
      toast.success('Berhasil masuk dengan Google!', { id: toastId });
      router.push('/');
    } else {
      toast.error(result.error, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual/Brand (Hidden on mobile) */}
      <div className="hidden lg:flex w-5/12 gradient-hero p-12 flex-col justify-between text-white relative overflow-hidden fixed h-screen">
        <div className="absolute inset-0 nusantara-pattern opacity-20"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-primary font-display font-extrabold text-xl">T</span>
            </div>
            <span className="text-2xl font-display font-extrabold text-white">Thrivea</span>
          </Link>
          
          <h1 className="text-5xl font-display font-bold leading-tight mb-6">
            Mulai Perjalanan Bisnis <span className="text-secondary-container">Nusantara</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            {role === 'customer' 
              ? 'Temukan ribuan produk lokal berkualitas tinggi dari penjual UMKM terverifikasi di seluruh Indonesia.'
              : 'Bergabung dengan ribuan UMKM sukses lainnya. Dapatkan akses ke pasar nasional, sistem ulasan transparan, dan peluang pameran.'}
          </p>
        </div>
      </div>

      {/* Right side - Spacer for desktop fixed left column */}
      <div className="hidden lg:block w-5/12"></div>

      {/* Right side - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-surface min-h-screen">
        <div className="w-full max-w-xl animate-fade-in-up">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">T</span>
            </div>
            <span className="text-xl font-display font-extrabold text-primary">Thrivea</span>
          </Link>

          {/* Stepper indicator */}
          <div className="flex items-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>1</div>
            <div className={`h-1 w-12 mx-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface-container'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>2</div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-on-surface mb-2">
              {step === 1 ? 'Pilih Jenis Akun' : 'Lengkapi Profil Anda'}
            </h2>
            <p className="text-on-surface-variant">
              {step === 1 ? 'Bagaimana Anda ingin menggunakan Thrivea?' : 'Isi data diri di bawah ini untuk menyelesaikan pendaftaran.'}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              {/* Role Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setRole('customer')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 transition-all duration-200 ${
                    role === 'customer' 
                      ? 'border-secondary bg-secondary/5 shadow-button' 
                      : 'border-outline-variant hover:border-secondary/50 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    role === 'customer' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${role === 'customer' ? 'text-secondary' : 'text-on-surface'}`}>Pembeli</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Saya ingin mencari dan membeli produk UMKM lokal berkualitas.</p>
                </div>

                <div 
                  onClick={() => setRole('seller')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 transition-all duration-200 ${
                    role === 'seller' 
                      ? 'border-primary bg-primary/5 shadow-button' 
                      : 'border-outline-variant hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    role === 'seller' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${role === 'seller' ? 'text-primary' : 'text-on-surface'}`}>Penjual UMKM</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Saya memiliki produk UMKM dan ingin berjualan di Thrivea.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-outline-variant/50"></div>
                <span className="text-xs text-on-surface-variant font-medium">ATAU DAFTAR DENGAN</span>
                <div className="flex-1 h-px bg-outline-variant/50"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant text-on-surface font-semibold py-3 px-4 rounded-xl hover:bg-surface-container-low transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Daftar dengan Google
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-button transition-all duration-200 mt-4 ${
                  role === 'customer' ? 'bg-secondary hover:bg-secondary-light' : 'bg-primary hover:bg-primary-light'
                }`}
              >
                Lanjutkan dengan Email
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Nama Lengkap</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className={`input-field ${errors.name ? 'border-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Alamat Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className={`input-field ${errors.email ? 'border-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 karakter"
                      className={`input-field pr-10 ${errors.password ? 'border-error' : ''}`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant"
                    >
                      {/* eye icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">Konfirmasi Password</label>
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    className={`input-field ${errors.confirmPassword ? 'border-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword}</p>}
                </div>

                {/* Seller Specific Fields */}
                {role === 'seller' && (
                  <>
                    <div className="md:col-span-2 mt-2">
                      <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-outline-variant/30 pb-2">Informasi Toko UMKM</h3>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">Nama Toko</label>
                      <input
                        name="storeName"
                        type="text"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="Contoh: Keramik Bumi"
                        className={`input-field ${errors.storeName ? 'border-error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.storeName && <p className="mt-1 text-xs text-error">{errors.storeName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">Kategori Utama</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`input-field appearance-none bg-white ${errors.category ? 'border-error' : ''}`}
                        disabled={isSubmitting}
                      >
                        <option value="">Pilih Kategori</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-xs text-error">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">Nomor WhatsApp Aktif</label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08123456789"
                        className={`input-field ${errors.phone ? 'border-error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-outline-variant text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50 w-1/3"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-2/3 flex justify-center items-center py-3 font-bold text-white rounded-xl shadow-button transition-all ${
                    role === 'seller' ? 'bg-primary hover:bg-primary-light' : 'bg-secondary hover:bg-secondary-light'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Selesaikan Pendaftaran'
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Sudah punya akun?{' '}
            <Link href="/masuk" className="font-bold text-primary hover:text-secondary transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
