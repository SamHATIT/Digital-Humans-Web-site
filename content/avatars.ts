// Portraits des onze agents.
// Dans le bundle en ligne, `AV('sophie')` lit `window.__resources.avSophie` :
// un JPEG embarque dans le bundle (11 fichiers, 11,3 Mo au total).
//
// Ces JPEG n'ont pas ete rapatries pendant le portage du contenu (pas d'acces
// reseau vers digital-humans.fr depuis le conteneur de travail ; brief A.5 les
// donne de toute facon a convertir en WebP). Les portraits pointes ci-dessous
// sont ceux deja presents dans le depot depuis janvier : memes agents, fichiers
// differents. Ecart visuel connu, pas un ecart de contenu.
//
// Pour aligner sur le site en ligne, la ou le bundle est lisible :
//   python3 outils/extraire-visuels.py <bundle index.html> .
// puis remplacer les valeurs ci-dessous par `<slug>.jpg`.
const FILES: Record<string, string> = {
  sophie: 'sophie-pm.png',
  olivia: 'olivia-ba.png',
  emma:   'emma-research.png',
  marcus: 'marcus-architect.png',
  diego:  'diego-apex.png',
  zara:   'zara-lwc.png',
  raj:    'raj-admin.png',
  aisha:  'aisha-data.png',
  elena:  'elena-qa.png',
  jordan: 'jordan-devops.png',
  lucas:  'lucas-trainer.png',
};

export const AV = (slug: string): string => `/avatars/${FILES[slug] || slug + '.png'}`;
