import bannersData from '../data/banners.json';
import { tiers } from '../content.config';

// Bannières relevées sur les sites communautaires (dates en UTC, fin incluse).
export type Advice = 'must' | 'good' | 'team' | 'skip' | 'unrated';
export const adviceOrder: Advice[] = ['must', 'good', 'team', 'skip', 'unrated'];

type Text = { en: string; fr?: string; de?: string; es?: string; it?: string; pt?: string; pl?: string; ru?: string };
// Héros du site (identifiant), ou héros absent des fichiers du jeu extraits, décrit à la main.
export type BannerHero =
  | string
  | { id: string; note?: Text; advice?: Advice }
  | { name: string; rarity: string; class: string; advice: Advice; note?: Text };
export type Banner = {
  id: string;
  name: string;
  start: string;
  end: string;
  pools: string[];
  rate?: string;
  heroes: BannerHero[];
  source: string;
  note?: Text;
};
export const banners = bannersData as Banner[];

// Les bannières changent à la réinitialisation quotidienne, 07:00 UTC.
export const startTime = (b: Banner) => Date.parse(`${b.start}T07:00:00Z`);
export const endTime = (b: Banner) => Date.parse(`${b.end}T07:00:00Z`) + 86400000;

type Ratings = Partial<Record<string, string>>;
const value = (tier?: string) => (tier ? tiers.length - tiers.indexOf(tier as (typeof tiers)[number]) : 0);

// Conseil de tirage tiré des notes de la tier list : S+ quelque part ou S dans trois modes = priorité ;
// S en campagne ou dans un mode = bon tirage ; A en campagne = utile dans une équipe ; sinon facultatif.
export function adviceFor(ratings: Ratings = {}): Advice {
  const values = Object.values(ratings).map(value);
  if (values.length === 0) return 'unrated';
  const strong = values.filter((v) => v >= value('S')).length;
  if (Math.max(...values) >= value('S+') || strong >= 3) return 'must';
  if (strong >= 1) return 'good';
  if (value(ratings.campaign) >= value('A')) return 'team';
  return 'skip';
}

// Pour trier : conseil d'abord, puis note de campagne, puis nombre de modes notés S ou mieux.
export function score(advice: Advice, ratings: Ratings = {}) {
  const strong = Object.values(ratings).filter((t) => value(t) >= value('S')).length;
  return (adviceOrder.length - adviceOrder.indexOf(advice)) * 100 + value(ratings.campaign) * 10 + strong;
}

// Modes où le héros est le plus fort, pour justifier le conseil.
export function bestModes(ratings: Ratings = {}, max = 3) {
  return Object.entries(ratings)
    .filter(([, t]) => value(t) >= value('S'))
    .sort((a, b) => value(b[1]) - value(a[1]))
    .slice(0, max) as [string, string][];
}
