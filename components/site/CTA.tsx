import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/app_contenu.js`, bloc `CTA`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const CTA: React.FC = () => {
  const { language: lang } = useLanguage();

  const t = lang === 'en' ? {
    num: '№ 05 · Correspondence',
    title: <>Ship Salesforce like it’s <em>already shipped</em>.</>,
    sub: 'A 30-minute conversation with Sophie and one of our architects. We walk through your pipeline, your team, and the two or three places the ensemble can absorb work this quarter.',
    btn: 'Talk to Sophie', ghost: 'Read the journal',
  } : {
    num: '№ 05 · Correspondance',
    title: <>Votre Salesforce livré comme s’il était <em>déjà en production</em>.</>,
    sub: 'Trente minutes avec Sophie et l’un de nos architectes. Nous parcourons votre pipeline, votre équipe, et les deux ou trois endroits où l’ensemble peut reprendre du travail dès ce trimestre.',
    btn: 'Parler à Sophie', ghost: 'Lire le journal',
  };
  return (
    <section id="cta" className="cta">
      <div className="wrap">
        <div className="eyebrow" style={{display:'block', marginBottom:24}}>{t.num}</div>
        <div className="cta-body">
          <div>
            <h2>{t.title}</h2>
            <p>{t.sub}</p>
          </div>
          <div className="actions">
            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLElement>('.sophie-launcher')?.click(); window.scrollTo({top:0, behavior:'smooth'}); }} className="cta-btn">{t.btn} <span className="ar">→</span></a>
            <a href="https://digital-humans.fr/journal" className="btn-ghost" style={{justifyContent:'space-between'}}>{t.ghost} <span className="ar">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
