import type { Config } from 'tailwindcss';
import rtl from 'tailwindcss-rtl';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  future: {
    // Prevents the "sticky hover" bug on touch devices — `hover:` and
    // `group-hover:` variants only apply on `@media (hover: hover)` (real
    // pointers). On phones a tap will no longer leave hover effects (scale,
    // brightness, opacity-reveal) latched on.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        cream: '#F4ECE0',
        emerald: '#0E5C42',
        'emerald-dark': '#0A4732',
        'emerald-deep': '#073525',
        gold: '#C7A86A',
        'gold-light': '#D9BE8A',
        brass: '#A88A4A',
        midnight: '#0E1A14',
        dune: '#D9C9A8',
        walnut: '#2E1E12',
        'walnut-light': '#5A3D26',
        sand: '#E2D5B7',
        'sand-soft': '#EFE5CD',
        whisper: '#FFFCF7',
        signal: '#B33A3A',
      },
      fontFamily: {
        arabic: ['"IBM Plex Arabic"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['12px', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        hero: ['clamp(2.25rem, 6.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        h1: ['clamp(1.85rem, 5vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.2' }],
        h3: ['clamp(1.15rem, 2.5vw, 1.4rem)', { lineHeight: '1.3' }],
      },
      maxWidth: {
        content: '1280px',
        prose: '62ch',
      },
      borderRadius: {
        card: '20px',
        hero: '28px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(46, 30, 18, 0.04), 0 4px 14px rgba(46, 30, 18, 0.05)',
        'card-hover': '0 4px 8px rgba(46, 30, 18, 0.06), 0 18px 36px rgba(46, 30, 18, 0.08)',
        sticky: '0 -8px 24px rgba(46, 30, 18, 0.08)',
        ring: '0 0 0 4px rgba(14, 92, 66, 0.12)',
      },
      animation: {
        'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        marquee: 'marquee 24s linear infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backgroundImage: {
        'shimmer-cream':
          'linear-gradient(90deg, rgba(244,236,224,0) 0%, rgba(255,252,247,0.7) 50%, rgba(244,236,224,0) 100%)',
      },
    },
  },
  plugins: [rtl],
};

export default config;
