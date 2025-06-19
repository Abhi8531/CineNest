/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cineNest: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          accent: '#06B6D4',
          dark: {
            bg: '#0F172A',
            surface: '#1E293B',
            border: '#334155',
          },
          light: {
            bg: '#F8FAFC',
            surface: '#FFFFFF',
            border: '#E2E8F0',
          }
        }
      },
      fontFamily: {
        'cine': ['Nunito Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-5px,0)' },
          '70%': { transform: 'translate3d(0,-3px,0)' },
          '90%': { transform: 'translate3d(0,-1px,0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cine': '0 4px 14px 0 rgba(139, 92, 246, 0.15)',
        'cine-lg': '0 10px 25px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
      }
    },
  },
  plugins: [],
}

