import type { StoreLocale } from '@/i18n';

/** Cinematic luxury copy — ton marocain premium, sans marketing golfe */
export function homeCopy(locale: StoreLocale) {
  if (locale === 'ar') {
    return {
      eyebrow: 'ريانا لوكس · دار عطر مغربية',
      heroTitle: 'الضيافة\nتبدأ من الريحة',
      heroLead:
        'مبخرة لوكس — بخور عصري بلا فحم. أسود وذهبي، ريحة نقية، وهدية تليق بصالون الدار البيضاء أو الرباط.',
      heroPriceNote: 'القطعة الأيقونية · مبخرة لوكس',
      ctaPrimary: 'اكتشف المبخرة',
      ctaSecondary: 'راسِلنا على واتساب',
      ritualQuote:
        'كل زاوية في دارك تستحق ريحة راقية تليق بذوقك. ريانا لوكس كتجمع بين فخامة المبخرة، دفء العطر، وأناقة الديكور المغربي.',
      mabkharaTitle: 'المبخرة · قلب الدار',
      mabkharaLead:
        'قطعة وحدة كتبدّل جوّ الصالون: تسخين سريع، بخور بلا رماد، وتفاصيل ذهبية كتبان قبل ما يتشمّ.',
      packagingTitle: 'تغليف فاخر',
      packagingLead:
        'علبة سوداء مطفية، شريط ذهبي، وبطاقة ترحيب — باش توصل الهدية بإحساس راقي يليق بمن تحب.',
      atmosphereTitle: 'جوّ المساء',
      atmosphereLead:
        'ضوء خافت، بخور يتصاعد بهدوء، وصالون مستعد للضيافة — هكذا كنتخايلو الدار مع ريانا لوكس.',
      eidTitle: 'تشكيلة العيد',
      eidLead: 'المجموعة الكاملة — مبخرة، حجر الحمام، وحماية الدولاب — في تقديم واحد أنيق.',
      companionsEyebrow: 'مكملات الدار',
      companionsTitle: 'لإكمال الطقس',
      testimonialsTitle: 'من زبنائنا',
      trustTitle: 'خدمة من المغرب',
      faqTitle: 'أسئلة متكررة',
      closingCta: 'راسِلنا — نعاونك تختار الطقس المناسب',
    };
  }
  return {
    eyebrow: 'RIYANALUXE · Maison marocaine',
    heroTitle: "L'hospitalité\npasse par le parfum",
    heroLead:
      'Mabkhara Luxe — bakhoor moderne sans charbon. Noir et or, parfum pur, un cadeau digne d’un salon à Casa ou Rabat.',
    heroPriceNote: 'Pièce iconique · Mabkhara Luxe',
    ctaPrimary: 'Découvrir la Mabkhara',
    ctaSecondary: 'WhatsApp',
    ritualQuote:
      'Dans le foyer marocain, le parfum est mémoire et générosité. RIYANALUXE en fait un rituel calme et raffiné.',
    mabkharaTitle: 'La Mabkhara · cœur de la maison',
    mabkharaLead:
      'Une pièce qui change l’atmosphère du salon : chauffe rapide, sans cendres, détails dorés visibles.',
    packagingTitle: 'Un coffret cadeau',
    packagingLead:
      'Boîte noire mate, ruban doré, carte de bienvenue — chaque commande arrive comme un geste de boutique.',
    atmosphereTitle: 'L’atmosphère du soir',
    atmosphereLead:
      'Lumière tamisée, encens qui monte lentement — la maison RIYANALUXE.',
    eidTitle: 'Sélection de fête',
    eidLead: 'Le rituel complet — Mabkhara, Pierre Sèche, Armoire Sèche — une seule présentation.',
    companionsEyebrow: 'Compléments',
    companionsTitle: 'Pour compléter le rituel',
    testimonialsTitle: 'Ils nous ont fait confiance',
    trustTitle: 'Service soigné',
    faqTitle: 'Questions',
    closingCta: 'Écrivez-nous — nous vous guidons',
  };
}

export function productCopy(locale: StoreLocale, isMabkhara: boolean) {
  if (locale === 'ar') {
    return {
      buyLabel: 'اطلب الآن',
      giftNote: isMabkhara ? 'تغليف هدية · مناسب للعيد والزيارات' : undefined,
      reviewsTitle: 'آراء من المغرب',
    };
  }
  return {
    buyLabel: 'Commander maintenant',
    giftNote: isMabkhara ? 'Emballage cadeau disponible' : undefined,
    reviewsTitle: 'Avis clients',
  };
}
