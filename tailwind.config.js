/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nhm: {
          navy: '#06152E',
          background: '#F5F6FA',
          accent: '#F9A826',
          textPrimary: '#4B5563',
          textSecondary: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};
