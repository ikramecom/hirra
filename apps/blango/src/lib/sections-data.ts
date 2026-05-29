import type { LucideIcon } from 'lucide-react';
import {
  Headphones,
  Layers,
  Lock,
  Megaphone,
  MessageCircle,
  Palette,
  Rocket,
  ScanSearch,
  SlidersHorizontal,
  Smartphone,
  Zap,
} from 'lucide-react';

export const WHY_BLANGO = {
  eyebrow: 'WHY BLANGO STUDIO?',
  title: 'لماذا Blango Studio؟',
  items: [
    { label: 'تصميم مخصص لكل مشروع', icon: Palette },
    { label: 'دعم بعد التسليم', icon: Headphones },
    { label: 'مواقع سريعة ومتوافقة مع الهاتف', icon: Smartphone },
    { label: 'جاهزة للإعلانات', icon: Megaphone },
    { label: 'تحكم كامل في موقعك', icon: SlidersHorizontal },
    { label: 'حلول قابلة للتطوير', icon: Layers },
  ] satisfies ReadonlyArray<{ label: string; icon: LucideIcon }>,
} as const;

export const BONUSES = {
  eyebrow: 'BONUSES',
  title: 'مزايا إضافية',
  items: [
    { label: 'استشارة مجانية للمشروع', icon: MessageCircle },
    { label: 'مراجعة مجانية للموقع الحالي', icon: ScanSearch },
    { label: 'تحسين الأداء الأساسي', icon: Zap },
    { label: 'إعدادات أمان أساسية', icon: Lock },
    { label: 'مساعدة عند إطلاق الموقع', icon: Rocket },
  ] satisfies ReadonlyArray<{ label: string; icon: LucideIcon }>,
} as const;

export const HOW_WE_WORK = {
  eyebrow: 'HOW WE WORK',
  title: 'كيف نعمل؟',
  steps: [
    'نفهم مشروعك واحتياجاتك',
    'نصمم الواجهة المناسبة',
    'نربط الأدوات اللازمة',
    'نختبر الموقع بالكامل',
    'نسلم المشروع جاهزاً للعمل',
  ],
} as const;

export const COMPARISON = {
  eyebrow: 'COMPARISON',
  title: 'لماذا موقع خاص أفضل من الحلول الجاهزة؟',
  items: [
    'تحكم كامل',
    'مرونة أكبر',
    'أداء أفضل',
    'قابل للتطوير',
    'ملكية كاملة للبيانات',
    'تجربة مخصصة للمشروع',
  ],
} as const;

export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  title: 'أعمال مختارة',
  subtitle: 'حلول رقمية مصممة بعناية — من صفحة الهبوط إلى المشاريع المخصصة.',
  projects: [
    {
      id: 'landing',
      category: 'Landing Pages',
      tag: 'صفحات بيع',
      accent: 'from-gold/20 via-gold/5 to-transparent',
    },
    {
      id: 'websites',
      category: 'Websites',
      tag: 'مواقع كاملة',
      accent: 'from-white/10 via-white/[0.03] to-transparent',
    },
    {
      id: 'custom',
      category: 'Custom Projects',
      tag: 'مشاريع مخصصة',
      accent: 'from-gold/15 via-ink to-transparent',
    },
  ],
} as const;

export const TESTIMONIALS = {
  eyebrow: 'TESTIMONIALS',
  title: 'ماذا يقول عملاؤنا',
  subtitle: 'ثقة مبنية على نتائج حقيقية وتجربة احترافية.',
  items: [
    {
      quote:
        'تجربة احترافية من البداية للنهاية. الموقع جاهز للإعلانات خلال أيام، والتصميم يعكس هوية مشروعي بدقة.',
      name: 'سارة م.',
      role: 'مؤسسة — مشروع عطور',
    },
    {
      quote:
        'أفضل استثمار لمشروعي. سرعة في التسليم، جودة في التصميم، ودعم ممتاز بعد الإطلاق.',
      name: 'يوسف ك.',
      role: 'صاحب متجر إلكتروني',
    },
    {
      quote:
        'تحكم كامل في موقعي بدون قيود. البنية نظيفة وقابلة للتطوير — بالضبط ما كنت أبحث عنه.',
      name: 'نادية ر.',
      role: 'مستشارة أعمال',
    },
  ],
} as const;

export const FAQ_SECTION = {
  eyebrow: 'FAQ',
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

export const GUARANTEE = {
  eyebrow: 'GUARANTEE',
  title: 'ضمان Blango Studio',
  label: 'ضمان التعديلات حتى الرضا',
  description:
    'نلتزم بجودة التسليم. نعدّل حتى تحصل على موقع يرضيك — بدون تعقيد، وبدون مفاجآت.',
} as const;

export const FINAL_CTA = {
  title: 'جاهز للانطلاق؟',
  text: 'احصل على موقع احترافي يساعد مشروعك على النمو.',
  button: 'اطلب استشارة مجانية',
} as const;
