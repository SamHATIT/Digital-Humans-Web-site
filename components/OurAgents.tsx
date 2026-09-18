import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Agent {
    name: string;
    role: string;
    avatar: string;
}

interface Act {
    titleKey: string;
    agents: Agent[];
    storyKeys: string[];
    quoteKey?: string;
    quoteAuthor?: string;
    stats?: { label: string; value: string }[];
}

const OurAgents: React.FC = () => {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    const acts: Act[] = [
        {
            titleKey: 'agents.act1.title',
            agents: [{ name: 'Sophie', role: t('agent.sophie.role'), avatar: '/avatars/sophie-pm.png' }],
            storyKeys: ['agents.act1.story1', 'agents.act1.story2', 'agents.act1.story3', 'agents.act1.story4'],
            stats: [
                { label: t('agents.stats.projects'), value: '1 247' },
                { label: t('agents.stats.success'), value: '100%' },
                { label: t('agents.stats.sleep'), value: '0h' },
            ],
        },
        {
            titleKey: 'agents.act2.title',
            agents: [
                { name: 'Olivia', role: t('agent.olivia.role'), avatar: '/avatars/olivia-ba.png' },
                { name: 'Marcus', role: t('agent.marcus.role'), avatar: '/avatars/marcus-architect.png' },
                { name: 'Emma', role: t('agent.emma.role'), avatar: '/avatars/emma-research.png?v=3' },
            ],
            storyKeys: ['agents.act2.story1', 'agents.act2.story2', 'agents.act2.story3', 'agents.act2.story4'],
            quoteKey: 'agents.act2.quote',
            quoteAuthor: 'Marcus',
        },
        {
            titleKey: 'agents.act3.title',
            agents: [
                { name: 'Diego', role: t('agent.diego.role'), avatar: '/avatars/diego-apex.png' },
                { name: 'Zara', role: t('agent.zara.role'), avatar: '/avatars/zara-lwc.png' },
                { name: 'Raj', role: t('agent.raj.role'), avatar: '/avatars/raj-admin.png' },
            ],
            storyKeys: ['agents.act3.story1', 'agents.act3.story2', 'agents.act3.story3'],
        },
        {
            titleKey: 'agents.act4.title',
            agents: [
                { name: 'Aisha', role: t('agent.aisha.role'), avatar: '/avatars/aisha-data.png' },
                { name: 'Elena', role: t('agent.elena.role'), avatar: '/avatars/elena-qa.png' },
            ],
            storyKeys: ['agents.act4.story1', 'agents.act4.story2'],
        },
        {
            titleKey: 'agents.act5.title',
            agents: [
                { name: 'Jordan', role: t('agent.jordan.role'), avatar: '/avatars/jordan-devops.png' },
                { name: 'Lucas', role: t('agent.lucas.role'), avatar: '/avatars/lucas-trainer.png' },
            ],
            storyKeys: ['agents.act5.story1', 'agents.act5.story2'],
        },
    ];

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        if (trackRef.current) {
            const slideWidth = trackRef.current.offsetWidth;
            trackRef.current.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
        }
    };

    const moveCarousel = (direction: number) => {
        const newSlide = Math.max(0, Math.min(acts.length - 1, currentSlide + direction));
        goToSlide(newSlide);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleScroll = () => {
            const slideWidth = track.offsetWidth;
            const newSlide = Math.round(track.scrollLeft / slideWidth);
            if (newSlide !== currentSlide) {
                setCurrentSlide(newSlide);
            }
        };

        track.addEventListener('scroll', handleScroll);
        return () => track.removeEventListener('scroll', handleScroll);
    }, [currentSlide]);

    return (
        <section id="agents" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-white">
                    {t('agents.title')}
                </h2>
                
                <div className="relative">
                    {/* Navigation arrows */}
                    <button
                        onClick={() => moveCarousel(-1)}
                        disabled={currentSlide === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-500 hover:border-cyan-300 dark:hover:border-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        ←
                    </button>
                    
                    <button
                        onClick={() => moveCarousel(1)}
                        disabled={currentSlide === acts.length - 1}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-500 hover:border-cyan-300 dark:hover:border-cyan-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        →
                    </button>
                    
                    {/* Carousel track */}
                    <div
                        ref={trackRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide mx-14"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {acts.map((act, index) => (
                            <div
                                key={index}
                                className="flex-none w-full snap-center px-4 py-8 min-h-[450px] flex flex-col items-center"
                            >
                                <h3 className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
                                    {t(act.titleKey)}
                                </h3>
                                
                                {/* Agents */}
                                <div className="flex gap-8 justify-center flex-wrap mb-6">
                                    {act.agents.map((agent) => (
                                        <div key={agent.name} className="text-center">
                                            <img
                                                src={agent.avatar}
                                                alt={agent.name}
                                                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-500/30 transition-all object-cover mx-auto mb-3"
                                            />
                                            <p className="text-cyan-500 font-semibold">{agent.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{agent.role}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Story */}
                                <div className="text-center max-w-2xl space-y-2 text-slate-600 dark:text-slate-400">
                                    {act.storyKeys.map((key, i) => (
                                        <p key={i} dangerouslySetInnerHTML={{ __html: t(key) }} />
                                    ))}
                                </div>
                                
                                {/* Quote */}
                                {act.quoteKey && (
                                    <div className="mt-6 max-w-xl bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 rounded-r-xl p-4 text-purple-600 dark:text-purple-300 italic">
                                        "{t(act.quoteKey)}"
                                        <div className="text-right text-sm mt-2 text-slate-500">— {act.quoteAuthor}</div>
                                    </div>
                                )}
                                
                                {/* Stats */}
                                {act.stats && (
                                    <div className="flex gap-3 mt-6 flex-wrap justify-center">
                                        {act.stats.map((stat, i) => (
                                            <div key={i} className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/30 px-4 py-2 rounded-lg text-sm">
                                                {stat.label}: <strong className="text-cyan-600 dark:text-cyan-400">{stat.value}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Dots */}
                <div className="flex justify-center gap-3 mt-6">
                    {acts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                currentSlide === index
                                    ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-cyan-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurAgents;
