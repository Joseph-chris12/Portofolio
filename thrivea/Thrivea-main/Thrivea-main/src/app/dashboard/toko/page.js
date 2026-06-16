'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocument, updateDocument } from '@/lib/firestore';
import { uploadStoreImage } from '@/lib/storage';
import { validateRequired, validateForm } from '@/utils/validators';
import { CATEGORIES, PROVINCES } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function DashboardStoreSettingsPage() {
  const { user, userProfile } = useAuth();
  
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Image states
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    province: '',
    city: '',
  });

  useEffect(() => {
    async function fetchStore() {
      if (!user) return;
      try {
        const data = await getDocument('stores', user.uid);
        if (data) {
          setStoreData(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            category: data.category || '',
            province: data.province || '',
            city: data.city || '',
          });
          setLogoPreview(data.logo || null);
          setBannerPreview(data.banner || null);
        } else if (userProfile) {
          // Fallback if store doc doesn't exist yet but user profile has some info
          setFormData(prev => ({
            ...prev,
            name: userProfile.storeName || '',
          }));
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
      setLoading(false);
    }
    
    fetchStore();
  }, [user, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format gambar harus JPG, PNG, atau WEBP');
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    
    if (type === 'logo') {
      setLogoFile(file);
      setLogoPreview(previewUrl);
    } else {
      setBannerFile(file);
      setBannerPreview(previewUrl);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const config = {
      name: { value: formData.name, validators: [validateRequired] },
      description: { value: formData.description, validators: [validateRequired] },
      category: { value: formData.category, validators: [validateRequired] },
      province: { value: formData.province, validators: [validateRequired] },
      city: { value: formData.city, validators: [validateRequired] },
    };
    
    const { isValid, errors: validationErrors } = validateForm(config);
    
    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Mohon lengkapi data toko');
      return;
    }
    
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan pengaturan toko...');
    
    try {
      let finalLogoUrl = storeData?.logo || null;
      let finalBannerUrl = storeData?.banner || null;
      
      // Upload logo if changed
      if (logoFile) {
        const logoUpload = await uploadStoreImage(logoFile, user.uid, 'logo');
        if (logoUpload.success) finalLogoUrl = logoUpload.url;
      }
      
      // Upload banner if changed
      if (bannerFile) {
        const bannerUpload = await uploadStoreImage(bannerFile, user.uid, 'banner');
        if (bannerUpload.success) finalBannerUrl = bannerUpload.url;
      }
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        province: formData.province,
        city: formData.city,
        location: `${formData.city}, ${formData.province}`,
        logo: finalLogoUrl,
        banner: finalBannerUrl,
      };
      
      const result = await updateDocument('stores', user.uid, updateData);
      
      if (result.success) {
        // Also update user profile with new store name
        await updateDocument('users', user.uid, { storeName: formData.name });
        
        toast.success('Pengaturan toko berhasil disimpan!', { id: toastId });
        // Clean up object URLs
        if (logoFile) URL.revokeObjectURL(logoPreview);
        if (bannerFile) URL.revokeObjectURL(bannerPreview);
        setLogoFile(null);
        setBannerFile(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan pengaturan', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-surface-container rounded w-1/4 mb-8"></div>
        <div className="glass-card p-6 md:p-8 rounded-[24px]">
          <div className="h-48 bg-surface-container rounded-2xl mb-8"></div>
          <div className="w-24 h-24 bg-surface-container rounded-full -mt-20 ml-8 border-4 border-white mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-surface-container rounded w-full"></div>
            <div className="h-10 bg-surface-container rounded w-full"></div>
            <div className="h-32 bg-surface-container rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Pengaturan Toko</h1>
        <p className="text-sm text-on-surface-variant">Lengkapi profil toko agar lebih menarik bagi pembeli</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner & Logo Section */}
        <div className="glass-card rounded-[24px] overflow-hidden border border-outline-variant/50">
          {/* Banner */}
          <div className="relative h-48 sm:h-64 bg-surface-container group">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner Toko" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-medium">Upload Banner Toko (Opsional)</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="btn-secondary bg-white border-none shadow-lg text-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Ubah Banner
              </button>
            </div>
            <input 
              type="file" 
              ref={bannerInputRef} 
              onChange={(e) => handleImageChange(e, 'banner')} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />
          </div>

          {/* Logo */}
          <div className="px-6 md:px-8 pb-8 relative">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg -mt-14 sm:-mt-16 bg-surface-container overflow-hidden group">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Toko" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary font-display font-bold text-4xl bg-primary/10">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'T'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <input 
              type="file" 
              ref={logoInputRef} 
              onChange={(e) => handleImageChange(e, 'logo')} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />
            <p className="text-xs text-on-surface-variant mt-2 ml-2">Maks. 2MB. Format JPG, PNG.</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Nama Toko <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-error' : ''}`}
                  placeholder="Masukkan nama toko Anda"
                />
                {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Kategori Utama Toko <span className="text-error">*</span></label>
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

              <div className="hidden md:block"></div> {/* Spacer */}

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Provinsi <span className="text-error">*</span></label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
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
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Kota/Kabupaten <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`input-field ${errors.city ? 'border-error' : ''}`}
                  placeholder="Contoh: Kota Bandung"
                />
                {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1.5">Deskripsi Toko <span className="text-error">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={`input-field resize-y ${errors.description ? 'border-error' : ''}`}
                  placeholder="Ceritakan tentang toko Anda, produk yang dijual, jam operasional, dll."
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-error">{errors.description}</p>}
              </div>
            </div>
            
            <div className="flex justify-end mt-8 pt-6 border-t border-outline-variant/50">
              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary px-8 flex justify-center items-center shadow-button"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Simpan Pengaturan'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
