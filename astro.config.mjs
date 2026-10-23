// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { locales, defaultLocale } from './src/i18n/locales.js';

// Adresse publique du site. Par défaut GitHub Pages, dans le sous-dossier du dépôt.
// Avec un nom de domaine : SITE_URL=https://exemple.com et BASE_PATH=/ (voir deploy.yml).
const site = process.env.SITE_URL || 'https://theopothier-dev.github.io';
const base = process.env.BASE_PATH || '/WOR-Guide';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  i18n: {
    locales,
    defaultLocale,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // La racine ne fait que rediriger vers une langue : seules les pages traduites vont dans le plan du site.
      filter: (page) => new URL(page).pathname.replace(base.replace(/\/$/, ''), '') !== '/',
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
  ],
});
