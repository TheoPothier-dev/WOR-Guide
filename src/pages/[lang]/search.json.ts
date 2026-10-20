import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { localize, type Locale } from '../../i18n/ui';
import { asset, heroHead, href, langPaths } from '../../lib/i18n-paths';

export const getStaticPaths = langPaths;

// Index de la recherche globale, une liste compacte par langue : [type, nom, lien, image, texte en plus].
export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Locale;
  const heroes = await getCollection('heroes');
  const sets = await getCollection('sets');
  const artifacts = await getCollection('artifacts');
  const icon = (path: string) => (existsSync(`public/${path}`) ? asset(path) : '');
  const items = [
    ...heroes.map((h) => ['h', localize(h.data.name, lang), href(lang, `heroes/${h.id}/`), heroHead(h.data.gameId) ?? '', h.data.title ? localize(h.data.title, lang) : '']),
    ...sets.map((s) => ['s', localize(s.data.name, lang), href(lang, `sets/`) + `#${s.id}`, icon(`sets/${s.data.gameId}_0.webp`), '']),
    ...artifacts.map((a) => ['a', localize(a.data.name, lang), href(lang, `artifacts/`) + `#${a.id}`, icon(`artifacts/${a.data.gameId}.webp`), '']),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};
