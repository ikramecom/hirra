export interface MaghrebCity {
  value: string;
  label_ar: string;
  label_fr: string;
  label_en: string;
  zone: 1 | 2 | 3 | 4;
  country: 'MA' | 'DZ' | 'TN';
}

/** Morocco-first COD zones; Algeria & Tunisia use zone 3–4 shipping. */
export const MAGHREB_CITIES: MaghrebCity[] = [
  { value: 'casablanca', label_ar: 'الدار البيضاء', label_fr: 'Casablanca', label_en: 'Casablanca', zone: 1, country: 'MA' },
  { value: 'rabat', label_ar: 'الرباط', label_fr: 'Rabat', label_en: 'Rabat', zone: 1, country: 'MA' },
  { value: 'marrakech', label_ar: 'مراكش', label_fr: 'Marrakech', label_en: 'Marrakech', zone: 1, country: 'MA' },
  { value: 'tangier', label_ar: 'طنجة', label_fr: 'Tanger', label_en: 'Tangier', zone: 2, country: 'MA' },
  { value: 'fes', label_ar: 'فاس', label_fr: 'Fès', label_en: 'Fes', zone: 2, country: 'MA' },
  { value: 'agadir', label_ar: 'أكادير', label_fr: 'Agadir', label_en: 'Agadir', zone: 2, country: 'MA' },
  { value: 'meknes', label_ar: 'مكناس', label_fr: 'Meknès', label_en: 'Meknes', zone: 2, country: 'MA' },
  { value: 'oujda', label_ar: 'وجدة', label_fr: 'Oujda', label_en: 'Oujda', zone: 3, country: 'MA' },
  { value: 'kenitra', label_ar: 'القنيطرة', label_fr: 'Kénitra', label_en: 'Kenitra', zone: 2, country: 'MA' },
  { value: 'tetouan', label_ar: 'تطوان', label_fr: 'Tétouan', label_en: 'Tetouan', zone: 3, country: 'MA' },
  { value: 'algiers', label_ar: 'الجزائر', label_fr: 'Alger', label_en: 'Algiers', zone: 3, country: 'DZ' },
  { value: 'oran', label_ar: 'وهران', label_fr: 'Oran', label_en: 'Oran', zone: 3, country: 'DZ' },
  { value: 'constantine', label_ar: 'قسنطينة', label_fr: 'Constantine', label_en: 'Constantine', zone: 4, country: 'DZ' },
  { value: 'tunis', label_ar: 'تونس', label_fr: 'Tunis', label_en: 'Tunis', zone: 3, country: 'TN' },
  { value: 'sfax', label_ar: 'صفاقس', label_fr: 'Sfax', label_en: 'Sfax', zone: 4, country: 'TN' },
];

/** @deprecated Use MAGHREB_CITIES — kept for imports during migration */
export const SAUDI_CITIES = MAGHREB_CITIES;

export type SaudiCity = MaghrebCity;

export function getCityByValue(value: string): MaghrebCity | undefined {
  return MAGHREB_CITIES.find((c) => c.value === value);
}

/** Match free-text city input to a known zone (optional — unknown cities use default zone). */
export function getCityByFuzzyInput(input: string): MaghrebCity | undefined {
  const raw = input.trim();
  if (!raw) return undefined;

  const byValue = getCityByValue(raw.toLowerCase());
  if (byValue) return byValue;

  const norm = raw.toLowerCase();
  return MAGHREB_CITIES.find((c) => {
    const ar = c.label_ar.trim();
    const fr = c.label_fr.toLowerCase();
    const en = c.label_en.toLowerCase();
    return (
      ar === raw ||
      ar.includes(raw) ||
      raw.includes(ar) ||
      fr === norm ||
      fr.includes(norm) ||
      norm.includes(fr) ||
      en === norm ||
      en.includes(norm)
    );
  });
}

export function getCityLabel(value: string, locale: 'ar' | 'fr' | 'en'): string {
  const city = getCityByValue(value);
  if (!city) return value;
  if (locale === 'ar') return city.label_ar;
  if (locale === 'fr') return city.label_fr;
  return city.label_en;
}
