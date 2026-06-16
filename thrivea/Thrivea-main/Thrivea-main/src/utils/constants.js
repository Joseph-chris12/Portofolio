export const CATEGORIES = [
  { id: 'makanan-minuman', name: 'Makanan & Minuman', slug: 'makanan-minuman', icon: 'restaurant' },
  { id: 'fashion-tekstil', name: 'Fashion & Tekstil', slug: 'fashion-tekstil', icon: 'checkroom' },
  { id: 'kerajinan', name: 'Kerajinan', slug: 'kerajinan', icon: 'palette' },
  { id: 'aksesoris', name: 'Aksesoris', slug: 'aksesoris', icon: 'watch' },
  { id: 'elektronik', name: 'Elektronik', slug: 'elektronik', icon: 'devices' },
  { id: 'kecantikan', name: 'Kecantikan', slug: 'kecantikan', icon: 'face' },
  { id: 'pertanian', name: 'Agribisnis', slug: 'pertanian', icon: 'agriculture' },
  { id: 'jasa', name: 'Jasa & Layanan', slug: 'jasa', icon: 'handshake' },
];

export const STORE_CATEGORIES = CATEGORIES;

export const ORDER_STATUS = {
  PENDING: { id: 'pending', label: 'Menunggu Bayar', color: 'bg-warning/10 text-warning' },
  PAID: { id: 'paid', label: 'Dibayar', color: 'bg-info/10 text-info' },
  PROCESSING: { id: 'processing', label: 'Diproses', color: 'bg-primary/10 text-primary' },
  SHIPPED: { id: 'shipped', label: 'Dikirim', color: 'bg-secondary-container text-on-secondary-container' },
  COMPLETED: { id: 'completed', label: 'Selesai', color: 'bg-success/10 text-success' },
  CANCELLED: { id: 'cancelled', label: 'Dibatalkan', color: 'bg-error/10 text-error' },
};

export const BANKS = [
  { id: 'bca', name: 'Bank BCA', accountName: 'PT Thrivea Nusantara', accountNumber: '1234567890', logo: 'BCA' },
  { id: 'bni', name: 'Bank BNI', accountName: 'PT Thrivea Nusantara', accountNumber: '0987654321', logo: 'BNI' },
  { id: 'bri', name: 'Bank BRI', accountName: 'PT Thrivea Nusantara', accountNumber: '1122334455', logo: 'BRI' },
  { id: 'mandiri', name: 'Bank Mandiri', accountName: 'PT Thrivea Nusantara', accountNumber: '5544332211', logo: 'Mandiri' },
  { id: 'bsi', name: 'Bank Syariah Indonesia', accountName: 'PT Thrivea Nusantara', accountNumber: '7788990011', logo: 'BSI' },
];

export const PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Bengkulu', 
  'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Lampung', 'Banten', 'DKI Jakarta', 
  'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 
  'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 
  'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 
  'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 
  'Papua Barat', 'Papua'
];
