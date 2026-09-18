import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ENSEMBLE } from '../../content/agents';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/app_contenu.js`, bloc `OurAgents`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const OurAgents: React.FC = () => {
  const { language: lang } = useLanguage();

  const t = lang === 'en'
    ? {num: '№ 03 · The ensemble', title: <>Eleven <em>portraits</em>, one rim rule.</>, lede: 'Five acts. One group accent per act. Identity never fills — it rims. State always wins over identity.'}
    : {num: '№ 03 · L’ensemble', title: <>Onze <em>portraits</em>, une règle.</>, lede: 'Cinq actes. Un accent par groupe. L’identité ne remplit jamais — elle borde. L’état l’emporte toujours.'};
  return (
    <section id="agents" className="block">
      <div className="wrap">
        <div className="section-head">
          <div className="num">{t.num}</div>
          <div>
            <h2>{t.title}</h2>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="roster">
          {ENSEMBLE.map(a => (
            <div key={a.n} className="agent" data-act={a.act} style={{'--c': a.c}}>
              <div className="av"><img src={a.a} alt={a.n}/></div>
              <div className="nm">{a.n}</div>
              <div className="rl">{a[lang]}</div>
            </div>
          ))}
        </div>
        <div className="legend">
          <span className="k" style={{'--k':'var(--indigo)'}}>Act I · Direction</span>
          <span className="k" style={{'--k':'var(--plum)'}}>Act II · Visionaries</span>
          <span className="k" style={{'--k':'var(--terra)'}}>Act III · Builders</span>
          <span className="k" style={{'--k':'var(--sage)'}}>Act IV · Guardians</span>
          <span className="k" style={{'--k':'var(--slate)'}}>Act V · Stage · DevOps</span>
          <span className="k" style={{'--k':'var(--ochre)'}}>Act V · Stage · Trainer</span>
        </div>
      </div>
    </section>
  );
};

export default OurAgents;
