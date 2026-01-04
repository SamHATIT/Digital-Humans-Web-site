import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
    getPostBySlug, 
    getPostAgent, 
    formatDate,
    GhostPost 
} from '../../services/ghostApi';
import AuthorCard from './AuthorCard';
import BlogContent from './BlogContent';

const BlogArticle: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { language } = useLanguage();
    const [post, setPost] = useState<GhostPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const t = {
        loading: language === 'fr' ? 'Chargement...' : 'Loading...',
        notFound: language === 'fr' ? 'Article non trouvé' : 'Article not found',
        error: language === 'fr' ? "Erreur lors du chargement" : 'Error loading article',
        backToBlog: language === 'fr' ? '← Retour au blog' : '← Back to blog',
        readTime: language === 'fr' ? 'de lecture' : 'read',
        writtenBy: language === 'fr' ? 'Écrit par' : 'Written by',
        share: language === 'fr' ? 'Partager' : 'Share'
    };
    
    useEffect(() => {
        if (slug) loadPost(slug);
    }, [slug]);
    
    const loadPost = async (postSlug: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await getPostBySlug(postSlug);
            setPost(result || null);
            if (!result) setError(t.notFound);
        } catch (err) {
            console.error('Error loading post:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">{t.loading}</p>
                </div>
            </div>
        );
    }
    
    if (error || !post) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
                    <Link to="/blog" className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
                        {t.backToBlog}
                    </Link>
                </div>
            </div>
        );
    }
    
    const postAgent = getPostAgent(post);
    
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Hero */}
            <div className="relative">
                {post.feature_image && (
                    <div className="absolute inset-0 h-96">
                        <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900 dark:to-slate-900"></div>
                    </div>
                )}
                
                <div className={`relative ${post.feature_image ? 'pt-32 pb-16' : 'pt-20 pb-10 bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900'}`}>
                    <div className="max-w-4xl mx-auto px-4">
                        <Link to="/blog" className={`inline-flex items-center gap-2 text-sm mb-6 transition-colors ${
                            post.feature_image ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-cyan-500'
                        }`}>
                            {t.backToBlog}
                        </Link>
                        
                        {postAgent && (
                            <div className="mb-4">
                                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: postAgent.agent.color }}>
                                    {postAgent.agent.name}
                                </span>
                            </div>
                        )}
                        
                        <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${
                            post.feature_image ? 'text-white' : 'text-slate-800 dark:text-white'
                        }`}>
                            {post.title}
                        </h1>
                        
                        <div className={`flex flex-wrap items-center gap-4 text-sm ${
                            post.feature_image ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                            <span>{formatDate(post.published_at, language)}</span>
                            <span>•</span>
                            <span>{post.reading_time} min {t.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-[1fr,300px] gap-10">
                    {/* Article body */}
                    <div>
                        <BlogContent 
                            html={post.html} 
                            agentSlug={postAgent?.tag.slug}
                        />
                    </div>
                    
                    {/* Sidebar */}
                    <aside className="md:sticky md:top-8 h-fit space-y-6">
                        {postAgent && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                    {t.writtenBy}
                                </h3>
                                <AuthorCard agentSlug={postAgent.tag.slug} />
                            </div>
                        )}
                        
                        {post.tags && post.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Link key={tag.id} to={`/blog?tag=${tag.slug}`}
                                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                {t.share}
                            </h3>
                            <div className="flex gap-2">
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-cyan-500 hover:text-white transition-colors"
                                    title="Partager sur X">
                                    𝕏
                                </a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors"
                                    title="Partager sur LinkedIn">
                                    in
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogArticle;
