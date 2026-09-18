import React, { createContext, useState, useEffect, useContext } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Conventions reprises du site en ligne (ressource `0fbb2257-…`, composant `Site`) :
 * la langue est memorisee dans `localStorage['dh-lang']`, a defaut deduite de
 * `navigator.language`, et refletee sur `document.documentElement.lang`.
 *
 * Les textes ne vivent pas ici mais dans les composants et `content/` : le site
 * en ligne porte des dictionnaires locaux contenant du JSX (emphases `<em>`,
 * sauts de ligne). Les aplatir en cles de traduction reviendrait a retaper le
 * contenu, ce que le portage interdit.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('dh-lang');
      if (saved === 'fr' || saved === 'en') return saved;
    } catch (e) { /* stockage indisponible : on retombe sur le navigateur */ }
    const nav = (navigator.language || '').toLowerCase();
    return nav.slice(0, 2) === 'fr' ? 'fr' : 'en';
  });

  useEffect(() => {
    try { localStorage.setItem('dh-lang', language); } catch (e) { /* ignore */ }
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage doit etre utilise a l’interieur d’un LanguageProvider');
  }
  return context;
};
