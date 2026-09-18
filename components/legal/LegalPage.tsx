import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { LEGAL_DATA, LegalSlug } from '../../content/legal';
// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/legal_data.js`, bloc `LegalPage`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
// Le lien de retour passe par `Link` : navigation SPA. Texte inchange.
const LegalPage: React.FC<{ slug: LegalSlug }> = ({ slug }) => {
  const { language: lang } = useLanguage();

  const entry = LEGAL_DATA[slug];
  const data = (entry && entry[lang]) || (entry && entry['en']);
  if (!data) {
    return <div className="legal-404"><h1>Page not found</h1></div>;
  }
  // Update document title once on render
  React.useEffect(() => {
    document.title = data.title + ' · Digital·Humans';
  }, [data.title]);
  return (
    <article className="legal-doc">
      <header className="legal-head">
        <div className="num">{
          slug === 'legal' ? (lang === 'en' ? '№ 99 · Legal' : '№ 99 · Mentions') :
          slug === 'cgv' ? (lang === 'en' ? '№ 98 · Terms' : '№ 98 · CGV') :
          (lang === 'en' ? '№ 97 · Privacy' : '№ 97 · Confidentialité')
        }</div>
        <h1>{data.title}</h1>
        <p className="legal-updated">{data.updated}</p>
      </header>
      <nav className="legal-toc" aria-label={lang === 'en' ? 'On this page' : 'Sur cette page'}>
        <div className="legal-toc-label">{lang === 'en' ? 'On this page' : 'Sur cette page'}</div>
        <ol>
          {data.sections.map((s, i) => (
            <li key={i}><a href={'#sec-' + i}>{s.h}</a></li>
          ))}
        </ol>
      </nav>
      <div className="legal-body">
        {data.sections.map((s, i) => (
          <section key={i} id={'sec-' + i} className="legal-section">
            <h2>{s.h}</h2>
            {s.p.map((para, j) => (
              <p key={j} dangerouslySetInnerHTML={{__html: para}}/>
            ))}
          </section>
        ))}
      </div>
      <div className="legal-foot">
        <Link to="/" className="legal-back">{lang === 'en' ? '← Back to home' : '← Retour à l’accueil'}</Link>
      </div>
    </article>
  );
};

export default LegalPage;
