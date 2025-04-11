/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        primary: {
          500: '#2563EB', // blue-600
          600: '#1D4ED8', // blue-700
          700: '#1E40AF', // blue-800
        },
        success: {
          500: '#10B981', // emerald-500
        },
        danger: {
          500: '#EF4444', // red-500
        },
        warning: {
          500: '#F59E0B', // amber-500
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}