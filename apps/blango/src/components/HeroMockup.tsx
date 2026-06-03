import { motion } from 'framer-motion';

/** Premium hero device showcase — scaled for balanced composition */
export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="hero-mockup relative mx-auto w-full max-w-[260px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[440px]"
    >
      <div className="hero-mockup-glow pointer-events-none absolute inset-0 scale-90" aria-hidden />

      <div className="hero-laptop relative z-10 mx-auto w-full">
        <div className="hero-laptop-screen overflow-hidden rounded-t-xl border border-white/[0.1] bg-[#080808] shadow-[0_24px_48px_rgba(0,0,0,0.55),0_0_40px_rgba(212,175,106,0.06)]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#0e0e0e] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]/70" />
            <span className="mx-auto rounded-md border border-white/[0.06] bg-black/40 px-6 py-0.5 font-sans text-[8px] text-smoke/70">
              maison-elegance.ma
            </span>
          </div>
          <div className="hero-preview-desktop relative aspect-[16/10] overflow-hidden bg-[#0a0908]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(201,168,106,0.14),transparent_55%)]" />
            <div className="relative flex h-full flex-col p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-[8px] font-bold tracking-[0.22em] text-[#c9a86c]">MAISON ÉLÉGANCE</span>
                <span className="rounded-full bg-[#c9a86c]/20 px-2 py-0.5 font-sans text-[6px] font-semibold text-[#c9a86c]">اطلب</span>
              </div>
              <div className="grid flex-1 grid-cols-5 gap-2">
                <div className="col-span-3 flex flex-col justify-center">
                  <div className="mb-1.5 font-heading text-xs font-bold leading-snug text-white sm:text-sm">
                    عطر يعبّر عن فخامتك
                  </div>
                  <div className="mb-3 space-y-1">
                    <div className="h-0.5 w-full max-w-[140px] rounded-full bg-white/10" />
                    <div className="h-0.5 w-[75%] max-w-[110px] rounded-full bg-white/[0.06]" />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="rounded-md bg-[#c9a86c] px-2.5 py-1 font-sans text-[7px] font-semibold text-black">1,200 DH</div>
                    <div className="rounded-md border border-white/10 px-2 py-1 font-sans text-[7px] text-white/45">واتساب</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-end justify-center pb-1">
                  <div className="relative h-full w-full max-w-[80px] rounded-lg border border-[#c9a86c]/18 bg-gradient-to-t from-[#1a1510] to-[#c9a86c]/08">
                    <div className="absolute bottom-[16%] left-1/2 h-[58%] w-[30%] -translate-x-1/2 rounded-t-full border border-[#c9a86c]/25 bg-gradient-to-b from-[#2a2218] to-[#0b0907]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-laptop-base mx-auto h-2.5 w-[94%] rounded-b-lg bg-gradient-to-b from-[#222] to-[#111]" />
        <div className="mx-auto h-1 w-[18%] rounded-b-md bg-[#333]" />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -16, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="hero-phone absolute -bottom-2 -left-3 z-20 w-[26%] min-w-[88px] max-w-[118px] sm:-bottom-3 sm:-left-5"
      >
        <div className="overflow-hidden rounded-[20px] border-2 border-white/[0.12] bg-[#0a0a0a] shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(212,175,106,0.08)]">
          <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-white/12" />
          <div className="hero-preview-mobile aspect-[9/19] bg-[#0a0908] p-2">
            <div className="mb-1 font-sans text-[5px] font-bold text-[#c9a86c]">MAISON</div>
            <div className="mb-1 font-heading text-[7px] font-bold text-white">عطر فاخر</div>
            <div className="mb-1.5 h-10 rounded-md border border-[#c9a86c]/12 bg-gradient-to-b from-[#1a1510] to-transparent" />
            <div className="rounded-md bg-[#c9a86c] py-1 text-center font-sans text-[6px] font-bold text-black">واتساب</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
