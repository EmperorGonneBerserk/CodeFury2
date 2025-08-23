import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";

// Import your translations
import en from "./translate.json";
import kn from "./translate.kn.json";

// Detect device language
const locales = RNLocalize.getLocales();
const deviceLanguage = locales.length > 0 ? locales[0].languageCode : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    kn: { translation: kn }
  },
  lng: deviceLanguage, // start with device language
  fallbackLng: "en",   // fallback to English
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
