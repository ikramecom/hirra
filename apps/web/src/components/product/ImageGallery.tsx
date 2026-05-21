import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';

import type { ProductImage } from '@hirra/shared';
import { cn } from '@/lib/cn';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface ImageGalleryProps {
  images: ProductImage[];
  altFallback?: string;
  locale: 'ar' | 'en';
}

/**
 * PDP image gallery.
 *
 * Defensive sizing strategy — earlier versions let Swiper own the aspect
 * ratio via `aspect-square` on the Swiper element itself, which created a
 * feedback loop on some browsers where the slide's height kept growing on
 * each layout pass until the image filled the viewport.
 *
 * Now: an outer wrapper enforces a fixed responsive square via
 * `aspect-square w-full overflow-hidden`, and the Swiper is absolutely
 * positioned inside it (`absolute inset-0`). Each `<img>` is `h-full w-full
 * object-cover` with `block` display, `select-none`, `draggable={false}`,
 * and NO transitions / transforms / animations. The result is a frame that
 * cannot grow no matter how Swiper recalculates internally.
 */
export function ImageGallery({ images, altFallback = 'Hirra', locale }: ImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-square bg-sand/30 rounded-2xl grid place-items-center">
        <span className="text-6xl text-walnut/40">◇</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hard-constrained square frame. The Swiper lives absolutely inside. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-sand/30">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          spaceBetween={0}
          navigation
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          className="hirra-swiper absolute inset-0 h-full w-full"
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className="h-full w-full">
              <img
                src={img.url}
                alt={(locale === 'ar' ? img.alt_ar : img.alt_en) ?? altFallback}
                className="block h-full w-full object-cover select-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {images.length > 1 ? (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          spaceBetween={8}
          slidesPerView={5}
          watchSlidesProgress
          className="hirra-thumbs"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id} className="cursor-pointer">
              {({ isActive }) => (
                <div
                  className={cn(
                    'aspect-square rounded-lg overflow-hidden border-2',
                    isActive ? 'border-emerald' : 'border-transparent',
                  )}
                >
                  <img
                    src={img.url}
                    alt={`thumb ${i + 1}`}
                    className="block h-full w-full object-cover select-none"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : null}
    </div>
  );
}
