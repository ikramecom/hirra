import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4ECE0',
        emerald: '#0E5C42',
        'emerald-dark': '#0A4732',
        gold: '#C7A86A',
        brass: '#A88A4A',
        walnut: '#2E1E12',
        whisper: '#FFFCF7',
        sand: '#E2D5B7',
        signal: '#B33A3A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(46, 30, 18, 0.04), 0 4px 14px rgba(46, 30, 18, 0.05)',
        'card-hover': '0 4px 8px rgba(46, 30, 18, 0.06), 0 18px 36px rgba(46, 30, 18, 0.08)',
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
