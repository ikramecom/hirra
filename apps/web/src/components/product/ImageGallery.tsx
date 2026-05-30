interface ImageGalleryProps {
  src: string;
  alt: string;
}

/**
 * Product detail image — single static frame; parent controls src (e.g. color variant).
 */
export function ImageGallery({ src, alt }: ImageGalleryProps) {
  if (!src) {
    return (
      <div className="frame-gold rounded-hero bg-ink flex min-h-[280px] w-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-display text-4xl text-gold/30" aria-hidden>
            R
          </span>
          <p className="text-xs uppercase tracking-[0.2em] text-gold/40">RIYANALUXE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="frame-gold rounded-hero bg-ink flex w-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] items-center justify-center p-6 sm:p-8 md:p-10">
      <img
        key={src}
        src={src}
        alt={alt}
        className="block h-auto w-full max-h-[520px] max-w-full object-contain object-center"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
      />
    </div>
  );
}
