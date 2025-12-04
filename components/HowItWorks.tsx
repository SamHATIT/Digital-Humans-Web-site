import React from 'react';
import { BusinessAnalystIcon, QAEgineerIcon, DeveloperIcon, DevOpsIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
    const { t } = useLanguage();
    
    const steps = [
        { titleKey: 'howItWorks.step1.title', descKey: 'howItWorks.step1.desc', icon: BusinessAnalystIcon },
        { titleKey: 'howItWorks.step2.title', descKey: 'howItWorks.step2.desc', icon: QAEgineerIcon },
        { titleKey: 'howItWorks.step3.title', descKey: 'howItWorks.step3.desc', icon: DeveloperIcon },
        { titleKey: 'howItWorks.step4.title', descKey: 'howItWorks.step4.desc', icon: DevOpsIcon },
    ];

    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-800/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{t('howItWorks.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block" aria-hidden="true"></div>
                    <div className="space-y-12 md:space-y-0">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                                    <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full bg-sky-500 text-white font-bold text-lg mb-4`}>
                                        {index + 1}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t(step.titleKey)}</h3>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t(step.descKey)}</p>
                                </div>
                                <div className={`relative flex items-center justify-center my-4 md:my-0`}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block w-4 h-4 rounded-full bg-sky-500 z-10 ${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}></div>
                                </div>
                                <div className={`md:w-5/12 flex ${index % 2 === 0 ? 'md:justify-start md:pl-12' : 'md:justify-end md:pr-12'}`}>
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                                        <step.icon className="w-16 h-16 text-sky-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
