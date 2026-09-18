/**
 * Ghost Content API Service for Digital Humans Blog
 */

const GHOST_URL = 'https://blog-admin.digital-humans.fr';
const GHOST_CONTENT_KEY = '9985b20698251c494e823ca162';

// Types
export interface GhostTag {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    accent_color: string | null;
    url: string;
}

export interface GhostAuthor {
    id: string;
    name: string;
    slug: string;
    profile_image: string | null;
    bio: string | null;
}

export interface GhostPost {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html: string;
    excerpt: string;
    feature_image: string | null;
    featured: boolean;
    created_at: string;
    updated_at: string;
    published_at: string;
    reading_time: number;
    tags: GhostTag[];
    primary_tag: GhostTag | null;
    authors: GhostAuthor[];
    primary_author: GhostAuthor | null;
}

export interface GhostPagination {
    page: number;
    limit: number;
    pages: number;
    total: number;
    next: number | null;
    prev: number | null;
}

// Agent data (complète les tags Ghost avec les infos locales)
export const AGENTS_DATA: Record<string, {
    name: string;
    role: string;
    roleEn: string;
    bio: string;
    bioEn: string;
    color: string;
    avatar: string;
    motto: string;
    mottoEn: string;
}> = {
    'sophie-chen': {
        name: 'Sophie Chen',
        role: 'Chef de Projet',
        roleEn: 'Project Manager',
        bio: 'Stratégie, roadmap et gouvernance projet.',
        bioEn: 'Strategy, roadmap and project governance.',
        color: '#8B5CF6',
        avatar: '/avatars/sophie-pm.png',
        motto: 'Un projet réussi commence par une vision claire et une équipe alignée.',
        mottoEn: 'A successful project starts with a clear vision and an aligned team.'
    },
    'olivia-parker': {
        name: 'Olivia Parker',
        role: 'Analyste Métier',
        roleEn: 'Business Analyst',
        bio: 'Requirements, process mapping et use cases.',
        bioEn: 'Requirements, process mapping and use cases.',
        color: '#3B82F6',
        avatar: '/avatars/olivia-ba.png',
        motto: 'Comprendre le besoin avant de construire la solution.',
        mottoEn: 'Understand the need before building the solution.'
    },
    'marcus-johnson': {
        name: 'Marcus Johnson',
        role: 'Architecte Solution',
        roleEn: 'Solution Architect',
        bio: 'Design patterns, intégration et scalabilité.',
        bioEn: 'Design patterns, integration and scalability.',
        color: '#F97316',
        avatar: '/avatars/marcus-architect.png',
        motto: 'Penser architecture avant de penser code.',
        mottoEn: 'Think architecture before thinking code.'
    },
    'diego-martinez': {
        name: 'Diego Martinez',
        role: 'Développeur Apex',
        roleEn: 'Apex Developer',
        bio: 'Apex, triggers, batches et governor limits.',
        bioEn: 'Apex, triggers, batches and governor limits.',
        color: '#EF4444',
        avatar: '/avatars/diego-apex.png',
        motto: 'Un excellent développeur écrit du code que les autres peuvent maintenir.',
        mottoEn: 'An excellent developer writes code that others can maintain.'
    },
    'zara-thompson': {
        name: 'Zara Thompson',
        role: 'Développeuse LWC',
        roleEn: 'LWC Developer',
        bio: 'Lightning Web Components, UX et accessibilité.',
        bioEn: 'Lightning Web Components, UX and accessibility.',
        color: '#22C55E',
        avatar: '/avatars/zara-lwc.png',
        motto: "L'expérience utilisateur n'est pas un luxe, c'est le produit.",
        mottoEn: 'User experience is not a luxury, it is the product.'
    },
    'raj-patel': {
        name: 'Raj Patel',
        role: 'Administrateur Salesforce',
        roleEn: 'Salesforce Admin',
        bio: 'Flows, permissions et configuration.',
        bioEn: 'Flows, permissions and configuration.',
        color: '#EAB308',
        avatar: '/avatars/raj-admin.png',
        motto: "La meilleure configuration est celle qu'on n'a pas besoin d'expliquer.",
        mottoEn: 'The best configuration is one you do not need to explain.'
    },
    'elena-vasquez': {
        name: 'Elena Vasquez',
        role: 'Ingénieure QA',
        roleEn: 'QA Engineer',
        bio: 'Test strategy, Apex tests et qualité.',
        bioEn: 'Test strategy, Apex tests and quality.',
        color: '#6B7280',
        avatar: '/avatars/elena-qa.png',
        motto: "Tester, ce n'est pas douter. C'est garantir.",
        mottoEn: 'Testing is not doubting. It is guaranteeing.'
    },
    'jordan-blake': {
        name: 'Jordan Blake',
        role: 'Ingénieur DevOps',
        roleEn: 'DevOps Engineer',
        bio: 'SFDX, CI/CD, Git et deployment.',
        bioEn: 'SFDX, CI/CD, Git and deployment.',
        color: '#1E40AF',
        avatar: '/avatars/jordan-devops.png',
        motto: 'Automatiser tout ce qui peut l\'être. Documenter le reste.',
        mottoEn: 'Automate everything that can be. Document the rest.'
    },
    'aisha-okonkwo': {
        name: 'Aisha Okonkwo',
        role: 'Spécialiste Data',
        roleEn: 'Data Specialist',
        bio: 'Data Cloud, migration et ETL.',
        bioEn: 'Data Cloud, migration and ETL.',
        color: '#92400E',
        avatar: '/avatars/aisha-data.png',
        motto: 'Les données sont le fondement. Traitez-les avec respect.',
        mottoEn: 'Data is the foundation. Treat it with respect.'
    },
    'lucas-fernandez': {
        name: 'Lucas Fernandez',
        role: 'Responsable Formation',
        roleEn: 'Training Lead',
        bio: 'Formation, documentation et change management.',
        bioEn: 'Training, documentation and change management.',
        color: '#D946EF',
        avatar: '/avatars/lucas-trainer.png',
        motto: 'La meilleure technologie est inutile si personne ne sait l\'utiliser.',
        mottoEn: 'The best technology is useless if no one knows how to use it.'
    }
};

/**
 * Fetch helper for Ghost Content API
 */
async function ghostFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${GHOST_URL}/ghost/api/content/${endpoint}`);
    url.searchParams.set('key', GHOST_CONTENT_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
        throw new Error(`Ghost API error: ${response.status}`);
    }
    
    return response.json();
}

/**
 * Get all published posts
 */
export async function getPosts(options: {
    page?: number;
    limit?: number;
    tag?: string;
    include?: string;
} = {}): Promise<{ posts: GhostPost[]; meta: { pagination: GhostPagination } }> {
    const params: Record<string, string> = {
        include: options.include || 'tags,authors',
        formats: 'html',
        limit: String(options.limit || 10),
        page: String(options.page || 1),
    };
    
    if (options.tag) {
        params.filter = `tag:${options.tag}`;
    }
    
    return ghostFetch('posts/', params);
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
    try {
        const result = await ghostFetch<{ posts: GhostPost[] }>('posts/slug/' + slug + '/', {
            include: 'tags,authors',
            formats: 'html'
        });
        return result.posts[0] || null;
    } catch {
        return null;
    }
}

/**
 * Get all tags
 */
export async function getTags(): Promise<GhostTag[]> {
    const result = await ghostFetch<{ tags: GhostTag[] }>('tags/', {
        limit: 'all'
    });
    return result.tags;
}

/**
 * Get agent tags only (exclude system tags like "News")
 */
export async function getAgentTags(): Promise<GhostTag[]> {
    const tags = await getTags();
    return tags.filter(tag => AGENTS_DATA[tag.slug]);
}

/**
 * Get agent info from slug
 */
export function getAgentBySlug(slug: string) {
    return AGENTS_DATA[slug] || null;
}

/**
 * Extract the agent tag from a post's tags
 */
export function getPostAgent(post: GhostPost) {
    const agentTag = post.tags?.find(tag => AGENTS_DATA[tag.slug]);
    if (agentTag) {
        return {
            tag: agentTag,
            agent: AGENTS_DATA[agentTag.slug]
        };
    }
    return null;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string = 'fr'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
