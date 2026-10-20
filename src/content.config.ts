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
  // Identifiant du set ou de l'artefact (sets.json / artifacts.json), pour l'image et le nom traduit.
  id: z.string().optional(),
  // Nombre de pièces portées, pour un set.
  pieces: z.number().int().optional(),
  // Pourcentage d'utilisation relevé sur le site officiel, si connu.
  usage: z.number().min(0).max(100).optional(),
});

const build = z.object({
  label: localized,
  // community : relevé dans les guides en ligne ; ai : conçu à partir des compétences et des bonus du jeu.
  origin: z.enum(['community', 'ai']).default('community'),
  role: localized.optional(),
  // Fiabilité de la source : high, medium ou low.
  confidence: z.enum(['high', 'medium', 'low']).optional(),
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

const sets = defineCollection({
  loader: file('src/data/sets.json'),
  schema: z.object({
    gameId: z.number().int(),
    name: localized,
    bonuses: z.array(z.object({ pieces: z.number().int(), description: localized })),
  }),
});

const heroClass = z.enum(['fighter', 'mage', 'marksman', 'defender', 'healer', 'tactician']);

const artifacts = defineCollection({
  loader: file('src/data/artifacts.json'),
  schema: z.object({
    gameId: z.number().int(),
    name: localized,
    rank: z.number().int(),
    description: localized.optional(),
    // Artefact réservé à un héros (identifiant du jeu) ou à une classe.
    heroGameId: z.number().int().optional(),
    class: heroClass.optional(),
  }),
});

const heroes = defineCollection({
  loader: file('src/data/heroes.json'),
  schema: z.object({
    gameId: z.number().int().optional(),
    name: localized,
    title: localized.optional(),
    class: heroClass,
    rarity: z.enum(['legendary', 'epic', 'rare', 'elite', 'common']).optional(),
    factions: z.array(reference('factions')).default([]),
    damageType: z.enum(['physical', 'magic']).optional(),
    // Compétences au niveau maximum, textes du jeu avec les valeurs déjà calculées.
    skills: z
      .array(
        z.object({
          kind: z.enum(['talent', 'basic', 'ultimate', 'skill', 'passive', 'bond']),
          name: localized.partial({ en: true }),
          description: localized,
          cooldown: z.number().optional(),
        }),
      )
      .default([]),
    awakenings: z.array(z.object({ level: z.number().int(), description: localized, stat: z.boolean().optional() })).default([]),
    exclusiveArtifact: reference('artifacts').optional(),
    // Stats du jeu (PV, ATQ, DÉF, Rés. M.) : par étoile, valeurs au premier et au dernier niveau ;
    // par promotion (0 à 6), bonus ajouté ; plus les stats fixes.
    stats: z
      .object({
        stars: z.array(
          z.object({
            star: z.number().int(),
            levelFrom: z.number().int(),
            levelTo: z.number().int(),
            base: z.array(z.number()).length(4),
            top: z.array(z.number()).length(4),
          }),
        ),
        promotions: z.array(z.array(z.number()).length(4)),
        fixed: z.record(z.string(), z.number()),
      })
      .optional(),
    // true tant que les données n'ont pas été vérifiées dans le jeu.
    example: z.boolean().default(false),
    builds: perServer(z.array(build)).default({}),
    tiers: perServer(z.record(z.enum(modeIds), z.enum(tiers))).default({}),
  }),
});

export const collections = { factions, modes, sets, artifacts, heroes };
export { servers, tiers };
