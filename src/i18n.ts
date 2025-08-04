
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import uk from './locales/uk.json';
import ar from './locales/ar.json';
import el from './locales/el.json';
import es from './locales/es.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      fr: { translation: fr },
      uk: { translation: uk },
      ar: { translation: ar },
      el: { translation: el },
      es: { translation: es },
      it: { translation: it },
      ru: { translation: ru },
      tr: { translation: tr },
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
