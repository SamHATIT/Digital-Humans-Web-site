import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Manifesto: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="manifesto" className="py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-800 dark:text-white">
                    {t('manifesto.title')}
                </h2>
                
                <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    <p className="text-cyan-500 dark:text-cyan-400 font-bold text-xl">
                        {t('manifesto.believe')}
                    </p>
                    
                    <p>{t('manifesto.line1')}</p>
                    <p>{t('manifesto.line2')}</p>
                    
                    <p className="text-cyan-500 dark:text-cyan-400 font-semibold">
                        {t('manifesto.line3')}
                    </p>
                    
                    <div className="h-4"></div>
                    
                    <p>{t('manifesto.line4')}</p>
                    
                    <p className="text-cyan-500 dark:text-cyan-400 font-semibold">
                        {t('manifesto.line5')}
                    </p>
                    
                    <div className="h-4"></div>
                    
                    <p>{t('manifesto.line6')}</p>
                    
                    <p className="text-cyan-500 dark:text-cyan-400 font-semibold">
                        {t('manifesto.line7')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
