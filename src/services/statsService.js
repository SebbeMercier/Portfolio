// statsService.js - Service pour calculer des statistiques détaillées
import { supabase } from '../config/supabase';
import { getProjects } from './supabaseProjectService';
import { getTestimonials } from './testimonialsService';

// Obtenir des statistiques détaillées pour l'admin
export const getDetailedStats = async () => {
    try {
        const [projects, testimonials] = await Promise.all([
            getProjects(),
            getTestimonials()
        ]);

        // Stats des projets
        const projectStats = {
            total: projects.length,
            live: projects.filter(p => p.status === 'Live').length,
            inDevelopment: projects.filter(p => p.status === 'In Development').length,
            completed: projects.filter(p => p.status === 'Completed').length,
            byYear: getProjectsByYear(projects),
            topTechnologies: getTopTechnologies(projects)
        };

        // Stats des témoignages
        const testimonialStats = {
            total: testimonials.length,
            visible: testimonials.filter(t => t.isVisible).length,
            hidden: testimonials.filter(t => !t.isVisible).length,
            pending: testimonials.filter(t => t.status === 'pending').length,
            approved: testimonials.filter(t => t.status === 'approved').length,
            averageRating: calculateAverageRating(testimonials),
            ratingDistribution: getRatingDistribution(testimonials),
            recentSubmissions: getRecentSubmissions(testimonials)
        };

        // Stats générales
        const generalStats = {
            totalViews: await getTotalViews(), // Si tu as un système de tracking
            lastUpdated: new Date().toISOString(),
            dataFreshness: 'real-time'
        };

        return {
            success: true,
            data: {
                projects: projectStats,
                testimonials: testimonialStats,
                general: generalStats
            }
        };

    } catch (error) {
        console.error('Error getting detailed stats:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Obtenir les projets par année
const getProjectsByYear = (projects) => {
    const byYear = {};
    projects.forEach(project => {
        const year = project.year || new Date().getFullYear();
        byYear[year] = (byYear[year] || 0) + 1;
    });
    return byYear;
};

// Obtenir les technologies les plus utilisées
const getTopTechnologies = (projects) => {
    const techCount = {};
    
    projects.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
            project.tags.forEach(tag => {
                const tech = tag.toLowerCase();
                techCount[tech] = (techCount[tech] || 0) + 1;
            });
        }
    });

    return Object.entries(techCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tech, count]) => ({ technology: tech, count }));
};

// Calculer la note moyenne
const calculateAverageRating = (testimonials) => {
    if (!testimonials || testimonials.length === 0) return 0;
    
    const validTestimonials = testimonials.filter(t => t.rating && t.rating > 0);
    if (validTestimonials.length === 0) return 0;
    
    const totalRating = validTestimonials.reduce((sum, testimonial) => {
        return sum + testimonial.rating;
    }, 0);
    
    return Math.round((totalRating / validTestimonials.length) * 10) / 10;
};

// Obtenir la distribution des notes
const getRatingDistribution = (testimonials) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    testimonials.forEach(testimonial => {
        if (testimonial.rating && testimonial.rating >= 1 && testimonial.rating <= 5) {
            distribution[testimonial.rating]++;
        }
    });
    
    return distribution;
};

// Obtenir les soumissions récentes (30 derniers jours)
const getRecentSubmissions = (testimonials) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return testimonials.filter(testimonial => {
        const submittedDate = new Date(testimonial.submitted_at || testimonial.createdAt);
        return submittedDate >= thirtyDaysAgo;
    }).length;
};

// Obtenir le nombre total de vues (placeholder - à implémenter avec un système de tracking)
const getTotalViews = async () => {
    try {
        // Tu peux implémenter un système de tracking des vues ici
        // Par exemple, avec une table 'page_views' dans Supabase
        const { data, error } = await supabase
            .from('page_views')
            .select('views')
            .single();
            
        if (error) {
            // Si la table n'existe pas, retourner une valeur par défaut
            return 0;
        }
        
        return data?.views || 0;
    } catch (error) {
        return 0;
    }
};

// Incrémenter les vues (à appeler sur les pages importantes)
export const incrementPageView = async (page = 'home') => {
    try {
        // Exemple d'implémentation simple
        const { error } = await supabase
            .from('page_views')
            .upsert({ 
                page, 
                views: 1,
                last_viewed: new Date().toISOString()
            }, { 
                onConflict: 'page',
                ignoreDuplicates: false 
            });
            
        if (error) {
            console.log('Page views tracking not available:', error.message);
        }
    } catch (error) {
        // Silently fail if tracking is not set up
        console.log('Page views tracking not available');
    }
};

// Obtenir les stats pour le dashboard admin
export const getAdminDashboardStats = async () => {
    try {
        const detailedStats = await getDetailedStats();
        
        if (!detailedStats.success) {
            return detailedStats;
        }

        const { projects, testimonials } = detailedStats.data;

        // Créer un résumé pour le dashboard
        const dashboardStats = {
            overview: {
                totalProjects: projects.total,
                liveProjects: projects.live,
                totalClients: testimonials.total,
                averageRating: testimonials.averageRating,
                pendingReviews: testimonials.pending
            },
            trends: {
                recentSubmissions: testimonials.recentSubmissions,
                topTechnologies: projects.topTechnologies.slice(0, 5),
                projectsByYear: projects.byYear
            },
            alerts: generateAlerts(projects, testimonials)
        };

        return {
            success: true,
            data: dashboardStats
        };

    } catch (error) {
        console.error('Error getting admin dashboard stats:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Générer des alertes pour l'admin
const generateAlerts = (projectStats, testimonialStats) => {
    const alerts = [];

    // Alerte si beaucoup de témoignages en attente
    if (testimonialStats.pending > 3) {
        alerts.push({
            type: 'warning',
            message: `${testimonialStats.pending} testimonials waiting for review`,
            action: 'Review pending feedback'
        });
    }

    // Alerte si note moyenne faible
    if (testimonialStats.averageRating < 4.0 && testimonialStats.total > 0) {
        alerts.push({
            type: 'error',
            message: `Average rating is ${testimonialStats.averageRating}/5`,
            action: 'Check recent feedback'
        });
    }

    // Alerte si pas de nouveaux projets récemment
    const currentYear = new Date().getFullYear();
    if (!projectStats.byYear[currentYear] || projectStats.byYear[currentYear] === 0) {
        alerts.push({
            type: 'info',
            message: 'No projects added this year',
            action: 'Add recent projects'
        });
    }

    return alerts;
};