import { useTranslation } from 'react-i18next';
import { Eyebrow } from './Eyebrow';

/**
 * A short, founder-voiced paragraph in Arabic / English with a "signature".
 *
 * Single biggest signal that this is a real Saudi brand and not a reseller.
 * Pairs an editorial Saudi-home photograph with a hand-set founder note.
 */
export function FoundersNote() {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  return (
    <section className="relative overflow-hidden rounded-hero bg-whisper border border-walnut/10">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0">
        {/* Photo column */}
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[320px] overflow-hidden">
          <img
            src="/brand/lifestyle-grooming.png"
            alt={
              locale === 'ar'
                ? 'يد مؤسسة هِرّة وقطتها الفارسية الكريمية'
                : 'Hirra’s founder’s hand grooming her cream Persian cat'
            }
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '40% 35%' }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-walnut/40 via-walnut/10 to-transparent"
            aria-hidden
          />
        </div>

        {/* Text column */}
        <div className="p-8 md:p-10 lg:p-12 space-y-4">
          <Eyebrow>{locale === 'ar' ? 'كلمة من المؤسسة' : "Founder's note"}</Eyebrow>

          <p className="text-walnut/85 leading-relaxed text-pretty max-w-prose text-base md:text-lg">
            {locale === 'ar'
              ? 'صنعت هِرّة لأني ما لقيت منتجات قطط تليق على البيت السعودي. منتجات مصممة بحب — تخلّيكِ تحبّين قطتكِ بدون ما تتنازلين عن جمال بيتكِ. كل قطعة عندنا اخترناها وجرّبناها بأنفسنا، ووراها وعد: لو ما عجبكِ، نسترجعه.'
              : 'I started Hirra because I couldn’t find cat-care products that belonged in a Saudi home. Pieces designed with care — so you can love your cat without compromising the home you’ve built. Everything we sell, we use ourselves, and behind each piece is one promise: if it’s not right, we take it back.'}
          </p>

          <div className="pt-2">
            <p className="font-display italic text-2xl text-emerald leading-none">
              {locale === 'ar' ? 'إكرام، مؤسسة هِرّة' : 'Hind, founder of Hirra'}
            </p>
            <p className="text-xs text-walnut/55 mt-1.5 uppercase tracking-[0.16em] font-semibold">
              {locale === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
