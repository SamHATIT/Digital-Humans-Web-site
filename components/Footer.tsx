import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <footer className="py-8 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t('footer.copyright')}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
