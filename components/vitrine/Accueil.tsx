import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PRICING_TIERS } from '../../content/pricing';
import {
  AGENTS, ARTEFACTS as A, CAS, ETAPES, FAQ, LIBELLES_CHIFFRES, MENTION_IA, PHOTO_AGENT, PHOTO_ETAPE, PHOTO_PROJET,
  PHOTO_ROLE, PILE, PROJETS, ROLES, BARRES, completer4, geometrie, t, Langue,
} from '../../content/vitrines';
import SophieChat from '../site/SophieChat';
import Vitrine from './Vitrine';
import BoiteSophie from './BoiteSophie';
import { CanevasNoeuds, CanevasSds } from './Canevas';
import { parlerASophie, useEchange, useLargeur, useReduit } from './crochets';

const CLE_INTRO = 'dh-intro-seen';
const SIGNUP = 'https://app.digital-humans.fr/signup';
// Texte de l'interface repris de la reference (renderVals, 18/09).
const X = {
  fr: {
    tag: 'Salesforce · Autonome', demo: 'Demander une démo →', theme: 'Thème',
    nav: [['#top', 'Cas d’usage'], ['#who', 'Pour qui'], ['#process', 'Méthode'], ['#agents', 'L’Ensemble'], ['#atelier', 'L’Atelier'], ['#pricing', 'Tarifs'], ['#faq', 'FAQ']],
    tampon: '03:00 · la veille', passer: 'Passer l’intro',
    intro: ['3 h du matin.', 'Le brief tombe dans votre boîte.', 'Le consultant ne répond plus.', 'Soixante-douze heures avant la deadline.', 'Quelque part, onze agents s’éveillent.'],
    herosSur: '03:00 · Paris · onze agents éveillés', herosT1: 'L’équipe IA qui', herosT2: 'ne dort jamais.',
    herosSous: 'Décrivez votre besoin Salesforce. Sophie orchestre dix spécialistes — analyse, architecture, Apex, LWC, tests, déploiement — et vous validez chaque étape avant la suivante.',
    herosPrompt: 'Décrivez votre besoin Salesforce — ou choisissez un cas ci-dessus.', herosDuree: 'onze agents · 24/7', herosOnglets: 'Cas d’usage',
    gain: 'Le gain', garanti: 'Ce qu’on garantit', ecrit: 'Ce qu’il écrit', garantitIl: 'Ce qu’il garantit',
    who: ['Pour qui', 'Une équipe pour chaque', 'métier.', 'Ce que vous recevez'],
    process: ['La méthode', 'Quatre étapes,', 'sans couture.', 'Les artefacts de l’étape'],
    agents: ['L’Ensemble', 'Onze spécialistes,', 'une seule porte.', 'Ce que cet agent produit'],
    atelier: ['L’Atelier', 'Six projets,', 'six SDS publiés.', 'Aperçu du SDS publié'],
    sdsGarantie: 'Le SDS publié est le document réel remis au client, sans coupe.',
    sdsSect: [['1 · Périmètre'], ['2 · Exigences', ' exigences numérotées, chacune rattachée à une phrase du brief client.'], ['3 · Cas d’usage', ' cas d’usage avec acteurs, préconditions et critères d’acceptation testables.'],
      ['4 · Modèle de données', ' objets, relations et champs calculés, avec les volumes attendus par objet.'], ['5 · Automatisations', ' flux déclaratifs, et les cas où l’Apex est justifié plutôt qu’un Flow.'],
      ['6 · Décisions d’architecture', 'Chaque ADR indique l’option retenue, les options écartées et la raison du choix.'], ['7 · Recette & déploiement', 'Scénarios de recette, couverture cible, fenêtre de déploiement et plan de retour arrière.']],
    lire: 'Lire le SDS complet →', pile: 'Ce que l’équipe maîtrise',
    faqSur: 'Objections', faqT1: 'Les questions', faqT2: 'honnêtes.',
    ctaSur: 'Dans cinq minutes', ctaT1: 'Vous aurez fait', ctaT2: 'un choix.',
    ctaSous: 'Soit vous continuez comme avant — soit vous ouvrez un ticket et Sophie cadre votre premier SDS.', studio: 'Entrer dans le studio',
    news: 'Une note par mois sur la Séquence, les agents et ce qui change dans Salesforce.', email: 'votre@email.fr', etat: 'Studio en composition',
    newsTodo: 'Lettre mensuelle : inscription non branchée (TODO).',
    cols: [['Produit', [['Le studio', 'https://app.digital-humans.fr/'], ['Tarifs', '#pricing'], ['Les agents', '#agents'], ['Documentation', null]]],
      ['Studio', [['Manifeste', 'https://digital-humans.fr/journal/manifesto.html'], ['Journal', 'https://digital-humans.fr/journal/'], ['Le Pacte', null], ['Contact', null]]],
      ['Légal', [['Mentions légales', '/legal'], ['Confidentialité', '/privacy'], ['CGV', '/cgv']]]],
    mKick: 'Demande de démo', mTitre: 'Demander une démo', mEmail: 'E-mail professionnel', mSoc: 'Société', mBesoin: 'Votre besoin Salesforce', mEnv: 'Créer le ticket', fermer: 'Fermer',
    mTodo: 'TODO — la création de ticket (Email-to-Case) n’est pas encore branchée : l’adresse de routage n’a pas été fournie. Aucune demande n’est envoyée depuis ce formulaire.',
  },
  en: {
    tag: 'Salesforce · Autonomous', demo: 'Request a demo →', theme: 'Theme',
    nav: [['#top', 'Use cases'], ['#who', 'Who it’s for'], ['#process', 'Method'], ['#agents', 'The Ensemble'], ['#atelier', 'The Workshop'], ['#pricing', 'Pricing'], ['#faq', 'FAQ']],
    tampon: '03:00 · the night before', passer: 'Skip intro',
    intro: ['3 a.m.', 'The brief lands in your inbox.', 'The consultant has gone dark.', 'Seventy-two hours to deadline.', 'Somewhere, eleven agents wake.'],
    herosSur: '03:00 · Paris · eleven agents awake', herosT1: 'The AI team that', herosT2: 'never sleeps.',
    herosSous: 'Describe your Salesforce need. Sophie orchestrates ten specialists — analysis, architecture, Apex, LWC, tests, deployment — and you approve every stage before the next.',
    herosPrompt: 'Describe your Salesforce need — or pick a case above.', herosDuree: 'eleven agents · 24/7', herosOnglets: 'Use cases',
    gain: 'The gain', garanti: 'What we guarantee', ecrit: 'What they write', garantitIl: 'What they guarantee',
    who: ['Who it’s for', 'A team for every', 'role.', 'What you receive'],
    process: ['The method', 'Four steps,', 'seamless.', 'Artefacts from this step'],
    agents: ['The Ensemble', 'Eleven specialists,', 'one door.', 'What this agent produces'],
    atelier: ['The Workshop', 'Six projects,', 'six published SDS.', 'Published SDS preview'],
    sdsGarantie: 'The published SDS is the real document handed to the client, uncut.',
    sdsSect: [['1 · Scope'], ['2 · Requirements', ' numbered requirements, each tied to a sentence of the client brief.'], ['3 · Use cases', ' use cases with actors, preconditions and testable acceptance criteria.'],
      ['4 · Data model', ' objects, relationships and formula fields, with expected volumes per object.'], ['5 · Automation', ' declarative flows, and the cases where Apex is justified over a Flow.'],
      ['6 · Architecture decisions', 'Each ADR states the chosen option, the rejected options and the reason for the choice.'], ['7 · Acceptance & deployment', 'Acceptance scenarios, target coverage, deployment window and rollback plan.']],
    lire: 'Read the full SDS →', pile: 'What the team masters',
    faqSur: 'Objections', faqT1: 'The honest', faqT2: 'questions.',
    ctaSur: 'In five minutes', ctaT1: 'You will have made', ctaT2: 'a choice.',
    ctaSous: 'Either you carry on as before — or you open a ticket and Sophie scopes your first SDS.', studio: 'Enter the studio',
    news: 'One note a month on the Sequence, the agents and what changes in Salesforce.', email: 'you@company.com', etat: 'Studio in composition',
    newsTodo: 'Monthly note: sign-up not wired yet (TODO).',
    cols: [['Product', [['The studio', 'https://app.digital-humans.fr/'], ['Pricing', '#pricing'], ['The agents', '#agents'], ['Documentation', null]]],
      ['Studio', [['Manifesto', 'https://digital-humans.fr/journal/manifesto.html'], ['Journal', 'https://digital-humans.fr/journal/'], ['The Pact', null], ['Contact', null]]],
      ['Legal', [['Legal notice', '/legal'], ['Privacy', '/privacy'], ['CGV', '/cgv']]]],
    mKick: 'Demo request', mTitre: 'Request a demo', mEmail: 'Work email', mSoc: 'Company', mBesoin: 'Your Salesforce need', mEnv: 'Create the ticket', fermer: 'Close',
    mTodo: 'TODO — ticket creation (Email-to-Case) is not wired yet: the routing address has not been provided. Nothing is sent from this form.',
  },
};

// ------------------------------------------------------------------ navigation
function Nav({ l, langue, onDemo }: { l: typeof X.fr; langue: Langue; onDemo: () => void }) {
  const { setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="v-nav">
      <div className="v-nav-in">
        <a href="#top" className="v-marque">
          <span className="v-marque-nom">Digital·<em className="v-laiton">Humans</em></span>
          <span className="v-marque-tag">{l.tag}</span>
        </a>
        <div className="v-nav-liens">{l.nav.map(([h, n]) => <a key={h} href={h}>{n}</a>)}</div>
        <div className="v-nav-outils">
          <div className="v-langues">
            <button type="button" aria-pressed={langue === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
            <button type="button" aria-pressed={langue === 'en'} onClick={() => setLanguage('en')}>EN</button>
          </div>
          <button type="button" className="v-theme" title={l.theme} aria-label={l.theme} onClick={toggleTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d={theme === 'dark' ? 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z' : 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z'}/>
            </svg>
          </button>
          <button type="button" className="v-btn-nav" onClick={onDemo}>{l.demo}</button>
        </div>
      </div>
    </nav>
  );
}

// ------------------------------------------------------------------ intro (une fois par navigateur)
function Intro({ l, mention, onFin }: { l: typeof X.fr; mention: string; onFin: () => void }) {
  useEffect(() => { const id = window.setTimeout(onFin, 4150); return () => window.clearTimeout(id); }, [onFin]);
  return (
    <div className="v-intro" data-intro="">
      <div className="v-intro-tampon">{l.tampon}</div>
      {l.intro.map((txt, i) => (
        <p key={i} className="v-intro-ligne" style={{ animationDelay: (0.2 + i * 0.55).toFixed(2) + 's', color: i === 4 ? '#C8A97E' : (i === 1 || i === 3) ? '#C85C4B' : '#F5F2EC', fontStyle: i === 4 ? 'italic' : 'normal' }}>{txt}</p>
      ))}
      <p className="v-intro-ia" data-mention-ia="">{mention}</p>
      <button type="button" className="v-intro-passer" onClick={onFin}>{l.passer} →</button>
    </div>
  );
}

// ------------------------------------------------------------------ heros
function Heros({ l, langue, mention, largeur }: { l: typeof X.fr; langue: Langue; mention: string; largeur: number }) {
  const [cas, setCas] = useState(-1);
  const [eteint, echanger] = useEchange();
  const g = geometrie(largeur);
  const arts = cas >= 0 ? CAS[cas].arts : [A.req, A.erd, A.apex, A.uc, A.sds, A.deploy];
  const vignette = (k: string) => (k === 'code' ? { bg: '#141416', bar: 'rgba(200,169,126,.7)' } : k === 'erd' ? { bg: '#EDE8DD', bar: 'rgba(10,10,11,.22)' } : { bg: '#F1EDE4', bar: 'rgba(10,10,11,.2)' });
  const cartes = arts.slice(0, 6).map((a: any, i: number, arr: any[]) => ({ a, v: vignette(a.kind), barres: (BARRES[a.kind] === BARRES.erd ? BARRES.list : BARRES[a.kind]) || BARRES.list,
    delai: (-(i * 16 / arr.length)).toFixed(1) + 's', haut: (8 + (i * 31) % 50) + '%' }));
  const bandes = [cartes.filter((_, i) => i % 2 === 0), cartes.filter((_, i) => i % 2 === 1)];
  return (
    <header id="top" className="v-heros">
      <div className="v-heros-halo"/>
      <div className="v-bandes" style={{ display: g.bandDisplay }} aria-hidden="true">
        {bandes.map((b, k) => (
          <div key={k} className="v-bande" style={{ width: g.bandWidth }}>
            {b.map((c, i) => (
              <div key={cas + '-' + i} className="v-carte3d" style={{ top: c.haut, animationDelay: c.delai }}>
                <div className="v-carte3d-vign" style={{ background: c.v.bg }}>{c.barres.map((w, j) => <span key={j} style={{ background: c.v.bar, width: String(w) }}/>)}</div>
                <div className="v-carte3d-txt">
                  <span className="v-carte3d-meta">{t(c.a.meta, langue)}</span>
                  <span className="v-carte3d-lib">{t(c.a.label, langue)}</span>
                  <span className="v-carte3d-ag">{c.a.agent}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="v-heros-centre">
        <div className="v-heros-sur"><span className="v-point"/>{l.herosSur}</div>
        <h1>{l.herosT1} <em className="v-laiton">{l.herosT2}</em></h1>
        <p className="v-heros-sous">{l.herosSous}</p>
      </div>
      <BoiteSophie variante="heros" langue={langue} onglets={CAS.map((c: any) => t(c.label, langue))} actif={cas}
        onChoisir={i => echanger(() => setCas(c => (c === i ? -1 : i)))} prompt={cas >= 0 ? t(CAS[cas].prompt, langue) : l.herosPrompt}
        eteint={eteint} mention={mention} idOnglets={l.herosOnglets}/>
      <div className="v-heros-duree" style={{ opacity: eteint ? 0 : 1 }}>{cas >= 0 ? t(CAS[cas].duration, langue) : l.herosDuree}</div>
    </header>
  );
}

// ------------------------------------------------------------------ tarifs (contenu du site en ligne)
function Tarifs({ langue }: { langue: Langue }) {
  const fr = langue === 'fr';
  return (
    <section id="pricing" className="v-tarifs">
      <div className="v-tarifs-in">
        <div className="v-surtitre">{fr ? '№ 04 · Le pacte' : '№ 04 · The pact'}</div>
        <h2>{fr ? <>Trois façons de <em className="v-laiton">travailler avec nous</em>.</> : <>Three ways to <em className="v-laiton">work with us</em>.</>}</h2>
        <p className="v-tarifs-lede">{fr ? 'Accès anticipé — nous ouvrons par vagues. Inscrivez-vous pour être prévenu·e.' : 'Early access — we’re opening in waves. Get on the list to be notified.'}</p>
        <div className="v-offres">
          {PRICING_TIERS.map(o => (
            <div key={o.id} className={'v-offre' + (o.featured ? ' v-offre--vedette' : '')}>
              <div><h3>{o.name[langue]}</h3><p className="v-offre-acc">{o.tagline[langue]}</p></div>
              <div className="v-prix">
                <div className="v-prix-l"><span className="v-prix-m">{o.price[langue]}</span><span className="v-prix-p">{o.period[langue]}</span></div>
                {o.vat ? <span className="v-prix-tva">{o.vat[langue]}</span> : null}
              </div>
              <div className="v-quota">{o.eyebrow[langue]}</div>
              <ul>{o.bullets[langue].map((b, i) => <li key={i}><span>◆</span><span>{b}</span></li>)}</ul>
              {o.note ? <div className="v-offre-note">{o.note[langue]}</div> : null}
              {o.disabled
                ? <span className="v-offre-cta" aria-disabled="true">{o.cta[langue]}</span>
                : <a className="v-offre-cta" href={SIGNUP}>{o.cta[langue]} →</a>}
            </div>
          ))}
          <div className="v-offre">
            <div><h3>Enterprise</h3><p className="v-offre-acc"><strong>{fr ? 'Sur devis · on-premise.' : 'On request · on-premise.'}</strong></p></div>
            <div className="v-quota">{fr ? 'PALIER IV · ENTERPRISE' : 'TIER IV · ENTERPRISE'}</div>
            <ul><li><span>◆</span><span>{fr
              ? 'Hébergé sur votre infrastructure, LLM au choix (Claude, GPT, Mistral, Llama), personnalisation au niveau projet, SSO, journaux d’audit, mises en production négociées au contrat.'
              : 'Hosted on your infrastructure, your choice of LLM (Claude, GPT, Mistral, Llama), project-level customisation, SSO, audit logs, production deploys negotiated in the contract.'}</span></li></ul>
            <button type="button" className="v-offre-cta" onClick={() => parlerASophie('')}>{fr ? 'Nous contacter' : 'Talk to us'} →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ demande de demo (sans faux ticket)
function ModaleDemo({ l, mention, onFermer }: { l: typeof X.fr; mention: string; onFermer: () => void }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onFermer(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onFermer]);
  return (
    <div className="v-modale-fond" onClick={e => { if (e.target === e.currentTarget) onFermer(); }}>
      <div className="v-modale" role="dialog" aria-modal="true" aria-labelledby="v-modale-titre">
        <div className="v-modale-tete">
          <div><span className="v-modale-kick">{l.mKick}</span><span id="v-modale-titre" className="v-modale-titre">{l.mTitre}</span></div>
          <button type="button" className="v-modale-x" aria-label={l.fermer} onClick={onFermer}>✕</button>
        </div>
        <form className="v-form" onSubmit={e => e.preventDefault()}>
          {/* TODO(Sam) : adresse de routage Email-to-Case (decision du 16/09) non fournie.
              Tant qu'elle manque, rien n'est envoye : pas de mailto, pas de faux numero de ticket. */}
          <p className="v-todo" role="note">{l.mTodo}</p>
          <label>{l.mEmail}<input type="email" placeholder={l.email} autoComplete="email"/></label>
          <label>{l.mSoc}<input autoComplete="organization"/></label>
          <label>{l.mBesoin}<textarea rows={3}/></label>
          <button type="submit" className="v-form-envoyer" disabled>{l.mEnv}</button>
          <span className="v-pied-ia" data-mention-ia="">{mention}</span>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ page
const Accueil: React.FC = () => {
  const { language: langue } = useLanguage();
  const { theme } = useTheme();
  const l = X[langue];
  const mention = t(MENTION_IA, langue);
  const reduit = useReduit();
  const largeur = useLargeur();
  const g = geometrie(largeur);
  const [intro, setIntro] = useState(() => {
    if (reduit) return false;
    try { return localStorage.getItem(CLE_INTRO) !== '1'; } catch (e) { return false; }
  });
  const finIntro = React.useCallback(() => { try { localStorage.setItem(CLE_INTRO, '1'); } catch (e) { /* stockage indisponible */ } setIntro(false); }, []);
  const [demo, setDemo] = useState(false);
  const [faq, setFaq] = useState(0);
  const [role, setRole] = useState(0), [etape, setEtape] = useState(0), [agent, setAgent] = useState(0), [projet, setProjet] = useState(0);

  const ro = ROLES[role], st = ETAPES[etape], ag = AGENTS[agent], pr = PROJETS[projet];
  const noeuds = (arts: any[], cle: string) => (allume: boolean) => <CanevasNoeuds arts={completer4(arts)} allume={allume} geo={g} langue={langue} cle={cle}/>;
  const commun = { langue, reduit, colonnes: g.gridCols, mention };

  return (
    <div className="v-racine" data-theme={theme} data-page="accueil">
      <Nav l={l} langue={langue} onDemo={() => setDemo(true)}/>
      {intro ? <Intro l={l} mention={mention} onFin={finIntro}/> : null}
      <Heros l={l} langue={langue} mention={mention} largeur={largeur}/>

      <Vitrine {...commun} id="who" surtitre={l.who[0]} titre1={l.who[1]} titre2={l.who[2]} compteur={'0' + (role + 1) + ' / 0' + ROLES.length}
        onglets={ROLES.map((r: any) => t(r.name, langue))} actif={role} onChoisir={setRole} nomOnglets={l.who[0]}
        photo={PHOTO_ROLE[role]} nom={t(ro.name, langue)} role={t(ro.role, langue)} citation={t(ro.desc, langue)} prompt={t(ro.prompt, langue)}
        titreCanevas={l.who[3]} canevas={noeuds(ro.arts, 'who' + role)}
        bandeau={{ aLabel: l.gain, aTitre: t(ro.gain, langue), aTexte: t(ro.gainBody, langue), bLabel: l.garanti, bTexte: t(ro.guard, langue), bRef: t(ro.guardRef, langue) }}/>

      <section className="v-pile" aria-label={l.pile}>
        <div className="v-pile-titre">{l.pile}</div>
        <div className="v-pile-piste" data-piste-pile="">{PILE.concat(PILE).map((k, i) => <span key={i} aria-hidden={i >= PILE.length ? true : undefined}>{k}</span>)}</div>
      </section>

      <Vitrine {...commun} id="process" surtitre={l.process[0]} titre1={l.process[1]} titre2={l.process[2]} compteur={st.num}
        onglets={ETAPES.map((s: any) => t(s.title, langue))} actif={etape} onChoisir={setEtape} nomOnglets={l.process[0]}
        photo={PHOTO_ETAPE[etape]} nom={t(st.title, langue)} role={t(st.role, langue)} citation={t(st.desc, langue)} prompt={t(st.prompt, langue)}
        titreCanevas={l.process[3]} canevas={noeuds(st.arts, 'process' + etape)}
        bandeau={{ aLabel: l.gain, aTitre: t(st.gain, langue), aTexte: t(st.gainBody, langue), bLabel: l.garanti, bTexte: t(st.guard, langue), bRef: t(st.guardRef, langue) }}/>

      <Vitrine {...commun} id="agents" surtitre={l.agents[0]} titre1={l.agents[1]} titre2={l.agents[2]} compteur={String(agent + 1).padStart(2, '0') + ' / 11'}
        onglets={AGENTS.map((a: any) => a.first)} actif={agent} onChoisir={setAgent} nomOnglets={l.agents[0]}
        photo={PHOTO_AGENT[ag.first]} nom={ag.first} role={t(ag.role, langue)} citation={t(ag.quote, langue)} prompt={t(ag.prompt, langue)}
        titreCanevas={l.agents[3]} canevas={noeuds(ag.arts, 'agents' + agent)}
        bandeau={{ ...(ag.article ? { aLabel: l.ecrit, aTitre: ag.article.titre, aTexte: ag.article.description || '', aLien: ag.article.url, aImage: ag.article.image } : {}),
          bLabel: l.garantitIl, bTexte: t(ag.pacte, langue), bRef: t(ag.ref, langue) }}/>

      <Vitrine {...commun} id="atelier" surtitre={l.atelier[0]} titre1={l.atelier[1]} titre2={l.atelier[2]} compteur={'0' + (projet + 1) + ' / 06'}
        onglets={PROJETS.map((p: any) => p.name)} actif={projet} onChoisir={setProjet} nomOnglets={l.atelier[0]}
        photo={PHOTO_PROJET[projet]} nom={pr.name} role={t(pr.sector, langue)} citation={t(pr.brief, langue)} prompt={t(pr.prompt, langue)}
        titreCanevas={l.atelier[3]}
        canevas={() => <CanevasSds tampon={'Solution Design Specification · SDS-' + pr.id} nom={pr.name} secteur={t(pr.sector, langue)}
          sections={l.sdsSect.map(([h, s], i) => ({ head: h, text: i === 0 ? t(pr.brief, langue) : i <= 4 ? pr.stats[i - 1] + s : s }))}
          chiffres={pr.stats.map((v: number, i: number) => ({ value: v, label: t(LIBELLES_CHIFFRES[i], langue) }))} lien={pr.sdsUrl} libLien={l.lire}/>}
        bandeau={{ aLabel: l.gain, aTitre: pr.gain, aTexte: pr.gainBody, bLabel: l.garanti, bTexte: l.sdsGarantie, bRef: 'SDS-' + pr.id }}/>

      <Tarifs langue={langue}/>

      <section id="faq" className="v-faq">
        <div className="v-faq-in">
          <div className="v-surtitre" style={{ marginBottom: 16 }}>— {l.faqSur}</div>
          <h2>{l.faqT1} <em className="v-laiton">{l.faqT2}</em></h2>
          <div className="v-faq-liste">
            {FAQ.map((q: any, i: number) => (
              <div key={i} className="v-faq-item">
                <button type="button" className="v-faq-q" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? -1 : i)}>
                  {t(q.q, langue)}<span className="v-faq-plus" style={{ transform: faq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {faq === i ? <p className="v-faq-r">{t(q.a, langue)}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="v-cta">
        <div className="v-cta-halo"/>
        <div className="v-cta-in">
          <div className="v-surtitre">{l.ctaSur}</div>
          <h2>{l.ctaT1} <em className="v-laiton">{l.ctaT2}</em></h2>
          <p className="v-cta-sous">{l.ctaSous}</p>
          <div className="v-cta-btns">
            <button type="button" className="v-cta-1" onClick={() => setDemo(true)}>{l.demo}</button>
            <a className="v-cta-2" href={SIGNUP}>{l.studio}</a>
          </div>
        </div>
      </section>

      <footer className="v-pied">
        <div className="v-pied-grille">
          <div className="v-pied-marque">
            <span className="v-pied-nom">Digital·<em className="v-laiton">Humans</em></span>
            <p className="v-pied-news">{l.news}</p>
            <div style={{ display: 'flex', border: '1px solid var(--rail2)', borderRadius: 3, overflow: 'hidden', maxWidth: 340 }} title={l.newsTodo}>
              <input placeholder={l.email} disabled aria-label={l.newsTodo} style={{ flex: 1, minWidth: 0, padding: '11px 14px', border: 0, background: 'transparent', color: 'var(--fg)', font: "13px 'Inter',sans-serif", outline: 'none' }}/>
              <button type="button" disabled aria-label={l.newsTodo} style={{ padding: '0 16px', border: 0, background: 'var(--btn)', color: 'var(--btnfg)', font: "500 12px 'Inter',sans-serif", cursor: 'not-allowed' }}>→</button>
            </div>
            <span className="v-pied-ia" data-mention-ia="">{mention}</span>
          </div>
          {l.cols.map(([titre, liens]) => (
            <div key={titre as string} className="v-pied-col">
              <div className="v-pied-titre">{titre as string}</div>
              {(liens as [string, string | null][]).map(([n, h]) => h === null
                ? <span key={n} style={{ fontSize: 13, color: 'var(--fg3)' }}>{n}</span>
                : h.startsWith('/') ? <Link key={n} to={h}>{n}</Link> : <a key={n} href={h}>{n}</a>)}
            </div>
          ))}
        </div>
        <div className="v-pied-bas">
          <span>© MMXXVI · Sam Hatit Consulting</span><span className="v-pied-etat">{l.etat}</span><span>hello@digital-humans.fr</span>
        </div>
      </footer>

      {demo ? <ModaleDemo l={l} mention={mention} onFermer={() => setDemo(false)}/> : null}
      <SophieChat lanceur={false}/>
    </div>
  );
};

export default Accueil;
