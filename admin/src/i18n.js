import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./langs/en"
import fa from "./langs/fa"
export const resources = {
    en: {
        translation: en,
        direction: "ltr"
    },
    fa: {
        translation: fa,
        direction: "rtl"
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;