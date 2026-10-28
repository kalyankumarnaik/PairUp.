
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';

export const Locales = { en, hi, te, ta, kn, mr, bn } as const;
export type SupportedLanguage = keyof typeof Locales;
export function getTranslations(lang: SupportedLanguage = 'en') {
  return Locales[lang] || Locales.en;
}
