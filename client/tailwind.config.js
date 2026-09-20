/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        india: {
          saffron: '#FF671F',
          white: '#FFFFFF',
          green: '#046A38',
          navy: '#06038D',
        },
        navy: {
          800: '#0b1528',
          900: '#070d1e',
          950: '#030712',
        },
        gov: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f6',
          500: '#0c87e7',
          600: '#026bc5',
          700: '#0355a0',
          800: '#074883',
          900: '#0c3d6e',
          950: '#082749',
        },
        cyanAccent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        emeraldGov: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'elevated': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(12, 135, 231, 0.25)',
        'cyanGlow': '0 0 25px rgba(6, 182, 212, 0.35)',
      }
    },
  },
  plugins: [],
}
