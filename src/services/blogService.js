// blogService.js - Service pour gérer les articles de blog
import { supabase } from '../config/supabase';

// Récupérer tous les articles (admin)
export const getAllArticles = async () => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAllArticles:', error);
        return [];
    }
};

// Sauvegarder un article
export const saveArticle = async (article) => {
    try {
        // Générer le slug automatiquement si pas fourni
        if (!article.slug && article.title) {
            article.slug = generateSlug(article.title);
        }

        // Calculer le temps de lecture
        if (article.content) {
            article.reading_time = calculateReadingTime(article.content);
        }

        // Extraire l'excerpt si pas fourni
        if (!article.excerpt && article.content) {
            article.excerpt = extractExcerpt(article.content);
        }

        if (article.id && article.id !== 'new') {
            // Mise à jour
            const { data, error } = await supabase
                .from('articles')
                .update({
                    ...article,
                    updated_at: new Date().toISOString()
                })
                .eq('id', article.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { success: true, data };
        } else {
            // Création
            const { data, error } = await supabase
                .from('articles')
                .insert([{
                    ...article,
                    id: undefined, // Laisser Supabase générer l'ID
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { success: true, data };
        }
    } catch (error) {
        console.error('Error saving article:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to save article' 
        };
    }
};

// Supprimer un article
export const deleteArticle = async (id) => {
    try {
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting article:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to delete article' 
        };
    }
};

// Publier/dépublier un article
export const toggleArticlePublication = async (id, published) => {
    try {
        const updateData = {
            published,
            updated_at: new Date().toISOString()
        };

        // Si on publie, ajouter la date de publication
        if (published) {
            updateData.published_at = new Date().toISOString();
        } else {
            updateData.published_at = null;
        }

        const { data, error } = await supabase
            .from('articles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error toggling publication:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to update publication status' 
        };
    }
};

// Obtenir les statistiques des articles
export const getArticleStats = async () => {
    try {
        // Nombre total d'articles
        const { count: totalArticles } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true });

        // Nombre d'articles publiés
        const { count: publishedArticles } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('published', true);

        // Nombre total de vues
        const { data: viewsData } = await supabase
            .from('articles')
            .select('views')
            .eq('published', true);

        const totalViews = viewsData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

        // Nombre total de likes
        const { data: likesData } = await supabase
            .from('articles')
            .select('likes')
            .eq('published', true);

        const totalLikes = likesData?.reduce((sum, article) => sum + (article.likes || 0), 0) || 0;

        // Articles les plus populaires
        const { data: popularArticles } = await supabase
            .from('articles')
            .select('id, title, slug, views')
            .eq('published', true)
            .order('views', { ascending: false })
            .limit(5);

        return {
            success: true,
            data: {
                totalArticles: totalArticles || 0,
                publishedArticles: publishedArticles || 0,
                totalViews,
                totalLikes,
                popularArticles: popularArticles || []
            }
        };
    } catch (error) {
        console.error('Error getting article stats:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to get article statistics' 
        };
    }
};

// Fonctions utilitaires

// Générer un slug à partir du titre
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/[\s_-]+/g, '-') // Remplacer espaces et underscores par des tirets
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début/fin
};

// Calculer le temps de lecture (mots par minute)
const calculateReadingTime = (content) => {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    
    return Math.max(1, time); // Au minimum 1 minute
};

// Extraire un excerpt du contenu
const extractExcerpt = (content, maxLength = 160) => {
    if (!content) return '';
    
    // Supprimer le markdown
    const plainText = content
        .replace(/#{1,6}\s+/g, '') // Headings
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/`(.*?)`/g, '$1') // Code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .trim();
    
    // Prendre le premier paragraphe
    const firstParagraph = plainText.split('\n\n')[0];
    
    if (firstParagraph.length <= maxLength) {
        return firstParagraph;
    }
    
    // Tronquer au dernier mot complet
    const truncated = firstParagraph.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substring(0, lastSpace) + '...';
};

// Valider un article avant sauvegarde
export const validateArticle = (article) => {
    const errors = [];

    if (!article.title?.trim()) {
        errors.push('Title is required');
    }

    if (!article.content?.trim()) {
        errors.push('Content is required');
    }

    if (!article.slug?.trim()) {
        errors.push('Slug is required');
    } else if (!/^[a-z0-9-]+$/.test(article.slug)) {
        errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    if (article.tags && !Array.isArray(article.tags)) {
        errors.push('Tags must be an array');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Initialiser avec des articles par défaut
export const initializeBlogArticles = async () => {
    try {
        // Vérifier si des articles existent déjà
        const { count } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true });

        if (count > 0) {
            return { 
                success: false, 
                error: 'Articles already exist. Use this only for initial setup.' 
            };
        }

        const defaultArticles = [
            {
                title: 'Welcome to My Blog',
                slug: 'welcome-to-my-blog',
                excerpt: 'This is the first post on my new blog. Here I\'ll share insights about web development, design, and technology.',
                content: `# Welcome to My Blog

I'm excited to launch this blog where I'll be sharing my thoughts and experiences in web development, design, and technology.

## What You Can Expect

- **Technical tutorials** on modern web development
- **Design insights** and best practices
- **Project showcases** and case studies
- **Industry trends** and analysis

## About Me

I'm a passionate web developer with expertise in React, Node.js, and modern web technologies. I love creating beautiful, functional applications that solve real-world problems.

## Get in Touch

Feel free to reach out if you have any questions or would like to collaborate on a project!`,
                cover_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
                tags: ['welcome', 'introduction', 'blog'],
                category: 'general',
                published: true,
                published_at: new Date().toISOString(),
                reading_time: 2
            }
        ];

        const { data, error } = await supabase
            .from('articles')
            .insert(defaultArticles)
            .select();

        if (error) {
            throw error;
        }

        return { 
            success: true, 
            message: `Successfully created ${data.length} default articles` 
        };
    } catch (error) {
        console.error('Error initializing blog articles:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to initialize blog articles' 
        };
    }
};