import React from 'react';
import { AGENTS } from '../constants';
import type { Agent } from '../types';

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
    return (
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center flex flex-col items-center hover:bg-slate-800 transition-colors">
             <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-700 text-sky-400 mb-4">
                <agent.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-100 text-base">{agent.name}</h3>
            <p className="text-sm text-slate-400 mt-1 flex-grow">{agent.role}</p>
        </div>
    )
}

const OurAgents: React.FC = () => {
    return (
        <section id="agents" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">Your Dedicated AI Team</h2>
                     <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Meet the specialized agents that form our autonomous development workforce.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {AGENTS.map((agent) => (
                       <AgentCard key={agent.name} agent={agent} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurAgents;