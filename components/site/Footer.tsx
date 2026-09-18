import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/app_contenu.js`, bloc `Footer`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
// Les trois liens legaux passent par `Link` : navigation SPA au lieu d'un
// rechargement complet. Le texte rendu est inchange.
const Footer: React.FC = () => {
  const { language: lang } = useLanguage();

  const left = lang === 'en' ? '— Paris · London · Remote-native' : '— Paris · Londres · Remote-native';
  const cgv  = lang === 'en' ? 'Terms of Sale' : 'CGV';
  const legal= lang === 'en' ? 'Legal'         : 'Mentions légales';
  const priv = lang === 'en' ? 'Privacy'       : 'Confidentialité';
  const aiNote = lang === 'en'
    ? 'Our team is AI and AI can make mistakes. Please double-check responses.'
    : 'Notre équipe est une IA et une IA peut se tromper. Vérifiez ses réponses.';
  return (
    <footer>
      <div className="wrap footer-ai-note">{aiNote}</div>
      <div className="wrap row">
        <span>{left}</span>
        <span className="footer-legal">
          <Link to="/cgv" className="footer-link">{cgv}</Link>
          <span className="footer-sep">·</span>
          <Link to="/legal" className="footer-link">{legal}</Link>
          <span className="footer-sep">·</span>
          <Link to="/privacy" className="footer-link">{priv}</Link>
        </span>
        <span className="r"><a href="mailto:hello@digital-humans.fr" className="footer-mail">hello@digital-humans.fr</a> · MMXXV</span>
      </div>
    </footer>
  );
};

export default Footer;
