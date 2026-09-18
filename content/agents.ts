import { AV } from './avatars';

// Les onze agents, porte verbatim depuis `_contenu-source/app_contenu.js`.
// `act` = acte, `c` = accent de groupe, `a` = portrait, `en`/`fr` = role.
export interface Agent { act: string; c: string; n: string; a: string; en: string; fr: string; [k: string]: string }

export const ENSEMBLE: Agent[] = [
  {act:'I·1',   c:'var(--indigo)', n:'Sophie Chen',      a:AV('sophie'), en:'Orchestrator',       fr:'Chef d’orchestre'},

  {act:'II·1',  c:'var(--plum)',   n:'Olivia Parker',    a:AV('olivia'), en:'Business Analyst',    fr:'Business Analyst'},
  {act:'II·2',  c:'var(--plum)',   n:'Emma Rodriguez',   a:AV('emma'),   en:'Research',            fr:'Recherche'},
  {act:'II·3',  c:'var(--plum)',   n:'Marcus Johnson',   a:AV('marcus'), en:'Architect',           fr:'Architecte'},

  {act:'III·1', c:'var(--terra)',  n:'Diego Martinez',   a:AV('diego'),  en:'Apex',                fr:'Apex'},
  {act:'III·2', c:'var(--terra)',  n:'Zara Thompson',    a:AV('zara'),   en:'LWC',                 fr:'LWC'},
  {act:'III·3', c:'var(--terra)',  n:'Raj Patel',        a:AV('raj'),    en:'Administrator',       fr:'Administrateur'},

  {act:'IV·1',  c:'var(--sage)',   n:'Aisha Okonkwo',    a:AV('aisha'),  en:'Data Migration',      fr:'Migration'},
  {act:'IV·2',  c:'var(--sage)',   n:'Elena Vasquez',    a:AV('elena'),  en:'QA',                  fr:'QA'},

  {act:'V·1',   c:'var(--slate)',  n:'Jordan Blake',     a:AV('jordan'), en:'DevOps',              fr:'DevOps'},
  {act:'V·2',   c:'var(--ochre)',  n:'Lucas Fernandez',  a:AV('lucas'),  en:'Trainer',             fr:'Formateur'},
];
