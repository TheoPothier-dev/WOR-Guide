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

Exemple de héros :

```json
{
  "id": "rorkesh",
  "name": { "en": "Rorkesh" },
  "class": "marksman",
  "rarity": "legendary",
  "faction": "grey-blades",
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

Les deux héros actuels sont des exemples tirés de recherches web, à vérifier dans le jeu.

---

Site de fans, non affilié à Moonton.
