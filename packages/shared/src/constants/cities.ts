export interface SaudiCity {
  value: string; // English slug
  label_ar: string;
  label_en: string;
  zone: 1 | 2 | 3 | 4;
}

export const SAUDI_CITIES: SaudiCity[] = [
  // Zone 1
  { value: 'riyadh', label_ar: 'الرياض', label_en: 'Riyadh', zone: 1 },

  // Zone 2
  { value: 'jeddah', label_ar: 'جدة', label_en: 'Jeddah', zone: 2 },
  { value: 'dammam', label_ar: 'الدمام', label_en: 'Dammam', zone: 2 },
  { value: 'khobar', label_ar: 'الخبر', label_en: 'Khobar', zone: 2 },
  { value: 'dhahran', label_ar: 'الظهران', label_en: 'Dhahran', zone: 2 },

  // Zone 3
  { value: 'mecca', label_ar: 'مكة المكرمة', label_en: 'Mecca', zone: 3 },
  { value: 'medina', label_ar: 'المدينة المنورة', label_en: 'Medina', zone: 3 },
  { value: 'taif', label_ar: 'الطائف', label_en: 'Taif', zone: 3 },

  // Zone 4
  { value: 'tabuk', label_ar: 'تبوك', label_en: 'Tabuk', zone: 4 },
  { value: 'abha', label_ar: 'أبها', label_en: 'Abha', zone: 4 },
  { value: 'khamis-mushait', label_ar: 'خميس مشيط', label_en: 'Khamis Mushait', zone: 4 },
  { value: 'hail', label_ar: 'حائل', label_en: 'Hail', zone: 4 },
  { value: 'buraidah', label_ar: 'بريدة', label_en: 'Buraidah', zone: 4 },
  { value: 'unaizah', label_ar: 'عنيزة', label_en: 'Unaizah', zone: 4 },
  { value: 'al-ahsa', label_ar: 'الأحساء', label_en: 'Al-Ahsa', zone: 4 },
  { value: 'jubail', label_ar: 'الجبيل', label_en: 'Jubail', zone: 4 },
  { value: 'qatif', label_ar: 'القطيف', label_en: 'Qatif', zone: 4 },
  { value: 'najran', label_ar: 'نجران', label_en: 'Najran', zone: 4 },
  { value: 'jazan', label_ar: 'جازان', label_en: 'Jazan', zone: 4 },
  { value: 'yanbu', label_ar: 'ينبع', label_en: 'Yanbu', zone: 4 },
  { value: 'arar', label_ar: 'عرعر', label_en: 'Arar', zone: 4 },
  { value: 'sakaka', label_ar: 'سكاكا', label_en: 'Sakaka', zone: 4 },
  { value: 'qassim', label_ar: 'القصيم', label_en: 'Qassim', zone: 4 },
];

// Common Riyadh districts (autocomplete suggestions)
export const RIYADH_DISTRICTS = [
  'العليا',
  'حطين',
  'النخيل',
  'الملقا',
  'الياسمين',
  'الورود',
  'الربيع',
  'الياسمين',
  'العقيق',
  'النرجس',
  'الرحمانية',
  'الصحافة',
  'الغدير',
  'الازدهار',
  'المعذر',
  'السليمانية',
  'الملز',
  'النسيم',
  'العزيزية',
  'الشفا',
];

// Common Jeddah districts
export const JEDDAH_DISTRICTS = [
  'الروضة',
  'الشاطئ',
  'الزهراء',
  'الصفا',
  'النعيم',
  'البساتين',
  'الرحاب',
  'النزهة',
  'المروة',
  'الحمراء',
];

export function getCityByValue(value: string): SaudiCity | undefined {
  return SAUDI_CITIES.find((c) => c.value === value);
}

export function getCityLabel(value: string, locale: 'ar' | 'en'): string {
  const city = getCityByValue(value);
  if (!city) return value;
  return locale === 'ar' ? city.label_ar : city.label_en;
}
