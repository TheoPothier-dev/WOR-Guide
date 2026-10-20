// @ts-check
import { defineConfig } from 'astro/config';
import { locales, defaultLocale } from './src/i18n/locales.js';

export default defineConfig({
  // À remplacer par le vrai domaine une fois choisi.
  site: 'https://example.com',
  i18n: {
    locales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
