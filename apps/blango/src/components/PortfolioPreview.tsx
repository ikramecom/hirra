import { ShoppingBag, Search } from 'lucide-react';
import type { PortfolioTheme } from '@/lib/sections-data';
import { PORTFOLIO_STORES, type StoreAssets, type StoreProduct } from '@/lib/portfolio-assets';

interface PortfolioPreviewProps {
  theme: PortfolioTheme;
  variant: 'desktop' | 'mobile';
}

function StoreImage({
  src,
  alt,
  className = '',
  fit = 'cover',
}: {
  src: string;
  alt: string;
  className?: string;
  fit?: 'cover' | 'contain';
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`store-photo h-full w-full ${fit === 'contain' ? 'object-contain p-1' : 'object-cover'} ${className}`}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
}

function StoreNav({ store, compact }: { store: StoreAssets; compact?: boolean }) {
  return (
    <div className={`store-nav flex items-center justify-between ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}`}>
      <span
        className="font-sans font-bold tracking-widest text-white/90"
        style={{ fontSize: compact ? '5px' : '7px', color: store.accent }}
      >
        {compact ? store.brand.split(' ')[0] : store.brand}
      </span>
      <div className="flex items-center gap-1.5">
        <Search className="text-white/35" style={{ width: compact ? 8 : 10, height: compact ? 8 : 10 }} strokeWidth={2} />
        <ShoppingBag className="text-white/35" style={{ width: compact ? 8 : 10, height: compact ? 8 : 10 }} strokeWidth={2} />
      </div>
    </div>
  );
}

function ProductTile({
  product,
  store,
  compact,
}: {
  product: StoreProduct;
  store: StoreAssets;
  compact?: boolean;
}) {
  return (
    <article className="store-product group overflow-hidden rounded-md border border-white/[0.06] bg-[#111]">
      <div className={`store-product-image relative overflow-hidden bg-[#121212] ${compact ? 'aspect-[3/4]' : 'aspect-square'}`}>
        <StoreImage src={product.image} alt={product.name} fit="contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        <span
          className="absolute bottom-1 left-1 rounded px-1 py-0.5 font-price font-bold text-white backdrop-blur-sm"
          style={{
            fontSize: compact ? '5px' : '7px',
            backgroundColor: `${store.accent}33`,
          }}
        >
          {product.price}
        </span>
      </div>
      {!compact && (
        <p className="truncate px-1.5 py-1 font-sans text-[6px] text-white/45">{product.name}</p>
      )}
    </article>
  );
}

function CategoryPills({ store, compact }: { store: StoreAssets; compact?: boolean }) {
  const labels = ['الكل', 'جديد', 'الأكثر مبيعاً'];
  return (
    <div className={`flex gap-1 overflow-hidden ${compact ? 'px-2 pb-1' : 'px-3 pb-2'}`}>
      {labels.map((label, i) => (
        <span
          key={label}
          className="shrink-0 rounded-full border px-1.5 py-0.5 font-arabic text-white/50"
          style={{
            fontSize: compact ? '5px' : '6px',
            borderColor: i === 0 ? `${store.accent}55` : 'rgba(255,255,255,0.08)',
            backgroundColor: i === 0 ? `${store.accent}18` : 'transparent',
            color: i === 0 ? store.accent : undefined,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function DesktopStore({ store }: { store: StoreAssets }) {
  return (
    <div className="store-preview store-preview-desktop flex h-full flex-col" style={{ backgroundColor: store.bg }}>
      <StoreNav store={store} />

      <div className="store-hero relative mx-3 mb-2 overflow-hidden rounded-lg">
        <div className="aspect-[2.4/1]">
          <StoreImage src={store.hero} alt={`${store.brand} collection`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-2 right-2 left-2 flex items-end justify-between">
          <span className="rounded-md px-2 py-1 font-arabic text-[7px] font-semibold text-white backdrop-blur-md" style={{ backgroundColor: `${store.accent}cc` }}>
            تسوق المجموعة
          </span>
          <span className="font-sans text-[6px] text-white/50">★ 4.9</span>
        </div>
      </div>

      <CategoryPills store={store} />

      <div className="grid flex-1 grid-cols-3 gap-1.5 px-3 pb-3">
        {store.products.map((product) => (
          <ProductTile key={product.id} product={product} store={store} />
        ))}
      </div>
    </div>
  );
}

function MobileStore({ store }: { store: StoreAssets }) {
  return (
    <div className="store-preview store-preview-mobile flex h-full flex-col" style={{ backgroundColor: store.bg }}>
      <StoreNav store={store} compact />

      <div className="store-hero relative mx-2 mb-1.5 overflow-hidden rounded-md">
        <div className="aspect-[16/9]">
          <StoreImage src={store.hero} alt={`${store.brand} hero`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <CategoryPills store={store} compact />

      <div className="grid flex-1 grid-cols-2 gap-1 px-2 pb-2">
        {store.products.slice(0, 2).map((product) => (
          <ProductTile key={product.id} product={product} store={store} compact />
        ))}
      </div>

      <div className="mx-2 mb-2">
        <ProductTile product={store.products[2]} store={store} compact />
      </div>
    </div>
  );
}

export function PortfolioPreview({ theme, variant }: PortfolioPreviewProps) {
  const store = PORTFOLIO_STORES[theme];
  return variant === 'mobile' ? <MobileStore store={store} /> : <DesktopStore store={store} />;
}
