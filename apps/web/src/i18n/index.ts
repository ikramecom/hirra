import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './ar.json';
import fr from './fr.json';
import { westernDigitsPostProcessor } from './westernDigitsPostProcessor';

const STORAGE_KEY = 'riyanaluxe:locale';

const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLocale = stored === 'fr' ? 'fr' : 'ar';

i18n.use(westernDigitsPostProcessor).use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: initialLocale,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
  postProcess: ['westernDigits'],
});

function applyDir(lng: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
}

applyDir(initialLocale);

i18n.on('languageChanged', (lng) => {
  applyDir(lng);
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;

export type StoreLocale = 'ar' | 'fr';

export function useStoreLocale(): StoreLocale {
  return (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
}
