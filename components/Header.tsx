import React from 'react';
import { LogoIcon } from './icons';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <a href="#" aria-label="Home">
                           <LogoIcon className="h-12 w-auto" />
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <nav className="hidden md:flex md:items-center md:space-x-8">
                            <a href="#benefits" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{t('nav.benefits')}</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{t('nav.howItWorks')}</a>
                            <a href="#agents" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{t('nav.agents')}</a>
                        </nav>
                        <a href="#cta" className="hidden md:block bg-sky-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-600 transition-all duration-300 transform hover:scale-105">
                            {t('nav.demo')}
                        </a>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                    <div className="md:hidden">
                        {/* Mobile menu button can be added here if needed */}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
