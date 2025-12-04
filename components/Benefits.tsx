import React from 'react';
import { BENEFITS } from '../constants';

const Benefits: React.FC = () => {
    return (
        <section id="benefits" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Transforming Salesforce Consulting</h2>
                     <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We upgrade Salesforce consulting models with efficient, predictable, and AI-driven automation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {BENEFITS.map((benefit, index) => (
                        <div key={index} className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-sky-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 mb-4">
                                <benefit.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{benefit.title}</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;