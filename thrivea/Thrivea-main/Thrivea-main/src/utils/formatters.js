// Format number as currency (Rp 150.000)
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date (12 Jun 2026)
export function formatDate(dateInput) {
  if (!dateInput) return '-';
  
  // Handle Firestore Timestamp
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

// Format date and time (12 Jun 2026, 14:30)
export function formatDateTime(dateInput) {
  if (!dateInput) return '-';
  
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Format relative time (2 jam lalu)
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '-';
  
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari lalu`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} minggu lalu`;
  
  return formatDate(date);
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate URL slug from text
export function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Format rating (e.g. 4.8)
export function formatRating(rating) {
  if (rating === undefined || rating === null) return '0.0';
  return Number(rating).toFixed(1);
}

// Format large numbers (15000 -> 15rb)
export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'jt';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'rb';
  }
  return num.toString();
}
