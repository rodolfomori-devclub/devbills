// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#37E359',
          dark: '#2BC348',
          light: '#52FF74',
        },
        secondary: {
          DEFAULT: '#051626',
          dark: '#020A13',
          light: '#0A2E4D',
        },
        background: {
          DEFAULT: '#121212',
          lighter: '#1E1E1E',
          card: '#1A1A1A',
        },
        text: {
          DEFAULT: '#F8F9FA',
          muted: '#94A3B8',
          highlight: '#FFFFFF',
        },
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
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        neon: '0 0 5px #37E359, 0 0 20px #37E359',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(55, 227, 89, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(55, 227, 89, 0.9)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
