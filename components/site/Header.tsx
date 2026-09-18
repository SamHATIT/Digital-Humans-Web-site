import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Porte verbatim depuis le site en ligne du 17/09/2026
// (`_contenu-source/header_hero.js`, bloc `Header`).
// Seuls l'en-tete d'import, la signature et les exports different :
// les props `lang`/`theme` du bundle viennent desormais des contextes.
const Header: React.FC = () => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  const t = lang === 'en'
    ? {benefits:'Benefits', how:'The Sequence', work:'The Work', pact:'The Pact', journal:'Journal', studio:'My Studio', themeLight:'Light mode', themeDark:'Dark mode'}
    : {benefits:'Avantages', how:'La Séquence', work:'L’Atelier', pact:'Le Pacte', journal:'Journal', studio:'Mon Studio', themeLight:'Mode clair', themeDark:'Mode sombre'};
  return (
    <header className="glass">
      <div className="wrap bar">
        <a href="#" className="mk" aria-label="Digital·Humans — Autonomous Studio">
          <span className="wm">Digital<span className="dot">·</span><em>Humans</em></span>
          <span className="tag">Autonomous<br/>Studio · EST MMXXV</span>
        </a>
        <nav className="links">
          <a href="#benefits" className="link">{t.benefits}</a>
          <a href="#how"      className="link">{t.how}</a>
          <a href="#work"     className="link">{t.work}</a>
          <a href="#pricing"  className="link">{t.pact}</a>
          <a href="https://digital-humans.fr/journal" className="link">{t.journal}</a>
          <a href="https://app.digital-humans.fr" className="btn-studio">{t.studio} <span className="ar">→</span></a>
          <button className="lang" onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} aria-label={lang === 'en' ? 'FR · EN — switch to French' : 'EN · FR — passer en anglais'} title={lang === 'en' ? 'Switch language' : 'Changer de langue'}>
            {lang === 'en' ? 'FR' : 'EN'} · {lang === 'en' ? 'EN' : 'FR'}
          </button>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? t.themeDark : t.themeLight}
            title={theme === 'light' ? t.themeDark : t.themeLight}>
            {theme === 'light'
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
