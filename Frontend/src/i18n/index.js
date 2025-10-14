import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { modularResources, availableLanguages } from './locales';



const defaultLng = 'en'; 
const fallbackLng = 'en';

i18next.use(initReactI18next).init({
  resources: modularResources,
  lng: defaultLng,
  fallbackLng,
  supportedLngs: availableLanguages,
  interpolation: { escapeValue: false },
  returnNull: false
});

export default i18next;