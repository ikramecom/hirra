import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  Banknote,
  BarChart3,
  Building2,
  Globe,
  Headphones,
  Layers,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  Palette,
  SlidersHorizontal,
  Smartphone,
  Wallet,
  Zap,
} from 'lucide-react';

export const HERO = {
  eyebrow: 'BLANGO STUDIO',
  title: 'حضور رقمي يعكس قيمة مشروعك',
  subtitle:
    'نصنع مواقع وصفحات بيع فاخرة — سريعة، متجاوبة، وجاهزة لتحقيق النتائج منذ اليوم الأول.',
  ctaPrimary: 'اطلب استشارة مجانية',
  ctaSecondary: 'عرض الباقات',
  trust: [
    'تسليم سريع',
    'متوافق مع الهاتف',
    'جاهز للإعلانات',
    'ملكية كاملة',
  ],
} as const;

export const SERVICE_ITEMS = [
  {
    id: 'landing',
    title: 'صفحات الهبوط',
    description:
      'صفحات بيع مصممة لتحويل الزوار إلى عملاء. بنية واضحة، رسائل مقنعة، وتجربة مستخدم تدفع للعمل.',
    icon: LayoutTemplate,
  },
  {
    id: 'website',
    title: 'تصميم المواقع',
    description:
      'مواقع احترافية تعكس هوية مشروعك بأناقة. تصميم مخصص، متجاوب بالكامل، وجاهز للتوسع.',
    icon: Globe,
  },
  {
    id: 'whatsapp',
    title: 'ربط واتساب',
    description:
      'تواصل مباشر مع عملائك عبر واتساب. زر عائم، رسائل جاهزة، وتجربة سلسة على الهاتف.',
    icon: MessageCircle,
  },
  {
    id: 'ads',
    title: 'إعداد الإعلانات',
    description:
      'Facebook Pixel، Google Analytics، وتتبع متقدم. موقعك جاهز لقياس النتائج منذ الإطلاق.',
    icon: BarChart3,
  },
  {
    id: 'performance',
    title: 'تحسين الأداء',
    description:
      'سرعة تحميل عالية وSEO أساسي. موقعك يعمل بسلاسة ويظهر بشكل احترافي على جميع الأجهزة.',
    icon: Zap,
  },
  {
    id: 'consultation',
    title: 'استشارة رقمية',
    description:
      'تحليل مشروعك وخطة واضحة قبل البدء. نفهم أهدافك ونقترح الحل الأنسب — بدون التزام.',
    icon: Megaphone,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}>;

export const FEATURED_SERVICE_IDS = ['landing', 'website', 'whatsapp', 'ads'] as const;

export const SERVICES = {
  eyebrow: 'خدماتنا',
  title: 'حلول رقمية متكاملة',
  subtitle: 'من الفكرة إلى الإطلاق — كل ما يحتاجه مشروعك للنجاح على الإنترنت.',
  previewTitle: 'خدماتنا الأساسية',
  previewSubtitle: 'أهم ما يحتاجه مشروعك للانطلاق بسرعة — باقي الخدمات على صفحة الخدمات.',
  viewAll: 'عرض كل الخدمات',
  items: SERVICE_ITEMS,
  featuredIds: FEATURED_SERVICE_IDS,
} as const;

export const WHY_BLANGO = {
  eyebrow: 'لماذا نحن',
  title: 'لماذا Blango Studio؟',
  items: [
    {
      label: 'تصميم مخصص لكل مشروع',
      description: 'لا نعتمد على قوالب جاهزة. كل تصميم يُبنى حسب هدف مشروعك وهويتك.',
      icon: Palette,
    },
    {
      label: 'دعم بعد التسليم',
      description: 'نبقى معك بعد الإطلاق. دعم حقيقي حتى يعمل موقعك بثقة واستقرار.',
      icon: Headphones,
    },
    {
      label: 'مواقع سريعة ومتوافقة مع الهاتف',
      description: 'أداء عالٍ وتجربة مثالية على الهاتف — حيث يأتي أغلب زوارك.',
      icon: Smartphone,
    },
    {
      label: 'جاهزة للإعلانات',
      description: 'Pixel وAnalytics وتتبع جاهز. أطلق حملاتك دون أي تأخير تقني.',
      icon: Megaphone,
    },
    {
      label: 'تحكم كامل في موقعك',
      description: 'الموقع ملكك بالكامل. بدون قيود، بدون اشتراكات مخفية.',
      icon: SlidersHorizontal,
    },
    {
      label: 'حلول قابلة للتطوير',
      description: 'بنية نظيفة ومرنة. أضف صفحات وميزات جديدة متى شئت.',
      icon: Layers,
    },
  ] satisfies ReadonlyArray<{ label: string; description: string; icon: LucideIcon }>,
} as const;

export const HOW_WE_WORK = {
  eyebrow: 'آلية العمل',
  title: 'كيف نعمل؟',
  subtitle: 'عملية واضحة من البداية إلى التسليم — بدون تعقيد.',
  steps: [
    {
      title: 'نفهم مشروعك واحتياجاتك',
      description: 'جلسة استكشاف لفهم أهدافك، جمهورك، وما يميز مشروعك.',
    },
    {
      title: 'نصمم الواجهة المناسبة',
      description: 'تصميم مخصص يعكس هوية مشروعك ويوجه الزائر نحو الإجراء.',
    },
    {
      title: 'نربط الأدوات اللازمة',
      description: 'واتساب، Pixel، Analytics، والاستضافة — كل شيء مُعدّ باحتراف.',
    },
    {
      title: 'نختبر الموقع بالكامل',
      description: 'اختبار شامل على الهاتف والحاسوب قبل الإطلاق.',
    },
    {
      title: 'نسلم المشروع جاهزاً للعمل',
      description: 'تسليم كامل مع دعم واضح — موقعك جاهز للنمو.',
    },
  ],
} as const;

export type PortfolioTheme = 'perfume' | 'fashion' | 'cosmetics';

export const PORTFOLIO_PREVIEW = {
  eyebrow: 'أعمالنا',
  title: 'مشاريع مختارة',
  subtitle: 'نتائج حقيقية لعلامات تجارية — جودة تتحدث عن نفسها.',
  viewAll: 'عرض كل المشاريع',
  featuredCount: 3,
} as const;

export const PORTFOLIO = {
  eyebrow: 'أعمالنا',
  title: 'معرض الأعمال',
  subtitle: 'نتائج حقيقية لعلامات تجارية حقيقية — تصميم فاخر يبني الثقة فوراً.',
  projects: [
    {
      id: 'perfume',
      theme: 'perfume' as PortfolioTheme,
      nameAr: 'علامة عطور فاخرة',
      industry: 'عطور وفاخرة',
      goal: 'رفع طلبات واتساب وزيادة مبيعات التجزئة',
      result: '+340% طلبات واتساب في 30 يوم',
    },
    {
      id: 'cosmetics',
      theme: 'cosmetics' as PortfolioTheme,
      nameAr: 'علامة مستحضرات تجميل فاخرة',
      industry: 'تجميل وعناية',
      goal: 'إطلاق حملات Meta بصفحة بيع محسّنة',
      result: 'ROAS 4.2x من الإعلانات',
    },
    {
      id: 'fashion',
      theme: 'fashion' as PortfolioTheme,
      nameAr: 'علامة أزياء فاخرة',
      industry: 'أزياء وفاخرة',
      goal: 'إطلاق متجر إلكتروني يعكس فخامة المجموعة',
      result: '+280% مبيعات أونلاين في 60 يوم',
    },
  ],
} as const;

export const BEFORE_AFTER = {
  eyebrow: 'المقارنة',
  title: 'الفرق بين موقع عادي وموقع احترافي',
  subtitle: 'الموقع ليس مجرد واجهة — هو أداة بيع وتسويق.',
  before: {
    label: 'موقع عادي',
    items: ['تصميم قديم', 'بطء في التحميل', 'تحويل ضعيف', 'تجربة سيئة'],
  },
  after: {
    label: 'موقع Blango Studio',
    items: ['تصميم احترافي', 'سرعة عالية', 'جاهز للإعلانات', 'معدل تحويل أفضل'],
  },
} as const;

export const WHATSAPP = {
  url: 'https://wa.me/212649498336',
  number: '+212 649 498 336',
  label: 'واتساب',
  hint: 'رد سريع',
} as const;

export const INSTAGRAM = {
  url: 'https://www.instagram.com/blangostudio/',
  handle: '@blangostudio',
  label: 'إنستغرام',
} as const;

export const FACEBOOK = {
  url: 'https://www.facebook.com/blangostudio',
  handle: 'Blango Studio',
  label: 'فيسبوك',
} as const;

export const EMAIL = {
  address: 'contact@blangostudio.com',
  href: 'mailto:contact@blangostudio.com',
  label: 'البريد الإلكتروني',
} as const;

export const PAYMENT_METHODS = {
  title: 'طرق الدفع المتاحة',
  trustMessage: 'يتم إرسال معلومات الدفع بعد الاتفاق على تفاصيل المشروع.',
  methods: [
    { key: 'bank-transfer' as const, title: 'تحويل بنكي', titleEn: 'Bank Transfer', icon: ArrowLeftRight },
    { key: 'cih' as const, title: 'بنك CIH', titleEn: 'CIH Bank', icon: Building2 },
    { key: 'paypal' as const, title: 'PayPal', titleEn: 'PayPal', icon: Wallet },
    { key: 'cash' as const, title: 'إيداع نقدي', titleEn: 'Cash Deposit', icon: Banknote },
  ],
} as const;

export const CONTACT_SECTION = {
  eyebrow: 'تواصل معنا',
  title: 'لنبدأ مشروعك',
  subtitle: 'اختر الطريقة الأنسب للتواصل — نرد بسرعة ونحدد الخطوة التالية.',
  cta: 'اطلب استشارة مجانية',
  ctaHref: WHATSAPP.url,
  channels: [
    { key: 'whatsapp' as const, label: WHATSAPP.label, href: WHATSAPP.url, hint: WHATSAPP.number, primary: true },
    { key: 'instagram' as const, label: INSTAGRAM.label, href: INSTAGRAM.url, hint: INSTAGRAM.handle, primary: true },
    { key: 'facebook' as const, label: FACEBOOK.label, href: FACEBOOK.url, hint: FACEBOOK.handle },
    { key: 'email' as const, label: EMAIL.label, href: EMAIL.href, hint: EMAIL.address },
  ],
} as const;

export const CONTACT_FORM = {
  title: 'أرسل رسالة',
  subtitle: 'املأ النموذج وسنتواصل معك في أقرب وقت.',
  name: 'الاسم الكامل',
  phone: 'رقم الهاتف',
  email: 'البريد الإلكتروني',
  message: 'تفاصيل المشروع',
  submit: 'إرسال عبر واتساب',
  namePlaceholder: 'مثال: أحمد بنعلي',
  phonePlaceholder: '06 XX XX XX XX',
  emailPlaceholder: 'contact@blangostudio.com',
  messagePlaceholder: 'صف مشروعك، أهدافك، والموعد المطلوب…',
} as const;

export const PAGE_HEADERS = {
  services: {
    eyebrow: 'خدماتنا',
    title: 'حلول رقمية متكاملة',
    subtitle: 'من الفكرة إلى الإطلاق — كل ما يحتاجه مشروعك للنجاح على الإنترنت.',
  },
  whyUs: {
    eyebrow: 'لماذا نحن',
    title: 'لماذا Blango Studio؟',
    subtitle: 'تصميم مخصص، دعم حقيقي، وأداء جاهز للإعلانات — بدون قوالب جاهزة أو اشتراكات مخفية.',
  },
  pricing: {
    eyebrow: 'الباقات',
    title: 'باقات مصممة لنمو مشروعك',
    subtitle: 'أسعار واضحة، تسليم سريع، وقيمة حقيقية — بدون مفاجآت.',
  },
  portfolio: {
    eyebrow: 'الأعمال',
    title: 'معرض المشاريع',
    subtitle: 'استكشف مشاريعنا ونتائجنا لعلامات تجارية في قطاعات مختلفة.',
  },
  faq: {
    eyebrow: 'الأسئلة',
    title: 'الأسئلة الشائعة',
    subtitle: 'إجابات واضحة قبل أن تبدأ مشروعك.',
  },
  contact: {
    eyebrow: 'تواصل',
    title: 'لنبدأ مشروعك',
    subtitle: 'اختر الطريقة الأنسب — نرد بسرعة ونحدد الخطوة التالية.',
  },
} as const;

export const FAQ_SECTION = {
  eyebrow: 'أسئلة شائعة',
  title: 'الأسئلة الشائعة',
  subtitle: 'إجابات واضحة قبل أن تبدأ مشروعك.',
} as const;

export const FAQ_ITEMS = [
  {
    question: 'هل الدومين مشمول؟',
    answer:
      'إعداد الاستضافة مشمول في جميع الباقات. الدومين (اسم الموقع) يُشتَرى بشكل منفصل — نرشدك لاختيار الاسم المناسب ونربطه بموقعك دون أي تعقيد.',
  },
  {
    question: 'هل يمكنني استخدام دوميني الخاص؟',
    answer:
      'نعم. إذا كان لديك دومين مسبقاً، نربطه بموقعك الجديد ونضبط الإعدادات التقنية بالكامل حتى يعمل بشكل سليم.',
  },
  {
    question: 'هل أمتلك الموقع بالكامل؟',
    answer:
      'نعم. بعد التسليم، الموقع ملكك بالكامل — التصميم، المحتوى، والملفات. لا قيود ولا اشتراكات مخفية.',
  },
  {
    question: 'هل يمكن تطوير الموقع مستقبلاً؟',
    answer:
      'بالتأكيد. نبني مواقعك على بنية نظيفة وقابلة للتوسع — يمكنك إضافة صفحات، ميزات، أو ربط أدوات جديدة في أي وقت.',
  },
  {
    question: 'كم مدة التسليم؟',
    answer:
      'تتراوح مدة التسليم بين 3 و7 أيام عمل حسب الباقة وتعقيد المشروع. نحدّد موعداً واضحاً منذ البداية ونُبقيك على اطلاع في كل مرحلة.',
  },
] as const;

export const CONTACT_CTA = {
  title: 'جاهز للانطلاق؟',
  text: 'احصل على موقع احترافي يساعد مشروعك على النمو.',
  button: 'اطلب استشارة مجانية',
} as const;

export const FOOTER = {
  tagline: 'وكالة رقمية — تصميم مواقع وصفحات بيع تحقق النتائج.',
  cta: 'احجز استشارة مجانية',
  contact: [
    { key: 'whatsapp' as const, label: WHATSAPP.label, href: WHATSAPP.url, hint: WHATSAPP.number },
    { key: 'instagram' as const, label: INSTAGRAM.label, href: INSTAGRAM.url, hint: INSTAGRAM.handle },
    { key: 'facebook' as const, label: FACEBOOK.label, href: FACEBOOK.url, hint: FACEBOOK.handle },
    { key: 'email' as const, label: EMAIL.label, href: EMAIL.href, hint: EMAIL.address },
  ],
} as const;
