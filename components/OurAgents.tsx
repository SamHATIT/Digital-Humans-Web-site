import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Agent {
    firstName: string;
    avatar: string;
    roleKey: string;
    descKey: string;
}

const agents: Agent[] = [
    { firstName: 'Sophie', avatar: '/avatars/sophie-pm.png', roleKey: 'agent.sophie.role', descKey: 'agent.sophie.desc' },
    { firstName: 'Olivia', avatar: '/avatars/olivia-ba.png', roleKey: 'agent.olivia.role', descKey: 'agent.olivia.desc' },
    { firstName: 'Marcus', avatar: '/avatars/marcus-architect.png', roleKey: 'agent.marcus.role', descKey: 'agent.marcus.desc' },
    { firstName: 'Diego', avatar: '/avatars/diego-apex.png', roleKey: 'agent.diego.role', descKey: 'agent.diego.desc' },
    { firstName: 'Zara', avatar: '/avatars/zara-lwc.png', roleKey: 'agent.zara.role', descKey: 'agent.zara.desc' },
    { firstName: 'Raj', avatar: '/avatars/raj-admin.png', roleKey: 'agent.raj.role', descKey: 'agent.raj.desc' },
    { firstName: 'Elena', avatar: '/avatars/elena-qa.png', roleKey: 'agent.elena.role', descKey: 'agent.elena.desc' },
    { firstName: 'Jordan', avatar: '/avatars/jordan-devops.png', roleKey: 'agent.jordan.role', descKey: 'agent.jordan.desc' },
    { firstName: 'Aisha', avatar: '/avatars/aisha-data.png', roleKey: 'agent.aisha.role', descKey: 'agent.aisha.desc' },
    { firstName: 'Lucas', avatar: '/avatars/lucas-trainer.png', roleKey: 'agent.lucas.role', descKey: 'agent.lucas.desc' },
];

const AgentCard: React.FC<{ agent: Agent; t: (key: string) => string }> = ({ agent, t }) => {
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
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{t(agent.roleKey)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex-grow">{t(agent.descKey)}</p>
        </div>
    );
};

const OurAgents: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <section id="agents" className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">{t('agents.title')}</h2>
                     <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t('agents.subtitle')}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {agents.map((agent) => (
                       <AgentCard key={agent.firstName} agent={agent} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurAgents;
