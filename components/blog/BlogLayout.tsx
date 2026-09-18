import React, { useEffect } from 'react';
import Header from '../site/Header';
import Footer from '../site/Footer';

// Enveloppe des routes /blog heritees de janvier. Le journal publie vit
// aujourd'hui hors du depot (https://digital-humans.fr/journal, Ghost) ; ces
// routes restent montees comme plomberie, sans contenu porte.
//
// BlogList et BlogArticle sont ecrits en classes utilitaires Tailwind. Le CDN
// Tailwind etait charge dans index.html en janvier ; il en est retire parce que
// son reset (preflight) ecrase la feuille du site en ligne et qu'il journalise
// un avertissement en console (test B.3.5). Il est donc charge a la demande,
// sur ces seules routes, pour ne rien casser du blog en attendant sa reprise.
const TAILWIND_CDN = 'https://cdn.tailwindcss.com';

const BlogLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${TAILWIND_CDN}"]`)) return;
    const s = document.createElement('script');
    s.src = TAILWIND_CDN;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="blog-shell">
      <Header/>
      <main className="blog-main">{children}</main>
      <Footer/>
    </div>
  );
};

export default BlogLayout;
