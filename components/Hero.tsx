import React from 'react';
import { ArrowRightIcon } from './icons';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-24 pb-32 text-center">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-900 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                 <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
                    The Future of Salesforce Development is Here.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                    Our multi-agent AI system automates the entire Salesforce lifecycle, delivering complex solutions with superhuman speed and precision.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <a href="#cta" className="bg-sky-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/20 flex items-center group">
                        Get Started <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;