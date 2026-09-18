// Les trois paliers affiches en grille (le palier IV Enterprise est dans le
// composant). Porte verbatim depuis `_contenu-source/app_contenu.js`.
interface Bilingual { en: string; fr: string; [k: string]: string }
interface BilingualList { en: string[]; fr: string[]; [k: string]: string[] }
export interface PricingTier { id: string; eyebrow: Bilingual; name: Bilingual; tagline: Bilingual;
  price: Bilingual; period: Bilingual; vat?: Bilingual; featured?: boolean; bullets: BilingualList;
  cta: Bilingual; disabled?: boolean; note?: Bilingual }

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    eyebrow: { en: 'TIER I', fr: 'PALIER I' },
    name:    { en: 'Free',  fr: 'Gratuit' },
    tagline: { en: 'Discover the studio.', fr: 'Découvrez le studio.' },
    price:   { en: 'Free',  fr: 'Gratuit' },
    period:  { en: '',      fr: '' },
    bullets: {
      en: [
        'Chat with Sophie and Olivia',
        'No file upload, no persistent memory',
        'Nemotron model, hosted in Europe',
        'Sessions stateless — nothing stored',
      ],
      fr: [
        'Discutez avec Sophie et Olivia',
        'Sans import de fichiers ni mémoire persistante',
        'Modèle Nemotron, hébergé en Europe',
        'Sessions sans état — rien n’est conservé',
      ],
    },
    cta: { en: 'Get on the list', fr: 'S’inscrire à la liste' },
  },
  {
    id: 'pro',
    eyebrow:   { en: 'TIER II · MOST POPULAR', fr: 'PALIER II · LE PLUS DEMANDÉ' },
    name:      { en: 'Pro',   fr: 'Pro' },
    tagline:   { en: 'From brief to delivered SDS.', fr: 'Du brief au SDS livré.' },
    price:     { en: '79€',   fr: '79€' },
    period:    { en: '/month', fr: '/mois' },
    vat:       { en: 'excl. VAT', fr: 'HT · TVA en sus' },
    featured:  true,
    bullets: {
      en: [
        'Full ensemble of 11 agents',
        'File upload & persistent memory',
        '2 SDS per month included (BR · UC · Solution Design · Word/PDF)',
        'Marcus runs on Opus — the technical depth that makes the SDS shippable',
        'Sonnet for the rest of the team',
      ],
      fr: [
        'L’ensemble complet : 11 agents',
        'Import de fichiers & mémoire persistante',
        '2 SDS par mois inclus (BR · UC · Solution Design · Word/PDF)',
        'Marcus tourne sous Opus — la profondeur technique qui rend le SDS livrable',
        'Sonnet pour le reste de l’équipe',
      ],
    },
    cta: { en: 'Coming soon', fr: 'Bientôt' },
    disabled: true,
    note: { en: 'No code generation, no deployment — those live in Team.',
            fr: 'Ni génération de code ni déploiement — réservés à l’offre Team.' },
  },
  {
    id: 'team',
    eyebrow: { en: 'TIER III', fr: 'PALIER III' },
    name:    { en: 'Team',     fr: 'Team' },
    tagline: { en: 'Pocket team for continuous work.', fr: 'Une équipe de poche, en continu.' },
    price:   { en: '1 490€',   fr: '1 490€' },
    period:  { en: '/month',   fr: '/mois' },
    vat:     { en: 'excl. VAT', fr: 'HT · TVA en sus' },
    bullets: {
      en: [
        'Everything in Pro',
        'BUILD phase — Apex, LWC, Admin generation',
        'SFDX deployment to sandbox',
        'Opus on opt-in (cost shown before each call)',
        'Multi-environment, git integration',
      ],
      fr: [
        'Tout Pro, et :',
        'Phase BUILD — génération Apex, LWC, Admin',
        'Déploiement SFDX vers sandbox',
        'Opus en option (coût affiché avant chaque appel)',
        'Multi-environnements, intégration Git',
      ],
    },
    cta: { en: 'Coming soon', fr: 'Bientôt' },
    disabled: true,
    note: { en: 'Sandbox only — production deploys are reserved for Enterprise contracts.',
            fr: 'Sandbox uniquement — les mises en production sont réservées aux contrats Enterprise.' },
  },
];
