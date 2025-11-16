import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../constants';

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-slate-900/70 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">Our Automated Workflow</h2>
                     <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">A streamlined, four-step process from concept to deployment, powered entirely by AI.</p>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-700 hidden md:block" aria-hidden="true"></div>
                    <div className="space-y-16">
                        {HOW_IT_WORKS_STEPS.map((step, index) => (
                            <div key={index} className="relative flex items-center md:justify-center">
                                <div className={`relative flex items-start gap-6 w-full md:w-1/2 p-4 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto md:text-right md:flex-row-reverse'}`}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block w-4 h-4 rounded-full bg-sky-500 z-10 ${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}`}></div>
                                    <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-slate-800 border-2 border-sky-500 text-sky-400 text-2xl font-bold z-10">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-slate-100 mb-2">{step.title}</h3>
                                        <p className="text-slate-400">{step.description}</p>
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