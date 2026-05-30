import type { Config } from 'tailwindcss';
import rtl from 'tailwindcss-rtl';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0908',
        charcoal: '#141210',
        ink: '#1C1916',
        gold: '#C9A962',
        'gold-light': '#E2CF9A',
        champagne: '#E8D5B5',
        sand: '#B8A88A',
        pearl: '#F5F0E8',
        smoke: '#8A8278',
        signal: '#C45C5C',
        cream: '#F5F0E8',
        emerald: '#C9A962',
        walnut: '#F5F0E8',
        whisper: '#141210',
      },
      fontFamily: {
        arabic: ['"IBM Plex Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['10px', { lineHeight: '1.3', letterSpacing: '0.28em' }],
        hero: ['clamp(2.75rem, 8vw, 4.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h1: ['clamp(2rem, 5.5vw, 3.25rem)', { lineHeight: '1.12' }],
        h2: ['clamp(1.65rem, 4vw, 2.5rem)', { lineHeight: '1.18' }],
        h3: ['clamp(1.2rem, 2.5vw, 1.5rem)', { lineHeight: '1.3' }],
        lead: ['clamp(1.05rem, 2vw, 1.25rem)', { lineHeight: '1.75' }],
      },
      maxWidth: { content: '1200px', prose: '58ch' },
      borderRadius: { card: '22px', hero: '32px' },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.45)',
        'card-hover': '0 20px 56px rgba(0,0,0,0.55)',
        glow: '0 0 80px rgba(201, 169, 98, 0.12)',
        'glow-sm': '0 0 32px rgba(201, 169, 98, 0.08)',
        sticky: '0 -12px 40px rgba(0,0,0,0.55)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 1s ease-out both',
        'pulse-gold': 'pulse-gold 5s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'pulse-gold': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [rtl],
};

export default config;
