'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import { validateEmail } from '@/utils/validators';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim link reset password...');
    
    const result = await resetPassword(email);
    
    if (result.success) {
      toast.success('Link reset berhasil dikirim!', { id: toastId });
      setIsSuccess(true);
    } else {
      toast.error(result.error, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-container relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 gradient-hero"></div>
      
      <div className="glass-card w-full max-w-md p-8 sm:p-10 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white rounded-xl mb-6 shadow-md">
            <span className="font-display font-extrabold text-2xl">T</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-on-surface mb-2">Lupa Password?</h1>
          <p className="text-sm text-on-surface-variant">
            {isSuccess 
              ? 'Periksa kotak masuk email Anda untuk instruksi reset password.' 
              : 'Masukkan alamat email yang terdaftar, kami akan mengirimkan link untuk mereset password Anda.'}
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <Link href="/masuk" className="btn-primary w-full block">
              Kembali ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="nama@email.com"
                className={`input-field bg-white ${error ? 'border-error' : ''}`}
                disabled={isSubmitting}
              />
              {error && <p className="mt-1 text-xs text-error font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Kirim Link Reset'
              )}
            </button>
            
            <div className="text-center">
              <Link href="/masuk" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                Kembali ke Halaman Masuk
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
