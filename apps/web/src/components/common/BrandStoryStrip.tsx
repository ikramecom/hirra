import { useTranslation } from 'react-i18next';
import { Eyebrow } from './Eyebrow';

/**
 * Three-frame editorial story strip, sequencing the customer journey:
 *  1) The everyday problem (the abaya, the ritual moment)
 *  2) The HIRRA solution (the product made elegant)
 *  3) The result (the calm Saudi home that follows)
 *
 * Each frame is a photograph from /public/brand/. A walnut multiply
 * overlay keeps the cream copy legible across all three.
 */

interface Frame {
  numeral: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  /** focal point for object-position so the most editorial part stays in frame on tall crops */
  focal?: string;
}

export function BrandStoryStrip() {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  const frames: Frame[] =
    locale === 'ar'
      ? [
          {
            numeral: '٠١',
            eyebrow: 'الواقع',
            title: 'العباية السوداء، شعر القطة، صباح حفلة',
            body:
              'كل بيت سعودي فيه قطة يعرف اللحظة هذي. الكم الأسود يلمع بشعر، الرولر العادي يترك لصقات على القماش، والوقت يجري.',
            image: '/brand/lifestyle-grooming.png',
            alt: 'يد سعودية تمسّد قطة بيرشيان كريمية بجانب عباية سوداء وكأس نحاسي',
            focal: '50% 35%',
          },
          {
            numeral: '٠٢',
            eyebrow: 'الحل',
            title: 'سحبة واحدة. سيليكون فاخر. صفر هدر',
            body:
              'هِرّة برو رولر مصمم للأقمشة الحساسة، يلتقط الشعر بدون لصقات أو بقايا، ويعيش معك إلى الأبد.',
            image: '/brand/hirra-pro-roller.png',
            alt: 'هِرّة برو رولر سيليكون زيتي بتفاصيل نحاسية على عباية حريرية سوداء',
            focal: '50% 50%',
          },
          {
            numeral: '٠٣',
            eyebrow: 'النتيجة',
            title: 'بيت هادي، عباية نظيفة، قطة سعيدة',
            body:
              'البيت السعودي يستاهل تصميم هادئ يدوم. هذا وعدنا — ضمان رضا ٣٠ يوم، وواتساب يرد عليكِ بسرعة.',
            image: '/brand/hero-living-room.png',
            alt: 'مجلس سعودي حديث بألوان دافئة مع قطة بريطانية رمادية',
            focal: '50% 40%',
          },
        ]
      : [
          {
            numeral: '01',
            eyebrow: 'The reality',
            title: 'Black abaya, cat hair, the morning before the wedding',
            body:
              'Every Saudi cat-mom knows this moment. The sleeve catches the light. The lint roller leaves residue. The clock keeps moving.',
            image: '/brand/lifestyle-grooming.png',
            alt: 'A Saudi woman’s hand grooming a cream Persian cat next to a black abaya and a brass cup',
            focal: '50% 35%',
          },
          {
            numeral: '02',
            eyebrow: 'The ritual',
            title: 'One swipe. Premium silicone. Zero waste.',
            body:
              'The Hirra Pro Roller is designed for delicate fabrics — picks up hair without sticky residue, and lives with you forever.',
            image: '/brand/hirra-pro-roller.png',
            alt: 'The Hirra Pro Roller in olive silicone with brass caps, on a folded black silk abaya',
            focal: '50% 50%',
          },
          {
            numeral: '03',
            eyebrow: 'The outcome',
            title: 'A quiet home, a clean abaya, a content cat',
            body:
              'The Saudi home deserves design that lasts. That’s our promise — 30-day guarantee, and a real WhatsApp number that replies.',
            image: '/brand/hero-living-room.png',
            alt: 'A modern Saudi living room with a British Shorthair on a cream sofa',
            focal: '50% 40%',
          },
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {frames.map((frame) => (
        <article
          key={frame.numeral}
          className="group relative overflow-hidden rounded-card aspect-[4/5] flex flex-col text-cream"
        >
          <img
            src={frame.image}
            alt={frame.alt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: frame.focal ?? '50% 50%' }}
            loading="lazy"
          />
          {/* Editorial darkening to keep the cream copy crisp across photos */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-walnut/70 via-walnut/25 to-walnut/10"
            aria-hidden
          />

          <div className="relative flex-1 flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <Eyebrow tone="cream">{frame.eyebrow}</Eyebrow>
              <span
                className="font-display text-3xl text-cream/55 tabular leading-none"
                aria-hidden
              >
                {frame.numeral}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="heading-display text-h3 leading-snug text-balance">
                {frame.title}
              </h3>
              <p className="text-sm text-cream/85 leading-relaxed text-pretty">
                {frame.body}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
