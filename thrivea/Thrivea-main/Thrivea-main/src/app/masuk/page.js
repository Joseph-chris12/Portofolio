'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { validateEmail, validateRequired, validateForm } from '@/utils/validators';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formConfig = {
      email: { value: formData.email, validators: [validateEmail] },
      password: { value: formData.password, validators: [validateRequired] },
    };
    
    const { isValid, errors: validationErrors } = validateForm(formConfig);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Sedang masuk...');
    
    const result = await signInWithEmail(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Berhasil masuk!', { id: toastId });
      router.push('/');
    } else {
      toast.error(result.error || 'Gagal masuk. Periksa kembali email dan password Anda.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Membuka Google...');
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast.success('Berhasil masuk dengan Google!', { id: toastId });
      // If it's a new user, they might need to be redirected to complete their profile
      if (result.isNewUser) {
        // We'll let them stay as customer by default, but they can upgrade to seller later
      }
      router.push('/');
    } else {
      toast.error(result.error, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual/Brand (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 gradient-hero p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 nusantara-pattern opacity-20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-primary font-display font-extrabold text-xl">T</span>
            </div>
            <span className="text-2xl font-display font-extrabold text-white">Thrivea</span>
          </Link>
          
          <h1 className="text-5xl font-display font-bold leading-tight mb-6 animate-fade-in-up">
            Selamat Datang Kembali di <br />
            <span className="text-secondary-container">Nusantara Trade</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Akses langsung ke ribuan produk UMKM Indonesia terbaik yang terkurasi.
          </p>
        </div>
        
        <div className="relative z-10 glass-card-strong bg-white/10 p-6 rounded-2xl border-white/20 max-w-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white/90 italic mb-4 font-medium text-sm">
            "Platform yang sangat membantu UMKM kecil seperti saya untuk menjangkau pembeli dari seluruh Indonesia. Proses transaksinya sangat transparan."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Keramik Bumi</p>
              <p className="text-white/60 text-xs">Mitra Penjual</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-surface">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-10 w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-container rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">T</span>
            </div>
            <span className="text-xl font-display font-extrabold text-primary">Thrivea</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-on-surface mb-2">Masuk ke Akun</h2>
            <p className="text-on-surface-variant">Senang melihat Anda kembali!</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white border border-outline-variant text-on-surface font-semibold py-3 px-4 rounded-xl hover:bg-surface-container-low transition-colors mb-6 shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Masuk dengan Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline-variant/50"></div>
            <span className="text-xs text-on-surface-variant font-medium">ATAU MASUK DENGAN EMAIL</span>
            <div className="flex-1 h-px bg-outline-variant/50"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className={`input-field ${errors.email ? 'border-error focus:ring-error/30 focus:border-error' : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1.5 text-xs text-error font-medium">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                  Password
                </label>
                <Link href="/lupa-password" className="text-xs font-semibold text-primary hover:text-secondary transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password Anda"
                  className={`input-field pr-12 ${errors.password ? 'border-error focus:ring-error/30 focus:border-error' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary transition-colors"
                  tabIndex="-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-error font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex justify-center items-center mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Belum punya akun?{' '}
            <Link href="/daftar" className="font-bold text-primary hover:text-secondary transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
