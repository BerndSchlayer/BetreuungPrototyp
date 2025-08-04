
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
import deDateInput from './locales/deDateInput.json';
import enDateInput from './locales/enDateInput.json';
import frDateInput from './locales/frDateInput.json';

import esDateInput from './locales/esDateInput.json';
import itDateInput from './locales/itDateInput.json';
import ruDateInput from './locales/ruDateInput.json';
import trDateInput from './locales/trDateInput.json';
import arDateInput from './locales/arDateInput.json';
import elDateInput from './locales/elDateInput.json';
import ukDateInput from './locales/ukDateInput.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de, dateInput: deDateInput },
      en: { translation: en, dateInput: enDateInput },
      fr: { translation: fr, dateInput: frDateInput },
      uk: { translation: uk, dateInput: ukDateInput },
      ar: { translation: ar, dateInput: arDateInput },
      el: { translation: el, dateInput: elDateInput },
      es: { translation: es, dateInput: esDateInput },
      it: { translation: it, dateInput: itDateInput },
      ru: { translation: ru, dateInput: ruDateInput },
      tr: { translation: tr, dateInput: trDateInput },
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
