import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './ar.json';
import en from './en.json';

const STORAGE_KEY = 'hirra:locale';

const storedLocale = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLocale = (storedLocale === 'en' ? 'en' : 'ar') as 'ar' | 'en';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: initialLocale,
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

// Set <html> dir + lang to match initial locale
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale;
  document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
}

// Listen for changes and update <html>
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
