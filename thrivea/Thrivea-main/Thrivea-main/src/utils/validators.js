export function validateEmail(email) {
  if (!email) return 'Email wajib diisi';
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) return 'Format email tidak valid';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password wajib diisi';
  if (password.length < 8) return 'Password minimal 8 karakter';
  
  // Optional stricter checks:
  // if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf besar';
  // if (!/[a-z]/.test(password)) return 'Password harus mengandung huruf kecil';
  // if (!/[0-9]/.test(password)) return 'Password harus mengandung angka';
  
  return null;
}

export function validatePhone(phone) {
  if (!phone) return 'Nomor telepon wajib diisi';
  const re = /^[0-9+]{10,14}$/;
  if (!re.test(phone)) return 'Format nomor telepon tidak valid';
  return null;
}

export function validateRequired(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} wajib diisi`;
  }
  return null;
}

export function validatePrice(price) {
  if (price === undefined || price === null || price === '') return 'Harga wajib diisi';
  const num = Number(price);
  if (isNaN(num)) return 'Harga harus berupa angka';
  if (num <= 0) return 'Harga harus lebih besar dari 0';
  return null;
}

export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) return 'File wajib diunggah';
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Hanya format JPG, PNG, atau WEBP yang diperbolehkan';
  }
  
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return `Ukuran file maksimal ${maxSizeMB}MB`;
  }
  
  return null;
}

export function validateForm(fieldsConfig) {
  const errors = {};
  let isValid = true;

  Object.entries(fieldsConfig).forEach(([fieldName, config]) => {
    const { value, validators } = config;
    
    for (const validator of validators) {
      const errorMsg = validator(value, fieldName);
      if (errorMsg) {
        errors[fieldName] = errorMsg;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
}
