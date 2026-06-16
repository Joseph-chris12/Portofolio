'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createDocument } from '@/lib/firestore';
import { uploadProductImage } from '@/lib/storage';
import { generateSlug } from '@/utils/formatters';
import { validateRequired, validatePrice, validateForm } from '@/utils/validators';
import { CATEGORIES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maksimal 5 foto produk');
      return;
    }
    
    const validFiles = [];
    const validPreviews = [];
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} terlalu besar (Maks. 5MB)`);
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });
    
    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...validPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const config = {
      name: { value: formData.name, validators: [validateRequired] },
      category: { value: formData.category, validators: [validateRequired] },
      description: { value: formData.description, validators: [validateRequired] },
      price: { value: formData.price, validators: [validatePrice] },
      stock: { value: formData.stock, validators: [validateRequired] },
    };
    
    const { isValid, errors: validationErrors } = validateForm(config);
    
    if (images.length === 0) {
      validationErrors.images = 'Minimal 1 foto produk dibutuhkan';
    }
    
    if (!isValid || images.length === 0) {
      setErrors(validationErrors);
      toast.error('Mohon lengkapi data produk dengan benar');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan produk...');
    
    try {
      // 1. Prepare product data
      const productId = `prod_${Date.now()}`;
      const slug = generateSlug(formData.name) + '-' + Math.floor(Math.random() * 1000);
      
      // 2. Upload images
      const uploadPromises = images.map(file => uploadProductImage(file, user.uid, productId));
      const uploadResults = await Promise.all(uploadPromises);
      
      const failedUploads = uploadResults.filter(r => !r.success);
      if (failedUploads.length > 0) {
        throw new Error('Gagal mengunggah beberapa gambar');
      }
      
      const imageUrls = uploadResults.map(r => r.url);
      
      // 3. Create document in Firestore
      const productData = {
        name: formData.name,
        slug,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        images: imageUrls,
        isActive: formData.isActive,
        storeId: user.uid,
        storeName: userProfile?.storeName || userProfile?.displayName,
        rating: { average: 0, count: 0 },
        soldCount: 0
      };
      
      const result = await createDocument('products', productData);
      
      if (result.success) {
        toast.success('Produk berhasil ditambahkan!', { id: toastId });
        router.push('/dashboard/produk');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan produk', { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl animate-fade-in-up">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/produk" className="p-2 bg-surface-container hover:bg-outline-variant/30 text-on-surface-variant rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Tambah Produk Baru</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="glass-card p-6 md:p-8 rounded-[24px]">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
            Informasi Produk
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Nama Produk <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-error' : ''}`}
                placeholder="Contoh: Rendang Daging Sapi Premium 250gr"
                maxLength={100}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-error">{errors.name}</p>
                <p className="text-xs text-on-surface-variant">{formData.name.length}/100</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Kategori <span className="text-error">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field appearance-none bg-white ${errors.category ? 'border-error' : ''}`}
              >
                <option value="">Pilih Kategori</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-error">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Deskripsi Produk <span className="text-error">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`input-field resize-y ${errors.description ? 'border-error' : ''}`}
                placeholder="Jelaskan detail produk, bahan, ukuran, cara penggunaan, dan keunggulan produk Anda..."
              ></textarea>
              {errors.description && <p className="mt-1 text-xs text-error">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Price & Stock */}
        <div className="glass-card p-6 md:p-8 rounded-[24px]">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
            Harga & Stok
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Harga Normal (Rp) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rp</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`input-field pl-12 ${errors.price ? 'border-error' : ''}`}
                  placeholder="0"
                  min="0"
                />
              </div>
              {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Harga Diskon (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">Rp</span>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="0"
                  min="0"
                />
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">Kosongkan jika tidak ada diskon</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Stok Tersedia <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`input-field md:w-1/2 ${errors.stock ? 'border-error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="mt-1 text-xs text-error">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Images */}
        <div className="glass-card p-6 md:p-8 rounded-[24px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</div>
              Foto Produk <span className="text-error">*</span>
            </h2>
            <span className="text-sm font-medium text-on-surface-variant">{images.length}/5 Foto</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Uploaded Images */}
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="aspect-square relative rounded-xl overflow-hidden border border-outline-variant group">
                <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-error text-white rounded-lg hover:bg-error-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-1 font-semibold">
                    Foto Utama
                  </div>
                )}
              </div>
            ))}
            
            {/* Upload Button */}
            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container/30 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary">Tambah Foto</span>
              </label>
            )}
          </div>
          {errors.images && <p className="mt-2 text-xs text-error">{errors.images}</p>}
          <p className="mt-4 text-xs text-on-surface-variant">
            Format yang didukung: JPG, PNG, WEBP. Ukuran maksimal 5MB. Foto pertama akan menjadi foto utama (cover).
          </p>
        </div>

        {/* Section 4: Settings */}
        <div className="glass-card p-6 md:p-8 rounded-[24px]">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">4</div>
            Pengaturan
          </h2>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <div>
              <p className="font-semibold text-on-surface">Tampilkan Produk</p>
              <p className="text-xs text-on-surface-variant">Jika dimatikan, produk akan disembunyikan dari pembeli</p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 pb-10">
          <Link href="/dashboard/produk" className="px-6 py-3 font-semibold text-on-surface hover:bg-surface-container rounded-xl transition-colors">
            Batal
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary px-8 flex justify-center items-center gap-2 shadow-button"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Simpan Produk</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
