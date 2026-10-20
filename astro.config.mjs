// @ts-check
import { defineConfig } from 'astro/config';
import { locales, defaultLocale } from './src/i18n/locales.js';

export default defineConfig({
  // Hébergé sur GitHub Pages, dans le sous-dossier du dépôt.
  site: 'https://theopothier-dev.github.io',
  base: '/WOR-Guide',
  i18n: {
    locales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
