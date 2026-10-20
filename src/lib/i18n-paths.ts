import { locales } from '../i18n/locales.js';
import type { Locale } from '../i18n/ui';

export function langPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

// Préfixe du site (sous-dossier sur GitHub Pages), sans barre finale.
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(lang: Locale, path = '') {
  return `${base}/${lang}/${path}`.replace(/\/+$/, '/');
}

// Même page dans une autre langue.
export function switchLang(pathname: string, lang: Locale) {
  return base + pathname.slice(base.length).replace(/^\/[a-z]{2}(?=\/|$)/, `/${lang}`);
}

// Fichier du dossier public/, avec le préfixe du site.
export function asset(path: string) {
  return `${base}/${path}`;
}

export const heroHead = (gameId?: number) => (gameId ? asset(`heroes/head/${gameId}.webp`) : undefined);
export const heroBust = (gameId?: number) => (gameId ? asset(`heroes/bust/${gameId}.webp`) : undefined);
