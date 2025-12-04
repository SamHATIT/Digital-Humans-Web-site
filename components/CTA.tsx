import React from 'react';
import { ArrowRightIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const CTA: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <section id="cta" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-10 md:p-16 text-center overflow-hidden">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('cta.title')}</h2>
                        <p className="mt-4 text-lg text-sky-100 max-w-2xl mx-auto">{t('cta.subtitle')}</p>
                        <div className="mt-8">
                            <a href="mailto:contact@digital-humans.fr" className="inline-flex items-center bg-white text-sky-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-sky-50 transition-all duration-300 transform hover:scale-105 shadow-lg group">
                                {t('cta.button')} <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
