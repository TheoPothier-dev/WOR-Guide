# Guide Watcher of Realms

Site de guides statique et multilingue pour Watcher of Realms : builds par héros, tier list par classe et par mode de jeu, pour les serveurs Global et Europe.

Construit avec [Astro](https://astro.build) (v5). Aucun serveur n'est nécessaire : `npm run build` produit des pages HTML dans `dist/`, hébergeables sur GitHub Pages, Netlify, Cloudflare Pages, etc.

## Commandes

```sh
npm install
npm run dev      # site local sur http://localhost:4321
npm run build    # génère le site dans dist/
npm run check    # vérifie les types et le schéma des données
```

## Langues

8 langues : anglais (par défaut), français, allemand, espagnol, italien, portugais, polonais, russe. Chaque page existe sous `/<langue>/...`, et la racine `/` redirige vers la langue du navigateur.

- Ajouter une langue : l'ajouter dans `src/i18n/locales.js`, puis ses textes dans `src/i18n/ui.ts`.
- Les textes de l'interface sont dans `src/i18n/ui.ts`.
- Les noms venant du jeu (héros, modes, factions) sont dans les données, sous la forme `{ "en": "...", "fr": "..." }`. Une langue absente retombe sur l'anglais.

## Données

Fichiers JSON dans `src/data/`, validés au build par `src/content.config.ts` : une erreur de saisie (classe inconnue, mode inexistant, note invalide) fait échouer le build avec un message clair.

- `heroes.json` : un objet par héros. `builds` et `tiers` sont séparés par serveur (`global`, `europe`). `example: true` affiche un bandeau « données non vérifiées ».
- `modes.json` : les modes de jeu utilisés comme colonnes de la tier list.
- `factions.json` : les factions.
- `sets.json` et `artifacts.json` : sets d'équipement (bonus par nombre de pièces) et artefacts (de classe, généraux ou exclusifs à un héros).
- Dans `heroes.json`, `skills`, `awakenings` et `exclusiveArtifact` viennent du jeu ; les valeurs des compétences sont celles du niveau maximum. `stats` contient les stats de base par étoile et par promotion ; la page du héros les calcule comme le jeu (vérifié sur trois héros).
- `stat-names.json` : noms des stats dans chaque langue, tirés du jeu.

Exemple de héros :

```json
{
  "id": "corven",
  "gameId": 2354,
  "name": { "en": "Corven", "fr": "Corven" },
  "title": { "en": "...", "fr": "..." },
  "class": "marksman",
  "rarity": "legendary",
  "factions": ["the-grey-blades"],
  "damageType": "physical",
  "builds": {
    "global": [
      {
        "label": { "en": "Most used", "fr": "Le plus joué" },
        "source": "URL de la source",
        "sets": [{ "name": "Wicked Vengeance", "usage": 63.2 }],
        "artifacts": []
      }
    ]
  },
  "tiers": {
    "global": { "arena": "S", "guild-war": "A" }
  }
}
```

Notes possibles : `S+`, `S`, `A`, `B`, `C`, `D`.

Les héros, factions, classes, raretés et noms (anglais, français) sont extraits des fichiers du jeu PC (version 1.6.39). `gameId` est l'identifiant interne du jeu. Les builds et les notes de tier list restent à remplir.

---

Site de fans, non affilié à Moonton.

## Images

- `public/heroes/head/<gameId>.webp` (portrait des cartes) et `public/heroes/bust/<gameId>.webp` (buste) : sprites `HeroHead_*` et `HeroBust_*` extraits des fichiers `Atlas_HeroCard*.unity3d` et `HeroBust_*.unity3d` du jeu.
- `public/icons/class/` : icônes de classe (`Profession_*` dans `Atlas_HeroCard.unity3d`).
