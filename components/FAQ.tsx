import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ: React.FC = () => {
    const { t } = useLanguage();

    const faqs = [
        { questionKey: 'faq.q1', answerKey: 'faq.a1' },
        { questionKey: 'faq.q2', answerKey: 'faq.a2' },
        { questionKey: 'faq.q3', answerKey: 'faq.a3' },
    ];

    return (
        <section id="faq" className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-white">
                    FAQ
                </h2>
                
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-purple-500 dark:text-purple-400 mb-3">
                                ❓ {t(faq.questionKey)}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t(faq.answerKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
