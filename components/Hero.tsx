import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
    const { t } = useLanguage();
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        const delays = [200, 400, 600, 800, 1400, 1800, 2400, 3200, 3800, 4400];
        
        delays.forEach((delay, index) => {
            const timer = setTimeout(() => {
                setVisibleLines(index + 1);
            }, delay);
            timers.push(timer);
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    const lines = [
        { key: 'hero.line1', isHighlight: false },
        { key: 'hero.line2', isHighlight: false },
        { key: 'hero.line3', isHighlight: false },
        { key: 'hero.line4', isHighlight: false },
        { key: 'spacer1', isSpacer: true },
        { key: 'hero.line5', isHighlight: false },
        { key: 'hero.line6', isHighlight: false, isBold: true },
        { key: 'spacer2', isSpacer: true },
        { key: 'hero.line7', isHighlight: true },
    ];

    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-12">
            <div className="max-w-3xl mx-auto mb-12 space-y-5">
                {lines.map((line, index) => {
                    if (line.isSpacer) {
                        return <div key={line.key} className={`h-8 ${index < visibleLines ? 'opacity-100' : 'opacity-0'}`}></div>;
                    }
                    
                    const baseClasses = "transition-all duration-700 transform";
                    const visibilityClasses = index < visibleLines 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-8";
                    
                    if (line.isHighlight) {
                        return (
                            <p key={line.key} className={`text-2xl md:text-3xl font-bold text-cyan-400 dark:text-cyan-400 mt-4 ${baseClasses} ${visibilityClasses}`}>
                                {t(line.key)}
                            </p>
                        );
                    }
                    
                    if (line.isBold) {
                        return (
                            <p key={line.key} className={`text-xl md:text-2xl text-slate-600 dark:text-slate-300 ${baseClasses} ${visibilityClasses}`}>
                                <strong>{t(line.key)}</strong>
                            </p>
                        );
                    }
                    
                    return (
                        <p key={line.key} className={`text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed ${baseClasses} ${visibilityClasses}`}>
                            {t(line.key)}
                        </p>
                    );
                })}
            </div>
            
            <a 
                href="#reality-check" 
                className={`mt-8 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 ${visibleLines >= 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                {t('hero.cta')}
            </a>
        </section>
    );
};

export default Hero;
