import { locales } from '../i18n/locales.js';
import type { Locale } from '../i18n/ui';

export function langPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

export function href(lang: Locale, path = '') {
  return `/${lang}/${path}`.replace(/\/+$/, '/');
}

// Même page dans une autre langue.
export function switchLang(pathname: string, lang: Locale) {
  return pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${lang}`);
}
