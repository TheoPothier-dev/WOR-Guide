// Ordre d'affichage des classes.
export const heroClasses = ['fighter', 'mage', 'marksman', 'defender', 'healer', 'tactician'] as const;

// Symbole affiché à côté du nom de chaque classe.
export const classIcon: Record<(typeof heroClasses)[number], string> = {
  fighter: '⚔',
  mage: '✦',
  marksman: '➶',
  defender: '⛨',
  healer: '✚',
  tactician: '♜',
};
