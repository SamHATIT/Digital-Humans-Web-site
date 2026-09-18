import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PROJECTS, COVER } from '../../content/projects';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/app_contenu.js`, bloc `OurWork`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const OurWork: React.FC = () => {
  const { language: lang } = useLanguage();

  const scrollerRef = React.useRef(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const i = Math.round(el.scrollLeft / w);
        const total = PROJECTS.length;
        const clamped = Math.max(0, Math.min(total - 1, i));
        setActiveIdx(clamped);
      });
    };
    el.addEventListener('scroll', onScroll, {passive: true});
    return () => { el.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  const goTo = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = PROJECTS.length;
    const clamped = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({left: clamped * el.clientWidth, behavior: 'smooth'});
  };

  const onSlideTap = (e) => {
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) return;
    e.currentTarget.classList.toggle('flipped');
  };

  const t = lang === 'en'
    ? { num: '№ 03 · The work',
        title: (<>Whatever theatre of work, <em>one rim rule</em>, Quality.</>),
        lede: 'Each engagement is a single Salesforce solution composed by the ensemble. Six are public ; the rest live behind NDAs we are happy to honour.',
        cta: 'Read the SDS', soon: 'SDS · coming soon' }
    : { num: '№ 03 · L’atelier',
        title: (<>Quel que soit le théâtre d’opérations, une seule règle d’or : la <em>Qualité</em>.</>),
        lede: 'Chaque mission est une solution Salesforce composée par l’ensemble. Six sont publiques ; les autres vivent derrière des NDA que nous honorons volontiers.',
        cta: 'Lire le SDS', soon: 'SDS · bientôt' };

  const isFirst = activeIdx === 0;
  const isLast = activeIdx === PROJECTS.length - 1;

  return (
    <section id="work" className="block">
      <div className="wrap">
        <div className="section-head">
          <div className="num">{t.num}</div>
          <div>
            <h2>{t.title}</h2>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="sequence-container work-sequence">
          <div className="steps work-steps" ref={scrollerRef}>
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="step work-slide" onClick={onSlideTap}>
                <div className="work-flip">
                  <div className="work-face work-face-front">
                    <img className="work-cover-img" src={COVER(p.id)} alt={p.title[lang]} loading="lazy"/>
                    <div className="work-cover-gradient"></div>
                    <div className="work-cover-overlay">
                      <div className="work-eyebrow">
                        <span className="work-roman">{p.roman}</span>
                        <span className="work-sep"> · </span>
                        <span>{p.industry[lang]}</span>
                      </div>
                      <h3 className="work-title">{p.title[lang]}</h3>
                    </div>
                  </div>
                  <div className="work-face work-face-back">
                    <div className="work-eyebrow">
                      <span className="work-roman">{p.roman}</span>
                      <span className="work-sep"> · </span>
                      <span>{p.industry[lang]}</span>
                    </div>
                    <h3 className="work-title">{p.title[lang]}</h3>
                    <ul className="work-scope">
                      {p.scope.map((s, k) => (<li key={k}>{s}</li>))}
                    </ul>
                    <p className="work-punch">{p.punchline[lang]}</p>
                    {p.sds_url
                      ? (<a href={p.sds_url} className="work-cta" target="_blank" rel="noopener">{t.cta}<span className="ar"> →</span></a>)
                      : (<span className="work-soon">{t.soon}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="seq-arrow seq-prev" onClick={() => goTo(activeIdx - 1)} disabled={isFirst} aria-label="Previous project">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <button className="seq-arrow seq-next" onClick={() => goTo(activeIdx + 1)} disabled={isLast} aria-label="Next project">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
        <div className="seq-dots" role="tablist" aria-label="Project navigation">
          {PROJECTS.map((p, i) => (
            <button key={p.id}
              role="tab"
              className={'seq-dot' + (i === activeIdx ? ' active' : '')}
              style={{'--c': 'var(--brass)'}}
              onClick={() => goTo(i)}
              aria-label={'Project ' + p.roman}
              aria-selected={i === activeIdx ? 'true' : 'false'}
              aria-current={i === activeIdx ? 'true' : 'false'}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurWork;
