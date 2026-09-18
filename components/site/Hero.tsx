import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/header_hero.js`, bloc `Hero`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const Hero: React.FC = () => {
  const { language: lang } = useLanguage();

  const t = lang === 'en' ? {
    eyebrow: 'Dispatch · On the future of the studio',
    title: <>Not a tool. <em>A studio.</em><br/><span style={{fontSize: "0.78em", display: "inline-block"}}>That happens to be autonomous.</span></>,
    sub: 'Eleven specialised agents, one orchestrator, a composed sequence from first brief to production deploy. Digital·Humans is a Salesforce engineering studio that behaves like one — it just never sleeps.',
    primary: 'Talk to Sophie',
    ghost: 'Read the journal',
  } : {
    eyebrow: 'Dépêche · L\u2019avenir du studio',
    title: <>Pas un outil. <em>Un studio.</em><br/><span style={{fontSize: "0.78em", display: "inline-block"}}>Autonome par nature.</span></>,
    sub: 'Onze spécialistes, un chef d\u2019orchestre, une séquence réglée du premier brief au déploiement en production. Digital·Humans est un studio d\u2019ingénierie Salesforce qui en a tous les codes — il ne dort jamais.',
    primary: 'Parler à Sophie',
    ghost: 'Lire le journal',
  };
  return (
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p className="sub">{t.sub}</p>
        <div className="actions">
          <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLElement>('.sophie-launcher')?.click(); }} className="btn-primary lg">{t.primary} <span className="ar">→</span></a>
          <a href="https://digital-humans.fr/journal" className="btn-ghost">{t.ghost} <span className="ar">→</span></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
