import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enTranslations from '../public/locales/en/common.json'
import hiTranslations from '../public/locales/hi/common.json'

const resources = {
  en: {
    common: enTranslations,
  },
  hi: {
    common: hiTranslations,
  },
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en', // default language
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false, // React already does escaping
      },
      
      react: {
        useSuspense: false,
      },
    })
}

export default i18n
