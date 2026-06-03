# RIYANALUXE production visuals

Cinematic luxury AI assets for Vercel static hosting. Referenced from `src/lib/assets.ts`.

## Hero & social
| File | Use |
|------|-----|
| `hero-mabkhara-home.png` | Homepage full-bleed hero |
| `og-riyana-share.png` | Open Graph / Twitter |
| `banner-whatsapp.png` | WhatsApp business profile / campaigns |

## Mabkhara
| File | Use |
|------|-----|
| `mabkhara-product-main.png` | PDP primary |
| `mabkhara-closeup-smoke.png` | Hero card / gallery |
| `mabkhara-gift-presentation.png` | Gift narrative |
| `mabkhara-salon-lifestyle.png` | Editorial / salon |

## Pierre Sèche
| `pierre-seche-main.png` | PDP primary |
| `pierre-seche-bathroom.png` | Gallery / demo |

## Armoire Sèche
| `armoire-seche-main.png` | PDP primary |
| `armoire-seche-wardrobe.png` | Gallery / closet |

## Bundles
| `bundle-rituel-foyer.png` | Rituel du Foyer |
| `bundle-coffret-eid.png` | Coffret Eid |
| `bundle-garde-robe.png` | Maison Sèche (legacy filename) |

## Lifestyle & sections
| `lifestyle-moroccan-salon.png` | Salon atmosphere |
| `lifestyle-eid-hosting.png` | Eid section |
| `lifestyle-evening-atmosphere.png` | Atmosphere band |
| `packaging-luxury-box.png` | Packaging mockup |
| `section-testimonials-bg.png` | Testimonials backdrop |
| `category-mabkhara.png` | Category card |
| `category-home-ritual.png` | Category card |

## Deploy notes
- Paths are root-relative (`/images/riyana/...`) — work on Vercel without config.
- PNGs are ~1.8–2.8 MB each; consider `sharp` or Squoosh to WebP for faster LCP if needed.
- Preload: `hero-mabkhara-home.png` in `index.html`.
