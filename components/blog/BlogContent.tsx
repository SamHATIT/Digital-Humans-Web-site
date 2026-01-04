import React from 'react';

interface BlogContentProps {
    html: string;
    agentSlug?: string;
}

/**
 * BlogContent - Parse and style Ghost HTML content
 * Transforms expert tips and signatures into styled components
 */
const BlogContent: React.FC<BlogContentProps> = ({ html, agentSlug }) => {
    // Process HTML to add styling classes
    const processedHtml = React.useMemo(() => {
        let processed = html;
        
        // Transform expert tip blockquote
        // Pattern: <blockquote><p><strong>💡 Le conseil de X</strong></p>...
        processed = processed.replace(
            /<blockquote>\s*<p><strong>(💡[^<]+)<\/strong><\/p>/gi,
            `<div class="expert-tip" data-agent="${agentSlug || 'default'}"><div class="expert-tip-header">$1</div>`
        );
        
        // Close the expert-tip div where blockquote ends
        processed = processed.replace(
            /(<div class="expert-tip"[^>]*>.*?)<\/blockquote>/gis,
            '$1</div>'
        );
        
        // Transform signature header
        // Pattern: <h3>📊 Data checklist</h3> or similar
        const signatureEmojis = ['🎯', '📋', '🏗️', '📝', '✅', '⚙️', '🧪', '💻', '📊', '📌'];
        const emojiPattern = signatureEmojis.map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
        
        processed = processed.replace(
            new RegExp(`<h3[^>]*>(${emojiPattern})\\s*([^<]+)<\\/h3>\\s*<ul>`, 'gi'),
            '<div class="agent-signature"><div class="signature-header">$1 <strong>$2</strong></div><ul>'
        );
        
        // Close signature div after the ul
        processed = processed.replace(
            /(<div class="agent-signature">.*?<\/ul>)/gis,
            '$1</div>'
        );
        
        // Handle alternate format: <p>💡 Le conseil de X</p><p>"conseil"</p>
        processed = processed.replace(
            /<p>(💡\s*Le conseil[^<]+)<\/p>\s*<p>"([^"]+)"<\/p>/gi,
            `<div class="expert-tip" data-agent="${agentSlug || 'default'}"><div class="expert-tip-header">$1</div><p>"$2"</p></div>`
        );
        
        // Handle alternate signature format
        processed = processed.replace(
            new RegExp(`<p>(${emojiPattern})\\s*<strong>([^<]+)<\\/strong><\\/p>\\s*<ul>`, 'gi'),
            '<div class="agent-signature"><div class="signature-header">$1 <strong>$2</strong></div><ul>'
        );
        
        return processed;
    }, [html, agentSlug]);
    
    return (
        <article 
            className="blog-content prose prose-lg dark:prose-invert prose-cyan max-w-none
                prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white
                prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-a:text-cyan-500 prose-a:no-underline hover:prose-a:underline
                prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
                prose-img:rounded-xl prose-img:shadow-lg
                prose-blockquote:border-l-cyan-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50
                prose-blockquote:not-italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    );
};

export default BlogContent;
