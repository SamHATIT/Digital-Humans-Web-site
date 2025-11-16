import React from 'react';
import { ArrowRightIcon } from './icons';

const CTA: React.FC = () => {
    return (
        <section id="cta" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-900/[0.1] [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Ready to Automate Your Salesforce Projects?</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-sky-100">
                           Schedule a demo to see our AI agents in action and discover how we can transform your development pipeline.
                        </p>
                        <div className="mt-8">
                             <a href="#" className="bg-white text-sky-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center max-w-xs mx-auto group">
                                Request a Demo <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;