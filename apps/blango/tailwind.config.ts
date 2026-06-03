import type { Config } from 'tailwindcss';
import rtl from 'tailwindcss-rtl';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        charcoal: '#060606',
        ink: '#0e0e0e',
        gold: '#D4AF6A',
        'gold-light': '#E8D5A8',
        'gold-muted': '#A8894A',
        champagne: '#F0E6D0',
        pearl: '#FAFAFA',
        smoke: '#8E8E93',
        muted: '#636366',
      },
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        heading: ['Alexandria', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', 'sans-serif'],
        price: ['Manrope', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        price: ['3.5rem', { lineHeight: '0.92', letterSpacing: '-0.05em', fontWeight: '700' }],
        'price-lg': ['4.25rem', { lineHeight: '0.9', letterSpacing: '-0.055em', fontWeight: '700' }],
        'price-xl': ['5rem', { lineHeight: '0.88', letterSpacing: '-0.06em', fontWeight: '700' }],
        hero: ['clamp(2rem,4.2vw,3.75rem)', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '700' }],
        section: ['clamp(2.125rem,5vw,3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
      },
      maxWidth: { content: '1200px' },
      borderRadius: { card: '24px', pill: '999px' },
      letterSpacing: {
        luxury: '0.3em',
        wide: '0.2em',
      },
      boxShadow: {
        glow: '0 0 80px rgba(212, 175, 106, 0.14)',
        'glow-lg': '0 0 120px rgba(212, 175, 106, 0.18)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [rtl],
};

export default config;
