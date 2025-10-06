import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { modularResources, availableLanguages } from './locales';

// NOTE: Legacy resource.js still exists; prefer modularResources moving forward.
// You can safely remove resource.js once all imports are updated.

const fallbackLng = 'en';

i18next.use(initReactI18next).init({
  resources: modularResources,
  lng: fallbackLng,
  fallbackLng,
  supportedLngs: availableLanguages,
  interpolation: { escapeValue: false },
  returnNull: false
});

export default i18next;