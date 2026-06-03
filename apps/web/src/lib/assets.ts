/**
 * RIYANALUXE production visual assets — served from /public/images/riyana/
 * All paths are root-relative for Vercel static hosting.
 */
export const RIYANALUXE_ASSETS = {
  hero: {
    home: '/images/riyana/hero-mabkhara-home.png',
    homeAlt: '/images/riyana/hero-mabkhara-home.png',
  },
  products: {
    mabkhara: {
      main: '/images/riyana/mabkhara-product-main.png',
      closeup: '/images/riyana/mabkhara-closeup-smoke.png',
      gift: '/images/riyana/mabkhara-gift-presentation.png',
      salon: '/images/riyana/mabkhara-salon-lifestyle.png',
    },
    pierreSeche: {
      main: '/images/riyana/pierre-seche-main.png',
      demo: '/images/riyana/pierre-seche-bathroom.png',
    },
    armoireSeche: {
      main: '/images/riyana/armoire-seche-main.png',
      closet: '/images/riyana/armoire-seche-wardrobe.png',
    },
  },
  bundles: {
    rituelFoyer: '/images/riyana/bundle-rituel-foyer.png',
    coffretEid: '/images/riyana/bundle-coffret-eid.png',
    maisonSeche: '/images/riyana/bundle-garde-robe.png',
  },
  lifestyle: {
    salon: '/images/riyana/lifestyle-moroccan-salon.png',
    eid: '/images/riyana/lifestyle-eid-hosting.png',
    atmosphere: '/images/riyana/lifestyle-evening-atmosphere.png',
  },
  packaging: '/images/riyana/packaging-luxury-box.png',
  social: {
    og: '/images/riyana/og-riyana-share.png',
    whatsapp: '/images/riyana/banner-whatsapp.png',
  },
  sections: {
    testimonialBg: '/images/riyana/section-testimonials-bg.png',
    categoryMabkhara: '/images/riyana/category-mabkhara.png',
    categoryHome: '/images/riyana/category-home-ritual.png',
  },
} as const;

export type RiyanaluxeAssetPath = (typeof RIYANALUXE_ASSETS)[keyof typeof RIYANALUXE_ASSETS] extends string
  ? (typeof RIYANALUXE_ASSETS)[keyof typeof RIYANALUXE_ASSETS]
  : string;

/** @deprecated Use RIYANALUXE_ASSETS */
export const RIYANA_ASSETS = RIYANALUXE_ASSETS;
