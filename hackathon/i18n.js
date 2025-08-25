import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization"; // ✅ use expo-localization

// Import your translations
import en from "./translate.json";
import kn from "./translate.kn.json";

// Detect device language (expo-localization gives you full locale string like "en-US")
const deviceLanguage = Localization.locale?.split("-")[0] ?? "en";

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
