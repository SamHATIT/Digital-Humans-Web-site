import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <footer className="bg-slate-100 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-700/50 py-8 px-4 text-center relative z-10">
            <p className="text-lg mb-2">
                <span className="text-cyan-500">Digital-</span>
                <span className="text-slate-800 dark:text-white">Humans.fr</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
                {t('footer.tagline')}
            </p>
            <p className="text-sm text-slate-400">
                📧 <a href="mailto:contact@digital-humans.fr" className="text-cyan-500 hover:text-cyan-400 transition-colors">contact@digital-humans.fr</a>
            </p>
            <p className="text-xs text-slate-400 mt-4">
                {t('footer.copyright')}
            </p>
        </footer>
    );
};

export default Footer;
