import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Speed, Accuracy, Cost, Security } from './icons';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/benefits_howitworks.js`, bloc `Benefits`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const Benefits: React.FC = () => {
  const { language: lang } = useLanguage();

  const t = lang === 'en' ? {
    num: '№ 01 · The case',
    title: <>Four <em>promises</em>, measured.</>,
    lede: (<><span style={{letterSpacing:'0.08em', fontWeight: 600}}>WE BELIEVE</span> that Salesforce consulting is evolving, often too slow. too expensive. too rigid. We replace the consultancy pattern — pitch, estimate, staff, wait — with a studio pattern: a standing ensemble, a composed sequence, and a first deliverable on your desk before the first invoice.</>),
    items: [
      {n:'01', t:<>Accelerated <em>delivery</em></>,      d:'Project timelines compress from months to days. The ensemble drafts in parallel and hands you work ready to review — not ready to revise.', I: Speed},
      {n:'02', t:<>Systematic <em>accuracy</em></>,       d:'Every deliverable passes through QA and Architecture before it reaches you. Human error is a systemic failure, not a line item.', I: Accuracy},
      {n:'03', t:<>Honest <em>economics</em></>,          d:'A flat engagement fee, a fixed deliverable sequence, and a measurable reduction in total cost of ownership — typically 40–70%.', I: Cost},
      {n:'04', t:<>Traceable <em>ceremony</em></>,        d:'Every agent decision is logged. Every sign-off is witnessed. You set the rules once; the ensemble enforces them on every pass.', I: Security},
    ],
  } : {
    num: '№ 01 · L\u2019argument',
    title: <>Quatre promesses, <em>mesurées</em>.</>,
    lede: (<><span style={{letterSpacing:'0.08em', fontWeight: 600}}>NOUS CROYONS</span> que le conseil Salesforce doit se réinventer : trop lent, trop cher, trop rigide. Nous remplaçons le schéma du conseil — présentation, devis, mobilisation, attente — par celui du studio : un ensemble permanent, une séquence réglée, un premier livrable sur votre bureau avant la première facture.</>),
    items: [
      {n:'01', t:<>Des délais qui <em>fondent</em></>,      d:'Vos délais passent de mois en jours. L\u2019ensemble rédige en parallèle et vous remet un travail prêt à relire, pas à refaire.', I: Speed},
      {n:'02', t:<>L’exactitude par <em>construction</em></>,    d:'Chaque livrable passe par la QA et l\u2019architecture avant d\u2019arriver entre vos mains. L\u2019erreur humaine est une faille du système, pas une ligne de facture.', I: Accuracy},
      {n:'03', t:<>Une économie <em>franche</em></>,         d:'Un forfait unique, une séquence de livrables fixe, et une baisse mesurable du coût total de possession — de 40 à 70 % en général.', I: Cost},
      {n:'04', t:<>Un cérémonial <em>tracé</em></>,       d:'Chaque décision d\u2019agent est consignée. Chaque validation est contresignée. Vous fixez les règles une fois ; l\u2019ensemble les applique à chaque passe.', I: Security},
    ],
  };
  return (
    <section id="benefits" className="block">
      <div className="wrap">
        <div className="section-head">
          <div className="num">{t.num}</div>
          <div>
            <h2>{t.title}</h2>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="benefits-grid">
          {t.items.map(b => (
            <div key={b.n} className="benefit">
              <div className="num">— Act I · Benefit {b.n}</div>
              <div className="ic"><b.I size={36}/></div>
              <h3>{b.t}</h3>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
