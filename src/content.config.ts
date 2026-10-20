import { defineCollection, reference, z } from 'astro:content';
import { file } from 'astro/loaders';
import modesData from './data/modes.json';

// Texte traduit : l'anglais est obligatoire, les autres langues retombent dessus.
const localized = z.object({
  en: z.string(),
  fr: z.string().optional(),
  de: z.string().optional(),
  es: z.string().optional(),
  it: z.string().optional(),
  pt: z.string().optional(),
  pl: z.string().optional(),
  ru: z.string().optional(),
});

const servers = ['global', 'europe'] as const;
const tiers = ['S+', 'S', 'A', 'B', 'C', 'D'] as const;
// Les clés des notes doivent être des identifiants de modes.json.
const modeIds = modesData.map((m) => m.id) as [string, ...string[]];

const usageItem = z.object({
  name: z.string(),
  // Pourcentage d'utilisation relevé sur le site officiel, si connu.
  usage: z.number().min(0).max(100).optional(),
});

const build = z.object({
  label: localized,
  // D'où vient le build (URL ou description), pour pouvoir le revérifier.
  source: z.string().optional(),
  sets: z.array(usageItem),
  artifacts: z.array(usageItem).default([]),
  notes: localized.optional(),
});

const perServer = <T extends z.ZodTypeAny>(schema: T) =>
  z.object(Object.fromEntries(servers.map((s) => [s, schema.optional()])) as Record<(typeof servers)[number], z.ZodOptional<T>>);

const factions = defineCollection({
  loader: file('src/data/factions.json'),
  schema: z.object({
    // Identifiant interne du jeu, pour relier les données extraites.
    gameId: z.number().int().optional(),
    name: localized,
  }),
});

const modes = defineCollection({
  loader: file('src/data/modes.json'),
  schema: z.object({
    name: localized,
    category: z.enum(['pve', 'pvp', 'guild']),
  }),
});

const heroes = defineCollection({
  loader: file('src/data/heroes.json'),
  schema: z.object({
    gameId: z.number().int().optional(),
    name: localized,
    title: localized.optional(),
    class: z.enum(['fighter', 'mage', 'marksman', 'defender', 'healer', 'tactician']),
    rarity: z.enum(['legendary', 'epic', 'rare']).optional(),
    factions: z.array(reference('factions')).default([]),
    damageType: z.enum(['physical', 'magic']).optional(),
    // true tant que les données n'ont pas été vérifiées dans le jeu.
    example: z.boolean().default(false),
    builds: perServer(z.array(build)).default({}),
    tiers: perServer(z.record(z.enum(modeIds), z.enum(tiers))).default({}),
  }),
});

export const collections = { factions, modes, heroes };
export { servers, tiers };
