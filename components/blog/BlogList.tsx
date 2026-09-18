import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
    getPosts, 
    getAgentTags, 
    getPostAgent, 
    formatDate,
    GhostPost,
    GhostTag 
} from '../../services/ghostApi';
import AuthorCard from './AuthorCard';

const BlogList: React.FC = () => {
    const { language } = useLanguage();
    const [posts, setPosts] = useState<GhostPost[]>([]);
    const [agentTags, setAgentTags] = useState<GhostTag[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Traductions
    const t = {
        title: language === 'fr' ? 'Blog' : 'Blog',
        subtitle: language === 'fr' 
            ? 'Insights et bonnes pratiques Salesforce par nos experts IA'
            : 'Salesforce insights and best practices by our AI experts',
        all: language === 'fr' ? 'Tous' : 'All',
        loading: language === 'fr' ? 'Chargement...' : 'Loading...',
        error: language === 'fr' 
            ? 'Erreur lors du chargement des articles' 
            : 'Error loading articles',
        retry: language === 'fr' ? 'Réessayer' : 'Retry',
        noArticles: language === 'fr' 
            ? 'Aucun article pour le moment. Revenez bientôt !'
            : 'No articles yet. Check back soon!',
        minRead: language === 'fr' ? 'min de lecture' : 'min read'
    };
    
    useEffect(() => {
        loadData();
    }, [selectedTag]);
    
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [postsResult, tags] = await Promise.all([
                getPosts({ tag: selectedTag || undefined, limit: 20 }),
                getAgentTags()
            ]);
            
            setPosts(postsResult.posts);
            setAgentTags(tags);
        } catch (err) {
            console.error('Error loading blog:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                        {t.title}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Filtres par agent */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedTag(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                !selectedTag
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {t.all}
                        </button>
                        {agentTags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => setSelectedTag(tag.slug)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedTag === tag.slug
                                        ? 'text-white shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                                style={selectedTag === tag.slug ? { 
                                    backgroundColor: tag.accent_color || '#06b6d4',
                                    boxShadow: `0 10px 15px -3px ${tag.accent_color}40`
                                } : {}}
                            >
                                {tag.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Chargement */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 dark:text-slate-400">
                            {t.loading}
                        </p>
                    </div>
                )}
                
                {/* Erreur */}
                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                        <button 
                            onClick={loadData}
                            className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                        >
                            {t.retry}
                        </button>
                    </div>
                )}
                
                {/* Aucun article */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-slate-500 dark:text-slate-400">
                            {t.noArticles}
                        </p>
                    </div>
                )}
                
                {/* Grille d'articles */}
                {!loading && !error && posts.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => {
                            const postAgent = getPostAgent(post);
                            
                            return (
                                <article 
                                    key={post.id}
                                    className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col"
                                >
                                    {/* Image de couverture */}
                                    {post.feature_image && (
                                        <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
                                            <img
                                                src={post.feature_image}
                                                alt={post.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </Link>
                                    )}
                                    
                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Tag agent */}
                                        {postAgent && (
                                            <div className="mb-3">
                                                <span 
                                                    className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                                                    style={{ backgroundColor: postAgent.agent.color }}
                                                >
                                                    {postAgent.tag.name.split(' ')[0]}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Titre */}
                                        <Link to={`/blog/${post.slug}`}>
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-cyan-500 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                        </Link>
                                        
                                        {/* Extrait */}
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>
                                        
                                        {/* Pied de carte */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                            {postAgent && (
                                                <AuthorCard agentSlug={postAgent.tag.slug} compact />
                                            )}
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400">
                                                    {formatDate(post.published_at, language)}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {post.reading_time} {t.minRead}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
