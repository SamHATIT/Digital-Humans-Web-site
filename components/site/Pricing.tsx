import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PRICING_TIERS } from '../../content/pricing';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/app_contenu.js`, bloc `Pricing`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const Pricing: React.FC = () => {
  const { language: lang } = useLanguage();

  const openSophie = (e) => {
    e.preventDefault();
    const launcher = document.querySelector<HTMLElement>('.sophie-launcher');
    if (launcher) launcher.click();
  };

  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
      <div className="section-head">
        <div className="num">{lang==='fr' ? '№ 04 · Le pacte' : '№ 04 · The pact'}</div>
        <div>
          <h2>{lang==='fr'
            ? <>Trois façons de <em>travailler avec nous</em>.</>
            : <>Three ways to <em>work with us</em>.</>}</h2>
          <p className="lede">{lang==='fr'
            ? 'Accès anticipé — nous ouvrons par vagues. Inscrivez-vous pour être prévenu·e.'
            : 'Early access — we’re opening in waves. Get on the list to be notified.'}</p>
        </div>
      </div>

      <div className="pricing-grid">
        {PRICING_TIERS.map((t) => (
          <article key={t.id} className={"pricing-card" + (t.featured ? " is-featured" : "")}>
            <div className="pricing-eyebrow">{t.eyebrow[lang] || t.eyebrow.en}</div>
            <div className="pricing-name">{t.name[lang] || t.name.en}</div>
            <div className="pricing-tagline">{t.tagline[lang] || t.tagline.en}</div>
            <div className="pricing-price">
              <span className="pricing-amount">{t.price[lang] || t.price.en}</span>
              <span className="pricing-period">{t.period[lang] || t.period.en}</span>
              {t.vat && (<span className="pricing-vat">{t.vat[lang] || t.vat.en}</span>)}
            </div>
            <ul className="pricing-bullets">
              {(t.bullets[lang] || t.bullets.en).map((b, i) => (
                <li key={i}><span className="pricing-bullet-mark">—</span><span>{b}</span></li>
              ))}
            </ul>
            {t.note && (
              <div className="pricing-note">{t.note[lang] || t.note.en}</div>
            )}
            {t.disabled ? (
              <span className="pricing-cta is-disabled" aria-disabled="true">
                {t.cta[lang] || t.cta.en}
              </span>
            ) : (
              <button type="button" className="pricing-cta" onClick={() => {
                if (t.id === 'free') {
                  window.location.href = 'https://app.digital-humans.fr/signup';
                } else if (typeof openSophie === 'function') {
                  // Defaut present dans le site en ligne : `openSophie` attend un
                  // evenement et appelle `e.preventDefault()`. Cette branche est
                  // morte aujourd'hui (seule l'offre Free est active, et elle prend
                  // la branche precedente). Non corrige ici : ce lot ne porte que le
                  // contenu, a comportement inchange. Voir docs/PORTAGE_CONTENU_2026.md.
                  // @ts-expect-error appel sans evenement, verbatim du bundle en ligne
                  openSophie();
                }
              }}>
                {t.cta[lang] || t.cta.en}
                <span className="pricing-cta-arrow">→</span>
              </button>
            )}
          </article>
        ))}
      </div>

      <div className="pricing-enterprise">
        <div className="pricing-enterprise-eyebrow">
          {lang==='fr' ? 'PALIER IV · ENTERPRISE' : 'TIER IV · ENTERPRISE'}
        </div>
        <div className="pricing-enterprise-body">
          <div className="pricing-enterprise-text">
            <strong>{lang==='fr' ? 'Sur devis · on-premise.' : 'On request · on-premise.'}</strong>{' '}
            {lang==='fr'
              ? 'Hébergé sur votre infrastructure, LLM au choix (Claude, GPT, Mistral, Llama), personnalisation au niveau projet, SSO, journaux d’audit, mises en production négociées au contrat.'
              : 'Hosted on your infrastructure, your choice of LLM (Claude, GPT, Mistral, Llama), project-level customisation, SSO, audit logs, production deploys negotiated in the contract.'}
          </div>
          <button type="button" className="pricing-enterprise-cta" onClick={openSophie}>
            {lang==='fr' ? 'Nous contacter' : 'Talk to us'}
            <span className="pricing-cta-arrow">→</span>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Pricing;
