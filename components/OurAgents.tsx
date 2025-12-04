import React from 'react';
import { AGENTS } from '../constants';
import type { Agent } from '../types';

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    return (
        <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center flex flex-col items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hover:scale-105 transform duration-300">
             <div className="mb-3">
                <img 
                    src={agent.avatar} 
                    alt={agent.firstName} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-sky-500/30 shadow-lg"
                />
            </div>
            <h3 className="font-bold text-sky-500 dark:text-sky-400 text-lg">{agent.firstName}</h3>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{agent.role}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex-grow">{agent.description}</p>
        </div>
    )
}

const OurAgents: React.FC = () => {
    return (
        <section id="agents" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Your Dedicated AI Team</h2>
                     <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Meet the specialized agents that form our autonomous development workforce.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {AGENTS.map((agent) => (
                       <AgentCard key={agent.firstName} agent={agent} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurAgents;
