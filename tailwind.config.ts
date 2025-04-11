/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores principais
        primary: {
          DEFAULT: '#37E359', // Verde DevClub
          dark: '#2BC348',
          light: '#52FF74',
        },
        secondary: {
          DEFAULT: '#051626', // Azul escuro DevClub
          dark: '#020A13',
          light: '#0A2E4D',
        },
        // Cores de fundo
        background: {
          DEFAULT: '#121212',
          lighter: '#1E1E1E',
          card: '#1A1A1A',
        },
        // Cores de texto
        text: {
          DEFAULT: '#F8F9FA',
          muted: '#94A3B8',
          highlight: '#FFFFFF',
        },
        // Cores de elementos
        border: {
          DEFAULT: '#2A2A2A',
          light: '#333333',
        },
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        danger: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)',
        'neon-sm': '0 0 3px theme(colors.primary.DEFAULT)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(55, 227, 89, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(55, 227, 89, 0.9), 0 0 30px rgba(55, 227, 89, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}