// Donnees des vitrines = reference validee le 18/09 (decoupee par programme dans
// reference-vitrines.ts) + corrections de CONTENU, toutes ici et commentees.
//
// Regle appliquee : la reference fait foi pour l'apparence et pour le texte
// qu'elle est seule a porter (roles, etapes, prompts, Pacte, FAQ…). Quand elle
// contredit le site en ligne ou les SDS publiees, ce sont eux qui font foi :
//   1. projets -> SDS : la reference rattachait Claim Resolver a 176, Pipeline
//      Tuner a 177, Grid Foresight a 178 et Omnichannel Loop a 179. Les titres
//      des pages /sds-preview/*.html (lus le 24/10) et content/projects.ts donnent
//      179, 176, 177, 178. Correspondance reprise de content/projects.ts.
//   2. chiffres de l'Atelier : mesures dans les SDS (content/sds-chiffres.json,
//      outils/chiffres-sds.py), au lieu des nombres codes dans la reference.
//   3. secteur, brief et gain des projets : textes du site en ligne
//      (content/projects.ts : industry, punchline, scope), la reference ayant
//      des briefs inventes (ex. LogiFleet « 1 200 vehicules » contre « 320 »).
//   4. agents : role et citation = lignes du site en ligne
//      (content/agents-lignes.json, outils/lignes-agents.py) ; la reference les
//      reformulait et ajoutait « Pas une fois en 1 247 projets » a Marcus.
//   5. « Ce qu'il ecrit » : article reel du Journal de l'agent
//      (content/journal.json, outils/articles-journal.py). Emma, Elena et Lucas
//      n'ont aucun article publie : l'element est omis (pas de faux titre).
//   6. visuels : chemins /visuels/ au lieu de uploads/.
import { donneesReference, geometrieReference, Bi } from './reference-vitrines';
import { PROJECTS as PROJETS_EN_LIGNE } from './projects';
import CHIFFRES from './sds-chiffres.json';
import LIGNES from './agents-lignes.json';
import JOURNAL from './journal.json';

export type { Bi };
export type Langue = 'fr' | 'en';
export const t = (b: Bi | string, l: Langue): string => (typeof b === 'string' ? b : b[l]);
const visuel = (p: string) => '/' + p.replace(/^uploads\//, 'visuels/');

const R = donneesReference();

export const MENTION_IA: Bi = R.aiNotice;
export const ARTEFACTS = R.A;
export const BARRES: Record<string, (string | number)[]> = R.BARS;
export const completer4 = R.pad4;
export const CAS = R.CASES;
export const FAQ = R.FAQ;
export const PILE: string[] = R.stack;
export const LIBELLES_CHIFFRES: Bi[] = R.STAT_LABELS;
export const ROLES = R.ROLES;
export const ETAPES = R.STEPS;
export const PHOTO_ROLE: string[] = R.ROLE_PHOTO.map(visuel);
export const PHOTO_ETAPE: string[] = R.ETAPE_PHOTO.map(visuel);
export const PHOTO_PROJET: string[] = R.PROJET_PHOTO.map(visuel);
export const PHOTO_AGENT: Record<string, string> = Object.fromEntries(
  Object.entries(R.PHOTO as Record<string, string>).map(([k, v]) => [k, visuel(v)]));

export function geometrie(largeur: number) {
  const g = geometrieReference(largeur);
  const VIGNETTE = Object.fromEntries(Object.entries(g.VIGNETTE as Record<string, string>).map(([k, v]) => [k, visuel(v)]));
  return { ...g, VIGNETTE };
}

// 4 + 5 — agents
type Ligne = { nom: string; role: string; lignes: string[] };
const lignes = LIGNES as Record<string, Record<Langue, Ligne>>;
export interface Article { titre: string; description: string | null; image: string | null; date: string; url: string }
const journal = JOURNAL as Record<string, Article>;
export const AGENTS = R.AGENTS.map((a: any) => {
  const l = lignes[a.first];
  if (!l) throw new Error('agent sans ligne en ligne : ' + a.first);
  return {
    ...a,
    role: { fr: l.fr.role, en: l.en.role } as Bi,
    quote: { fr: l.fr.lignes.join(' '), en: l.en.lignes.join(' ') } as Bi,
    article: journal[a.first] || null,
  };
});

// 1 + 2 + 3 — projets
const ID_SDS = (url: string) => Number((url.match(/sds-preview\/(\d+)\.html$/) || [])[1]);
export const PROJETS = R.PROJECTS.map((p: any) => {
  const enLigne = PROJETS_EN_LIGNE.find(x => x.title.en.startsWith(p.name));
  if (!enLigne) throw new Error('projet absent du site en ligne : ' + p.name);
  const id = ID_SDS(enLigne.sds_url);
  const c = (CHIFFRES as Record<string, { exigences: number; cas_usage: number; objets: number; flux: number }>)[String(id)];
  if (!c) throw new Error('chiffres SDS manquants : ' + id);
  return {
    ...p,
    id,
    sdsUrl: enLigne.sds_url,
    sector: { fr: enLigne.industry.fr, en: enLigne.industry.en } as Bi,
    brief: { fr: enLigne.punchline.fr, en: enLigne.punchline.en } as Bi,
    gain: enLigne.scope[2],
    gainBody: enLigne.scope[0] + ' · ' + enLigne.scope[1],
    stats: [c.exigences, c.cas_usage, c.objets, c.flux],
  };
});
