import type { PortfolioTheme } from './sections-data';

export interface StoreProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface StoreAssets {
  brand: string;
  domain: string;
  accent: string;
  bg: string;
  hero: string;
  products: StoreProduct[];
}

/** Bundled local assets — verified category-specific photography */
const local = (path: string) => `/portfolio/${path}`;

export const PORTFOLIO_STORES: Record<PortfolioTheme, StoreAssets> = {
  perfume: {
    brand: 'MAISON ÉLÉGANCE',
    domain: 'maison-elegance.ma',
    accent: '#c9a86c',
    bg: '#0b0907',
    hero: local('perfume/hero.jpg'),
    products: [
      { id: 'p1', name: 'Oud Royal', price: '890 DH', image: local('perfume/product-1.jpg') },
      { id: 'p2', name: 'Amber Noir', price: '1,050 DH', image: local('perfume/product-2.png') },
      { id: 'p3', name: 'Rose d\'Or', price: '1,200 DH', image: local('perfume/product-3.png') },
    ],
  },
  cosmetics: {
    brand: 'LUMIÈRE BEAUTY',
    domain: 'lumiere-beauty.ma',
    accent: '#e8a0c8',
    bg: '#0c080b',
    hero: local('cosmetics/hero.jpg'),
    products: [
      { id: 'c1', name: 'Serum Vit C', price: '249 DH', image: local('cosmetics/product-1.jpg') },
      { id: 'c2', name: 'Crème Nuit', price: '329 DH', image: local('cosmetics/product-2.jpg') },
      { id: 'c3', name: 'Huile Visage', price: '399 DH', image: local('cosmetics/product-3.jpg') },
    ],
  },
  fashion: {
    brand: 'NOIR ATELIER',
    domain: 'noir-atelier.ma',
    accent: '#ddd5c8',
    bg: '#080808',
    hero: local('fashion/hero.jpg'),
    products: [
      { id: 'f1', name: 'Manteau Laine', price: '1,890 DH', image: local('fashion/product-1.jpg') },
      { id: 'f2', name: 'Robe Soie', price: '1,450 DH', image: local('fashion/product-2.jpg') },
      { id: 'f3', name: 'Ensemble Luxe', price: '2,200 DH', image: local('fashion/product-3.jpg') },
    ],
  },
};

export function getStoreDomain(theme: PortfolioTheme): string {
  return PORTFOLIO_STORES[theme].domain;
}
