// useStats.js - Hook pour récupérer les statistiques dynamiques (OPTIMISÉ)
import { useState, useEffect, useCallback } from 'react';
import portfolioDataService from '../services/portfolioDataService';
import { getVisibleTestimonials } from '../services/testimonialsService';

export const useStats = () => {
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        technologies: 0,
        experience: 3,
        averageRating: 0,
        loading: true,
        error: null
    });

    const calculateAverageRating = (testimonials) => {
        if (!testimonials || testimonials.length === 0) return 0;
        
        const totalRating = testimonials.reduce((sum, testimonial) => {
            return sum + (testimonial.rating || 5);
        }, 0);
        
        return Math.round((totalRating / testimonials.length) * 10) / 10; // Arrondi à 1 décimale
    };

    const loadStats = useCallback(async () => {
        try {
            setStats(prev => ({ ...prev, loading: true, error: null }));

            // Utiliser la nouvelle fonction optimisée du portfolio service
            const portfolioStats = await portfolioDataService.getPortfolioStats();
            
            // Récupérer les témoignages pour les clients et la note moyenne
            let testimonials = [];
            try {
                testimonials = await getVisibleTestimonials();
                if (!Array.isArray(testimonials)) testimonials = [];
            } catch (testimonialError) {
                console.warn('Could not load testimonials:', testimonialError);
                testimonials = [];
            }
            
            // Calculer la note moyenne
            const averageRating = calculateAverageRating(testimonials);

            // Combiner les stats du portfolio avec les données des témoignages
            const finalStats = {
                projects: portfolioStats.projects,
                clients: Math.max(testimonials.length, portfolioStats.clients),
                technologies: portfolioStats.technologies,
                experience: portfolioStats.experience,
                averageRating: averageRating > 0 ? averageRating : portfolioStats.averageRating,
                loading: false,
                error: null
            };

            console.log('✅ Stats calculées depuis portfolio optimisé:', {
                projects: finalStats.projects,
                technologies: finalStats.technologies,
                clients: finalStats.clients,
                fromCache: true
            });

            setStats(finalStats);

        } catch (error) {
            console.error('Error loading stats:', error);
            // Valeurs par défaut réalistes en cas d'erreur
            setStats({
                projects: 12,
                clients: 15,
                technologies: 18,
                experience: 4,
                averageRating: 4.8,
                loading: false,
                error: null
            });
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Fonction pour recharger les stats manuellement
    const refreshStats = useCallback(() => {
        // Vider le cache du portfolio pour forcer une mise à jour
        portfolioDataService.clearCache();
        loadStats();
    }, [loadStats]);

    return {
        ...stats,
        refreshStats
    };
};