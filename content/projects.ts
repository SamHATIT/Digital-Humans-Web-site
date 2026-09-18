// Les six projets publies de l'Atelier, avec leurs URL de SDS.
// Porte verbatim depuis `_contenu-source/app_contenu.js`.
interface Bilingual { en: string; fr: string; [k: string]: string }
export interface Project { id: string; roman: string; industry: Bilingual; title: Bilingual;
  punchline: Bilingual; scope: string[]; sds_url: string }

export const PROJECTS: Project[] = [
  {
    id: 'logifleet', roman: 'I',
    industry:  { en: 'LOGISTICS · B2B', fr: 'LOGISTIQUE · B2B' },
    title:     { en: 'LogiFleet — Fleet Service Cloud', fr: 'LogiFleet — Fleet Service Cloud' },
    punchline: { en: 'A 320-vehicle fleet brought into Service Cloud in eight days. Drivers, dispatch, maintenance — one canonical record per asset.',
                 fr: 'Une flotte de 320 véhicules basculée dans Service Cloud en huit jours. Chauffeurs, dispatch, maintenance — un seul enregistrement canonique par actif.' },
    scope: ['Service Cloud · Field Service · 320 assets',
            '12 custom objects · 47 flows · 9 LWC',
            'Live in production, week 11 · 0 critical bugs'],
    sds_url: 'https://digital-humans.fr/sds-preview/146.html',
  },
  {
    id: 'pharma', roman: 'II',
    industry:  { en: 'PHARMA · CLINICAL TRIALS', fr: 'PHARMA · ESSAIS CLINIQUES' },
    title:     { en: 'Clinical Trial Watch', fr: 'Clinical Trial Watch' },
    punchline: { en: 'A regulated trial pipeline turned into a single Salesforce dashboard. Sites, enrolments, deviations — every event audit-trailed.',
                 fr: 'Un pipeline d’essais cliniques régulés transformé en un seul dashboard Salesforce. Sites, recrutements, déviations — chaque événement traçable.' },
    scope: ['Health Cloud · Experience Cloud · 21 CFR Part 11',
            '38 trial sites · 1 200 enrolments tracked',
            'Audit-ready logs, end-to-end'],
    sds_url: 'https://digital-humans.fr/sds-preview/148.html',
  },
  {
    id: 'telecom', roman: 'III',
    industry:  { en: 'TELECOM · CLAIMS', fr: 'TÉLÉCOM · RÉCLAMATIONS' },
    title:     { en: 'Claim Resolver', fr: 'Claim Resolver' },
    punchline: { en: '14-day average resolution dropped to 4. Claims triaged by Einstein, dispatched by Sophie, audited by Elena.',
                 fr: 'Délai moyen de résolution passé de 14 à 4 jours. Réclamations triées par Einstein, dispatchées par Sophie, auditées par Elena.' },
    scope: ['Service Cloud · Einstein Bots · Omnichannel',
            '110 000 claims/year · 87% first-touch resolution',
            '−71% AHT, +12 NPS in two quarters'],
    sds_url: 'https://digital-humans.fr/sds-preview/179.html',
  },
  {
    id: 'b2b-distribution', roman: 'IV',
    industry:  { en: 'B2B · DISTRIBUTION', fr: 'B2B · DISTRIBUTION' },
    title:     { en: 'Pipeline Tuner', fr: 'Pipeline Tuner' },
    punchline: { en: 'Twelve regional sales pipelines reconciled into one consolidated view. Forecast accuracy up from 68% to 91% in the first quarter.',
                 fr: 'Douze pipelines commerciaux régionaux réconciliés en une vue consolidée. Précision du forecast passée de 68% à 91% au premier trimestre.' },
    scope: ['Sales Cloud · CPQ · Tableau CRM',
            '12 regions · 240 reps · €310M ARR tracked',
            '+23 forecast accuracy points'],
    sds_url: 'https://digital-humans.fr/sds-preview/176.html',
  },
  {
    id: 'energy', roman: 'V',
    industry:  { en: 'ENERGY · GRID', fr: 'ÉNERGIE · RÉSEAU' },
    title:     { en: 'Grid Foresight', fr: 'Grid Foresight' },
    punchline: { en: 'High-voltage maintenance scheduling moved from spreadsheets to Salesforce. Outage windows down 38%, asset uptime up 6 points.',
                 fr: 'Planification de la maintenance haute tension basculée des spreadsheets vers Salesforce. Fenêtres de coupure −38%, disponibilité des actifs +6 points.' },
    scope: ['Field Service · Asset 360 · Net Zero Cloud',
            '4 800 high-voltage assets monitored',
            'Predictive maintenance via Einstein Discovery'],
    sds_url: 'https://digital-humans.fr/sds-preview/177.html',
  },
  {
    id: 'retail', roman: 'VI',
    industry:  { en: 'RETAIL · OMNICHANNEL', fr: 'RETAIL · OMNICANAL' },
    title:     { en: 'Omnichannel Loop', fr: 'Omnichannel Loop' },
    punchline: { en: 'Fifty stores, one customer record. Loyalty events, returns, e-commerce orders, in-store visits — stitched into a single graph.',
                 fr: 'Cinquante magasins, un seul dossier client. Événements de fidélité, retours, commandes e-commerce, visites en magasin — cousus dans un seul graphe.' },
    scope: ['Commerce Cloud · Marketing Cloud · Loyalty',
            '50 stores · 1.4M customers unified',
            '+18% repeat purchase rate'],
    sds_url: 'https://digital-humans.fr/sds-preview/178.html',
  },
];

// Visuels de couverture : les images du bundle (`window.__resources.cv*`) ne
// font pas partie des sources extraites. Elles sont servies depuis
// `public/covers/` ; tant qu'elles manquent, la carte reste lisible (le texte
// est en surimpression). Regeneration des visuels : brief A.5.
export const COVER = (id: string): string => `/covers/${id}.jpg`;
