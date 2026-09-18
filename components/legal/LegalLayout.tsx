import React from 'react';
import Header from '../site/Header';
import Footer from '../site/Footer';
import SophieChat from '../site/SophieChat';
import LegalPage from './LegalPage';
import { LegalSlug } from '../../content/legal';

// Porte depuis `_contenu-source/legal_data.js`, bloc `LegalLayout`.
// Le bundle allait chercher Header/Footer/SophieChat sur `window` ; ici ce sont
// des imports. Le balisage rendu est identique.
const LegalLayout: React.FC<{ slug: LegalSlug }> = ({ slug }) => (
  <div data-screen-label={'Legal · ' + slug}>
    <Header/>
    <main className="legal-main">
      <div className="wrap legal-wrap">
        <LegalPage slug={slug}/>
      </div>
    </main>
    <Footer/>
    <SophieChat/>
  </div>
);

export default LegalLayout;
