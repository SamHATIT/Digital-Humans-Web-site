// Donnees legales — mentions legales, CGV, politique de confidentialite (FR + EN).
//
// Source : bundle en ligne du 17/09/2026, ressource `a1b2c3d4-…` (`LEGAL_DATA`),
// conservee dans `_contenu-source/legal_data.js`. Le JSON de `legal.json` est
// une decoupe octet pour octet de cet objet : il ne doit jamais etre retape a
// la main — une faute de frappe y est une infraction (SIRET, TVA, art. 50 du
// reglement UE 2024/1689).
import data from './legal.json';

export type LegalSlug = 'legal' | 'cgv' | 'privacy';
export type LegalLang = 'fr' | 'en';

export interface LegalSection {
  h: string;
  /** Paragraphes en HTML (liens, <br/>) — rendus via dangerouslySetInnerHTML. */
  p: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  sections: LegalSection[];
}

export const LEGAL_DATA = data as Record<LegalSlug, Record<LegalLang, LegalDoc>>;

export const LEGAL_SLUGS: LegalSlug[] = ['legal', 'cgv', 'privacy'];
