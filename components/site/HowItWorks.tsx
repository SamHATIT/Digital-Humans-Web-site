import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AV } from '../../content/avatars';
// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/benefits_howitworks.js`, bloc `HowItWorks`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const HowItWorks: React.FC = () => {
  const { language: lang } = useLanguage();


  const t = lang === 'en' ? {
    num: '№ 02 · The sequence',
    title: (<>A <em>five-act</em> production.</>),
    lede: 'Every engagement follows the same score. The ensemble shifts; the sequence does not. Scroll through the five acts.',
    steps: [
      {r:'I', c:'var(--indigo)', t:(<>Direction <em>sets scope</em></>),
        d:'A 30-minute brief with your sponsor. Sophie returns a signed scope document and a staffing plan within the hour.',
        detail:(<><span className="k">in</span>  brief.md, stakeholders.yaml<br/><span className="k">out</span> scope.v1.md <span className="pass">✓ signed</span><br/><span className="k">ttl</span> 00:47:12</>),
        agents:[{n:'Sophie Chen', role:'Project Manager · Orchestrator', ac:'#8B5CF6', av:'sophie', lines:['Sophie never speaks louder than necessary.','While you sleep, she reads your requirements. 300 pages in 4 minutes.']}]},
      {r:'II', c:'var(--plum)', t:(<>Visionaries <em>draft</em></>),
        d:'Business Analyst, Architect, and Research compose an SDS and reference design — both drafts are on your desk within the first day.',
        detail:(<><span className="k">out</span> sds.v1.md, adr-*.md<br/><span className="k">out</span> reference-design.fig<br/><span className="pass">✓ 14 passed</span>  <span className="run">2 in review</span></>),
        agents:[
          {n:'Olivia Parker', role:'Business Analyst · The Interpreter', ac:'#3B82F6', av:'olivia', lines:['Olivia understands what you really want. Even when you don’t know how to explain it.']},
          {n:'Marcus Johnson', role:'Solution Architect · The Builder of Shapes', ac:'#F97316', av:'marcus', lines:['Marcus transforms needs into architecture. ADRs. Patterns. Solid decisions.']},
          {n:'Emma Rodriguez', role:'Research Analyst · The Verifier', ac:'#06B6D4', av:'emma',   lines:['Emma verifies at each team decision that the proposed solution matches your request.','Zero ambiguity. Zero interpretation.']},
        ]},
      {r:'III', c:'var(--terra)', t:(<>Builders <em>compose</em></>),
        d:'Apex, LWC, and Admin work in parallel against the SDS. Each commit carries a test suite, a changelog entry, and an architect approval.',
        detail:(<><span className="k">branch</span> feature/*<br/><span className="k">coverage</span> <span className="pass">94%</span><br/><span className="k">reviews</span> MJ +3 · <span className="pass">approved</span></>),
        agents:[
          {n:'Diego Martinez', role:'Apex Developer · The Pianist', ac:'#EF4444', av:'diego', lines:['Diego writes Apex code like a pianist. Bulkified. Efficient. 94.3% coverage.']},
          {n:'Zara Thompson', role:'LWC Developer · The Painter', ac:'#22C55E', av:'zara',  lines:['Zara paints LWC interfaces. “Why didn’t we do this before?”']},
          {n:'Raj Patel', role:'Administrator · The No-Code Wizard', ac:'#EAB308', av:'raj',   lines:['Raj configures without coding. “Code is for complex cases.”']},
        ]},
      {r:'IV', c:'var(--sage)', t:(<>Guardians <em>witness</em></>),
        d:'QA ruthlessly regresses against the SDS. Data Migration prepares cutover artefacts. Nothing moves to Stage without a clean sheet.',
        detail:(<><span className="k">regression</span> <span className="pass">0 critical</span><br/><span className="k">migration</span> dry-run <span className="pass">ok</span><br/><span className="k">sign-off</span> EV <span className="pass">✓</span></>),
        agents:[
          {n:'Aisha Okonkwo', role:'Data Specialist · The Curator', ac:'#92400E', av:'aisha', lines:['Aisha migrates your data without losing a comma. 2 million records? 12 minutes.']},
          {n:'Elena Vasquez', role:'QA Engineer · The Guardian', ac:'#6B7280', av:'elena', lines:['Elena tests what no one thinks to test. 89% coverage. Systematically.']},
        ]},
      {r:'V', c:'var(--slate)', t:(<>The Stage <em>delivers</em></>),
        d:'DevOps ships. The Trainer ships the humans. You wake up on Monday with a production org and a team who already know how to use it.',
        detail:(<><span className="k">deploy</span> prod @ 03:14 <span className="pass">✓</span><br/><span className="k">runbook</span> handed off<br/><span className="k">training</span> 4 sessions booked</>),
        agents:[
          {n:'Jordan Blake', role:'DevOps Engineer · The Stagehand', ac:'#1E40AF', av:'jordan', lines:['Jordan deploys stress-free. CI/CD. GitHub. Production in 8 minutes.']},
          {n:'Lucas Fernandez', role:'Trainer · The Transmitter', ac:'#D946EF', av:'lucas',  lines:['Lucas trains your teams. Zero resistance to change.']},
        ]},
    ],
  } : {
    num: '№ 02 · La séquence',
    title: (<>Une pièce <em>en cinq actes</em>.</>),
    lede: 'Chaque mission suit la même partition. L’ensemble change ; la séquence, jamais. Déroulez les cinq actes.',
    steps: [
      {r:'I', c:'var(--indigo)', t:(<>La Direction fixe le <em>cap</em></>),
        d:'Un brief de 30 minutes avec votre sponsor. Sophie vous renvoie un cadrage signé et un plan d’équipe dans l’heure.',
        detail:(<><span className="k">in</span>  brief.md<br/><span className="k">out</span> scope.v1.md <span className="pass">✓ signé</span><br/><span className="k">ttl</span> 00:47:12</>),
        agents:[{n:'Sophie Chen', role:'Cheffe de projet · L’Orchestratrice', ac:'#8B5CF6', av:'sophie', lines:['Sophie ne parle jamais plus fort que nécessaire.','Pendant que vous dormez, elle lit votre cahier des charges. 300 pages en 4 minutes.']}]},
      {r:'II', c:'var(--plum)', t:(<>Les Visionnaires <em>esquissent</em></>),
        d:'L’analyste, l’architecte et la recherche composent un SDS et un design de référence — les deux brouillons sur votre bureau dès le premier jour.',
        detail:(<><span className="k">out</span> sds.v1.md<br/><span className="pass">✓ 14 validés</span></>),
        agents:[
          {n:'Olivia Parker', role:'Analyste métier · L’Interprète', ac:'#3B82F6', av:'olivia', lines:['Olivia comprend ce que vous voulez vraiment. Même quand vous ne savez pas le dire.']},
          {n:'Marcus Johnson', role:'Architecte solution · Le Façonneur', ac:'#F97316', av:'marcus', lines:['Marcus change les besoins en architecture. ADR, patterns, décisions nettes.']},
          {n:'Emma Rodriguez', role:'Analyste recherche · La Vérificatrice', ac:'#06B6D4', av:'emma',   lines:['À chaque décision de l’ensemble, Emma vérifie que la solution colle à votre demande.','Zéro ambiguïté. Zéro interprétation.']},
        ]},
      {r:'III', c:'var(--terra)', t:(<>Les Bâtisseurs <em>composent</em></>),
        d:'Apex, LWC et Admin avancent en parallèle, fidèles au SDS. Chaque commit porte sa suite de tests, son entrée de changelog et l’aval d’un architecte.',
        detail:(<><span className="k">coverage</span> <span className="pass">94%</span><br/><span className="k">reviews</span> MJ <span className="pass">✓</span></>),
        agents:[
          {n:'Diego Martinez', role:'Développeur Apex · Le Pianiste', ac:'#EF4444', av:'diego', lines:['Diego écrit l’Apex comme on joue du piano. Bulkifié, sobre, 94,3 % de couverture.']},
          {n:'Zara Thompson', role:'Développeuse LWC · La Peintre', ac:'#22C55E', av:'zara',  lines:['Zara peint les interfaces LWC. « Pourquoi ne l’avons-nous pas fait plus tôt ? »']},
          {n:'Raj Patel', role:'Administrateur · Le Magicien No-Code', ac:'#EAB308', av:'raj',   lines:['Raj configure sans écrire une ligne. « Le code, c’est pour les cas complexes. »']},
        ]},
      {r:'IV', c:'var(--sage)', t:(<>Les Gardiens <em>attestent</em></>),
        d:'La QA régresse sans pitié contre le SDS. La migration prépare les artefacts de bascule. Rien ne monte sur la Scène sans un sans-faute.',
        detail:(<><span className="k">regression</span> <span className="pass">0 critique</span><br/><span className="k">sign-off</span> EV <span className="pass">✓</span></>),
        agents:[
          {n:'Aisha Okonkwo', role:'Spécialiste data · La Curatrice', ac:'#92400E', av:'aisha', lines:['Aisha migre vos données sans en perdre une virgule. 2 millions d’enregistrements ? 12 minutes.']},
          {n:'Elena Vasquez', role:'Ingénieure QA · La Gardienne', ac:'#6B7280', av:'elena', lines:['Elena teste ce que personne ne pense à tester. 89 % de couverture. Méthodiquement.']},
        ]},
      {r:'V', c:'var(--slate)', t:(<>La Scène <em>livre</em></>),
        d:'Le DevOps livre la machine. Le Passeur livre les hommes. Lundi, vous vous réveillez avec un org en production et une équipe qui sait déjà s’en servir.',
        detail:(<><span className="k">deploy</span> prod <span className="pass">✓</span><br/><span className="k">training</span> 4 sessions</>),
        agents:[
          {n:'Jordan Blake', role:'Ingénieur DevOps · Le Machiniste', ac:'#1E40AF', av:'jordan', lines:['Jordan déploie sans la moindre tension. CI/CD, GitHub, production en 8 minutes.']},
          {n:'Lucas Fernandez', role:'Formateur · Le Passeur', ac:'#D946EF', av:'lucas',  lines:['Lucas forme vos équipes. Zéro résistance au changement.']},
        ]},
    ],
  };
  const {useState, useEffect, useRef} = React;
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (idx) => {
    const el = scrollerRef.current;
    if (!el) return;
    const total = t.steps.length;
    const clamped = Math.max(0, Math.min(total - 1, idx));
    el.scrollTo({left: clamped * el.clientWidth, behavior: 'smooth'});
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIdx(idx);
      });
    };
    el.addEventListener('scroll', onScroll, {passive: true});
    return () => { el.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  const isFirst = activeIdx === 0;
  const isLast = activeIdx === t.steps.length - 1;

  return (
    <section id="how" className="block">
      <div className="wrap">
        <div className="section-head">
          <div className="num">{t.num}</div>
          <div>
            <h2>{t.title}</h2>
            <p className="lede">{t.lede}</p>
          </div>
        </div>
        <div className="sequence-container">
          <div className="steps" ref={scrollerRef}>
            {t.steps.map((s,i) => (
              <div key={i} className="step">
                <div className="step-head">
                  <div className="num">{s.r}</div>
                  <div className="step-title"><h3>{s.t}</h3></div>
                </div>
                <div className="step-body">
                  <div className="step-photo-col">
                    {s.agents.map((a,j) => (
                      <div key={j} className="agent-card" style={{'--ac': a.ac || 'var(--brass)'}}>
                        <div className="hero-photo"><img src={AV(a.av)} alt={a.n}/></div>
                        <div className="hero-meta">
                          <div className="hero-name">{a.n}</div>
                          <div className="hero-role"><span className="role-label">{a.role.split(' · ')[0]}</span>{a.role.includes(' · ') && (<span className="role-tag">{a.role.split(' · ').slice(1).join(' · ')}</span>)}</div>
                          {a.lines.map((ln,k) => (<div key={k} className="hero-line">{ln}</div>))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="step-meta-col">
                    <div className="detail">{s.detail}</div>
                    <div className="step-desc">{s.d}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="seq-arrow seq-prev" onClick={() => goTo(activeIdx - 1)} disabled={isFirst} aria-label="Previous act">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <button className="seq-arrow seq-next" onClick={() => goTo(activeIdx + 1)} disabled={isLast} aria-label="Next act">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
        <div className="seq-dots" role="tablist" aria-label="Act navigation">
          {t.steps.map((s,i) => (
            <button
              key={i}
              role="tab"
              className={'seq-dot' + (i === activeIdx ? ' active' : '')}
              style={{'--c': s.c}}
              onClick={() => goTo(i)}
              aria-label={'Act ' + s.r}
              aria-selected={i === activeIdx ? 'true' : 'false'}
              aria-current={i === activeIdx ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
