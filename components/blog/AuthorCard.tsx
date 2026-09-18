import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { AGENTS_DATA } from '../../services/ghostApi';

interface AuthorCardProps {
    agentSlug: string;
    showMotto?: boolean;
    compact?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ agentSlug, showMotto = true, compact = false }) => {
    const { language } = useLanguage();
    const agent = AGENTS_DATA[agentSlug];
    
    if (!agent) return null;
    
    const role = language === 'fr' ? agent.role : agent.roleEn;
    const bio = language === 'fr' ? agent.bio : agent.bioEn;
    const motto = language === 'fr' ? agent.motto : agent.mottoEn;
    
    if (compact) {
        return (
            <div className="flex items-center gap-3">
                <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full border-2 object-cover"
                    style={{ borderColor: agent.color }}
                />
                <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{agent.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div 
            className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800/50 border-l-4"
            style={{ borderLeftColor: agent.color }}
        >
            <div className="flex items-start gap-4">
                <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 object-cover shadow-lg"
                    style={{ borderColor: agent.color }}
                />
                <div className="flex-1">
                    <h3 
                        className="font-bold text-lg"
                        style={{ color: agent.color }}
                    >
                        {agent.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {role}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {bio}
                    </p>
                </div>
            </div>
            
            {showMotto && (
                <blockquote 
                    className="mt-4 pl-4 italic text-slate-600 dark:text-slate-300 border-l-2"
                    style={{ borderLeftColor: agent.color + '60' }}
                >
                    "{motto}"
                </blockquote>
            )}
        </div>
    );
};

export default AuthorCard;
