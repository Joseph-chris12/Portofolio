/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9ff',
        surface: '#f8f9ff',
        primary: {
          DEFAULT: '#1a146b',
          container: '#312e81',
          light: '#4338ca',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#9c9af4',
        secondary: {
          DEFAULT: '#006d36',
          container: '#6dfe9c',
          light: '#00a854',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#007439',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#474651',
        outline: {
          DEFAULT: '#777682',
          variant: '#c8c5d3',
        },
        error: '#ba1a1a',
        'surface-container': '#e5eeff',
        'surface-container-low': '#f0f2ff',
        'surface-container-high': '#dde4f7',
        warning: '#f59e0b',
        success: '#10b981',
        info: '#3b82f6',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        'gutter': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-soft': 'pulseSoft 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(26, 20, 107, 0.06)',
        'card': '0 2px 12px rgba(26, 20, 107, 0.05)',
        'card-hover': '0 8px 30px rgba(26, 20, 107, 0.12)',
        'nav': '0 1px 3px rgba(26, 20, 107, 0.05)',
        'button': '0 4px 14px rgba(0, 109, 54, 0.25)',
      },
    },
  },
  plugins: [],
};
