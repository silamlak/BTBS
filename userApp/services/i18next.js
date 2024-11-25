import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import en from '../locals/en.json'
import am from '../locals/am.json'

const resources = {
  en: { translation: en },
  am: { translation: am },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  debug: true,
  resources,
});

export default i18next