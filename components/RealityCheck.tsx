import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RealityCheck: React.FC = () => {
    const { t } = useLanguage();
    const [currentQuote, setCurrentQuote] = useState('');
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    const quotes = [
        t('reality.quote1'),
        t('reality.quote2'),
        t('reality.quote3'),
        t('reality.quote4'),
    ];

    useEffect(() => {
        const quote = quotes[quoteIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && charIndex < quote.length) {
            timeout = setTimeout(() => {
                setCurrentQuote(quote.substring(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 50);
        } else if (!isDeleting && charIndex === quote.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && charIndex > 0) {
            timeout = setTimeout(() => {
                setCurrentQuote(quote.substring(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, 30);
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setQuoteIndex((quoteIndex + 1) % quotes.length);
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, quoteIndex, quotes]);

    // Reset when language changes
    useEffect(() => {
        setCharIndex(0);
        setCurrentQuote('');
        setIsDeleting(false);
    }, [t('reality.quote1')]);

    const traditionalItems = [
        t('reality.trad.item1'),
        t('reality.trad.item2'),
        t('reality.trad.item3'),
        t('reality.trad.item4'),
        t('reality.trad.item5'),
        t('reality.trad.item6'),
    ];

    const digitalItems = [
        t('reality.digital.item1'),
        t('reality.digital.item2'),
        t('reality.digital.item3'),
        t('reality.digital.item4'),
        t('reality.digital.item5'),
        t('reality.digital.item6'),
    ];

    return (
        <section id="reality-check" className="py-20 px-4 bg-slate-100/50 dark:bg-slate-800/30">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 dark:text-white">
                    {t('reality.title')}
                </h2>
                
                {/* Rotating quotes */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-r-xl p-6 min-h-[80px] flex items-center justify-center">
                        <span className="text-lg md:text-xl text-red-600 dark:text-red-300 text-center">
                            {currentQuote}
                            <span className="animate-pulse text-red-400">|</span>
                        </span>
                    </div>
                </div>
                
                <p className="text-xl md:text-2xl text-center text-purple-500 dark:text-purple-400 italic mb-12">
                    {t('reality.transition')}
                </p>
                
                {/* Comparison table */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* Traditional */}
                    <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-red-500 dark:text-red-400 mb-4">
                            {t('reality.trad.title')}
                        </h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            {traditionalItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl text-center">
                            <p className="text-red-500 dark:text-red-400 font-semibold">💰 €50 000 - €150 000</p>
                            <p className="text-red-500 dark:text-red-400 font-semibold">⏱️ 3-6 {t('reality.months')}</p>
                        </div>
                    </div>
                    
                    {/* Digital Humans */}
                    <div className="bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/30 rounded-2xl p-6 shadow-lg shadow-cyan-500/10">
                        <h3 className="text-xl font-semibold mb-4">
                            <span className="text-cyan-500">Digital-</span>
                            <span className="text-slate-800 dark:text-white">Humans.fr</span>
                        </h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            {digitalItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-cyan-400">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl text-center">
                            <p className="text-cyan-500 font-semibold">💰 €1 490/{t('reality.month')}</p>
                            <p className="text-cyan-500 font-semibold">⚡ {t('reality.hours')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RealityCheck;
