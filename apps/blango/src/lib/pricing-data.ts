export interface PricingPlan {
  id: 'starter' | 'pro' | 'business' | 'premium';
  name: string;
  price: string;
  tagline?: string;
  popular?: boolean;
  popularLabel?: string;
  features: string[];
  bonus?: string;
  cta: string;
}

export const PRICING_SECTION = {
  eyebrow: 'العروض والباقات',
  title: 'العروض والباقات',
  subtitle: 'اختر الباقة المناسبة لمشروعك وانطلق بحضور رقمي احترافي.',
} as const;

export const PRICING_LABELS = {
  included: 'يشمل:',
  bonus: 'مكافأة:',
  popular: 'الأكثر طلباً',
} as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '349 DH',
    tagline: 'مناسبة للمبتدئين والمشاريع الصغيرة.',
    features: [
      'صفحة هبوط احترافية',
      'تصميم متجاوب مع الهاتف',
      'ربط واتساب',
      'إعداد الاستضافة',
      'SEO أساسي',
      'دعم 3 أيام',
    ],
    cta: 'ابدأ الآن',
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '599 DH',
    popular: true,
    popularLabel: 'الأكثر طلباً',
    features: [
      'صفحة هبوط فاخرة',
      'تصميم مخصص',
      'ربط واتساب',
      'إعداد الاستضافة',
      'إعداد Facebook Pixel',
      'SEO أساسي',
      'كتابة محتوى احترافية',
      'دعم 7 أيام',
    ],
    bonus: '🎁 تحليل مجاني للمشروع',
    cta: 'ابدأ الآن',
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: '899 DH',
    features: [
      'صفحة هبوط فاخرة',
      'تصميم مخصص',
      'إعداد Facebook Pixel',
      'Google Analytics',
      'ربط واتساب',
      'كتابة محتوى احترافية',
      'تحسين التحويل',
      'تحسين السرعة',
      'SEO أساسي',
      'دعم 15 يوم',
    ],
    bonus: '🎁 مراجعة مجانية للحملات الإعلانية',
    cta: 'ابدأ الآن',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '1499 DH',
    features: [
      'كل ما في باقة BUSINESS',
      'أتمتة واتساب',
      'ربط API',
      'تتبع متقدم',
      'تحسين التحويل',
      'دعم أولوية 30 يوم',
      'جلسة استراتيجية',
    ],
    bonus: '🎁 خطة تحسين كاملة للمشروع',
    cta: 'ابدأ الآن',
  },
];
