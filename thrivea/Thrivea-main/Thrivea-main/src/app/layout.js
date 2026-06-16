import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    default: 'Thrivea — Marketplace UMKM Indonesia',
    template: '%s | Thrivea',
  },
  description:
    'Platform marketplace berbasis web untuk memberdayakan pelaku UMKM Indonesia. Temukan produk lokal berkualitas, bangun reputasi, dan jangkau pasar lebih luas.',
  keywords: ['UMKM', 'marketplace', 'Indonesia', 'produk lokal', 'Thrivea'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="font-body">
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#0b1c30',
                  boxShadow: '0 8px 30px rgba(26, 20, 107, 0.1)',
                },
                success: {
                  iconTheme: { primary: '#006d36', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ba1a1a', secondary: '#fff' },
                },
              }}
            />
            <Navbar />
            <main className="pt-16 pb-20 md:pb-0 min-h-screen">{children}</main>
            <Footer />
            <MobileBottomNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
