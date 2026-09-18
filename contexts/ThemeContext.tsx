import React, { createContext, useState, useEffect, useContext } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Conventions reprises du site en ligne : le theme est memorise dans
 * `localStorage['dh-theme']` et pose sur `document.documentElement.dataset.theme`
 * (`:root[data-theme="light"]` dans `styles/site.css`). La classe `.dark` est
 * maintenue en parallele : `styles/blog.css`, heritee de janvier, s’appuie dessus.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('dh-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* stockage indisponible */ }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('dh-theme', theme); } catch (e) { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit etre utilise a l’interieur d’un ThemeProvider');
  }
  return context;
};
