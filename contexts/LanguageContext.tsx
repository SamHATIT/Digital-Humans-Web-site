import React, { createContext, useState, useEffect, useContext } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.benefits': 'Benefits',
    'nav.howItWorks': 'How It Works',
    'nav.agents': 'Our Agents',
    'nav.demo': 'Request a Demo',
    
    // Hero
    'hero.title': 'The Future of Salesforce Development is Here.',
    'hero.subtitle': 'Our multi-agent AI system automates the entire Salesforce lifecycle, delivering complex solutions with superhuman speed and precision.',
    'hero.cta': 'Get Started',
    
    // Benefits
    'benefits.title': 'Why Choose Digital-Humans.fr?',
    'benefits.subtitle': 'We upgrade Salesforce consulting models with efficient, predictable, and AI-driven automation.',
    'benefits.accelerated.title': 'Accelerated Delivery',
    'benefits.accelerated.desc': 'Reduce project timelines from months to days with 24/7 AI-driven development.',
    'benefits.accuracy.title': 'Enhanced Accuracy',
    'benefits.accuracy.desc': 'Minimize human error with systematic, AI-managed code, configuration & documentation.',
    'benefits.costs.title': 'Reduced Costs',
    'benefits.costs.desc': 'Lower consulting fees and total cost of ownership through efficient automation.',
    'benefits.security.title': 'Transparency & Security',
    'benefits.security.desc': 'All interactions are logged and traceable. You set the rules and control them.',
    
    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'A seamless, four-step process from requirements to deployment.',
    'howItWorks.step1.title': 'AI-Powered Analysis',
    'howItWorks.step1.desc': 'Our AI Business Analyst & Solution Architect ingest your requirements and generate a comprehensive project specification, based on Salesforce Best Practices.',
    'howItWorks.step2.title': 'Client Validation',
    'howItWorks.step2.desc': 'You review and approve the detailed documentation, ensuring perfect alignment before a single line of code is written.',
    'howItWorks.step3.title': 'Automated Development',
    'howItWorks.step3.desc': 'Our multi-agent team collaborates to build, configure, and test your solution with unparalleled speed and precision.',
    'howItWorks.step4.title': 'Seamless Deployment',
    'howItWorks.step4.desc': 'The AI DevOps Engineer packages and deploys the solution directly to your Salesforce org using modern SFDX practices.',
    
    // Agents
    'agents.title': 'Your Dedicated AI Team',
    'agents.subtitle': 'Meet the specialized agents that form our autonomous development workforce.',
    'agent.sophie.role': 'Project Manager',
    'agent.sophie.desc': 'Your key partner for aligning vision, team and results.',
    'agent.olivia.role': 'Business Analyst',
    'agent.olivia.desc': 'Defines requirements and scope.',
    'agent.marcus.role': 'Solution Architect',
    'agent.marcus.desc': 'Designs the optimal Salesforce solution.',
    'agent.diego.role': 'Apex Developer',
    'agent.diego.desc': 'Writes robust backend logic.',
    'agent.zara.role': 'LWC Developer',
    'agent.zara.desc': 'Builds modern, responsive UI.',
    'agent.raj.role': 'Administrator',
    'agent.raj.desc': 'Configures Salesforce declaratively.',
    'agent.elena.role': 'QA Engineer',
    'agent.elena.desc': 'Ensures quality and performance.',
    'agent.jordan.role': 'DevOps Engineer',
    'agent.jordan.desc': 'Manages CI/CD and deployment.',
    'agent.aisha.role': 'Data Migration Specialist',
    'agent.aisha.desc': 'Handles complex data transfers.',
    'agent.lucas.role': 'Trainer',
    'agent.lucas.desc': 'Creates user-training materials.',
    
    // CTA
    'cta.title': 'Ready to Transform Your Salesforce Projects?',
    'cta.subtitle': "Get in touch to see how our AI team can accelerate your next implementation. Let's build the future, together.",
    'cta.button': 'Request a Demo',
    
    // Footer
    'footer.copyright': '© 2024 Digital-Humans.fr. All rights reserved.',
  },
  fr: {
    // Header
    'nav.benefits': 'Avantages',
    'nav.howItWorks': 'Comment ça marche',
    'nav.agents': 'Nos Agents',
    'nav.demo': 'Demander une démo',
    
    // Hero
    'hero.title': "L'Avenir du Développement Salesforce est Là.",
    'hero.subtitle': 'Notre système IA multi-agents automatise tout le cycle Salesforce, livrant des solutions complexes avec une vitesse et une précision surhumaines.',
    'hero.cta': 'Commencer',
    
    // Benefits
    'benefits.title': 'Pourquoi Choisir Digital-Humans.fr ?',
    'benefits.subtitle': 'Nous améliorons les modèles de conseil Salesforce avec une automatisation efficace, prévisible et pilotée par l\'IA.',
    'benefits.accelerated.title': 'Livraison Accélérée',
    'benefits.accelerated.desc': 'Réduisez les délais de projet de plusieurs mois à quelques jours grâce au développement IA 24/7.',
    'benefits.accuracy.title': 'Précision Améliorée',
    'benefits.accuracy.desc': 'Minimisez les erreurs humaines avec du code, de la configuration et de la documentation gérés systématiquement par l\'IA.',
    'benefits.costs.title': 'Coûts Réduits',
    'benefits.costs.desc': 'Réduisez les frais de conseil et le coût total de possession grâce à une automatisation efficace.',
    'benefits.security.title': 'Transparence & Sécurité',
    'benefits.security.desc': 'Toutes les interactions sont journalisées et traçables. Vous définissez les règles et les contrôlez.',
    
    // How It Works
    'howItWorks.title': 'Comment Ça Marche',
    'howItWorks.subtitle': 'Un processus fluide en quatre étapes, des exigences au déploiement.',
    'howItWorks.step1.title': 'Analyse par l\'IA',
    'howItWorks.step1.desc': 'Notre Business Analyst et Solution Architect IA analysent vos besoins et génèrent une spécification projet complète, basée sur les meilleures pratiques Salesforce.',
    'howItWorks.step2.title': 'Validation Client',
    'howItWorks.step2.desc': 'Vous examinez et approuvez la documentation détaillée, garantissant un alignement parfait avant qu\'une seule ligne de code ne soit écrite.',
    'howItWorks.step3.title': 'Développement Automatisé',
    'howItWorks.step3.desc': 'Notre équipe multi-agents collabore pour construire, configurer et tester votre solution avec une vitesse et une précision inégalées.',
    'howItWorks.step4.title': 'Déploiement Fluide',
    'howItWorks.step4.desc': 'L\'ingénieur DevOps IA package et déploie la solution directement dans votre org Salesforce en utilisant les pratiques SFDX modernes.',
    
    // Agents
    'agents.title': 'Votre Équipe IA Dédiée',
    'agents.subtitle': 'Découvrez les agents spécialisés qui forment notre équipe de développement autonome.',
    'agent.sophie.role': 'Chef de Projet',
    'agent.sophie.desc': 'Votre partenaire clé pour aligner vision, équipe et résultats.',
    'agent.olivia.role': 'Business Analyst',
    'agent.olivia.desc': 'Définit les exigences et le périmètre.',
    'agent.marcus.role': 'Architecte Solution',
    'agent.marcus.desc': 'Conçoit la solution Salesforce optimale.',
    'agent.diego.role': 'Développeur Apex',
    'agent.diego.desc': 'Écrit la logique backend robuste.',
    'agent.zara.role': 'Développeuse LWC',
    'agent.zara.desc': 'Construit des interfaces modernes et réactives.',
    'agent.raj.role': 'Administrateur',
    'agent.raj.desc': 'Configure Salesforce de manière déclarative.',
    'agent.elena.role': 'Ingénieure QA',
    'agent.elena.desc': 'Assure la qualité et la performance.',
    'agent.jordan.role': 'Ingénieur DevOps',
    'agent.jordan.desc': 'Gère le CI/CD et le déploiement.',
    'agent.aisha.role': 'Spécialiste Migration',
    'agent.aisha.desc': 'Gère les transferts de données complexes.',
    'agent.lucas.role': 'Formateur',
    'agent.lucas.desc': 'Crée les supports de formation utilisateurs.',
    
    // CTA
    'cta.title': 'Prêt à Transformer Vos Projets Salesforce ?',
    'cta.subtitle': 'Contactez-nous pour voir comment notre équipe IA peut accélérer votre prochaine implémentation. Construisons l\'avenir, ensemble.',
    'cta.button': 'Demander une Démo',
    
    // Footer
    'footer.copyright': '© 2024 Digital-Humans.fr. Tous droits réservés.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }
    // Check localStorage first
    const saved = localStorage.getItem('language');
    if (saved === 'fr' || saved === 'en') {
      return saved;
    }
    // Auto-detect from browser
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('fr') ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
