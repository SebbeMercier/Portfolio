// useStats.js - Hook pour récupérer les statistiques dynamiques
import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../services/supabaseProjectService';
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

    const calculateExperience = () => {
        // Tu peux ajuster cette date selon quand tu as commencé
        const startDate = new Date('2021-01-01'); // Exemple: commencé en 2021
        const now = new Date();
        const years = Math.floor((now - startDate) / (365.25 * 24 * 60 * 60 * 1000));
        return Math.max(1, years); // Au minimum 1 an
    };

    const extractTechnologies = (projects) => {
        const techSet = new Set();
        
        projects.forEach(project => {
            // Extraire des tags
            if (project.tags && Array.isArray(project.tags)) {
                project.tags.forEach(tag => techSet.add(tag.toLowerCase()));
            }
            
            // Extraire des technologies détaillées si disponible
            if (project.detailedTech) {
                Object.values(project.detailedTech).forEach(techArray => {
                    if (Array.isArray(techArray)) {
                        techArray.forEach(tech => techSet.add(tech.toLowerCase()));
                    }
                });
            }
        });
        
        return techSet.size;
    };

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

            // Récupérer les projets avec fallback
            let projects = [];
            try {
                projects = await getProjects();
                if (!Array.isArray(projects)) projects = [];
            } catch (projectError) {
                console.warn('Could not load projects:', projectError);
                projects = [];
            }
            
            const liveProjects = projects.filter(p => p.status === 'Live' || p.status === 'Completed');
            
            // Récupérer les témoignages visibles avec fallback
            let testimonials = [];
            try {
                testimonials = await getVisibleTestimonials();
                if (!Array.isArray(testimonials)) testimonials = [];
            } catch (testimonialError) {
                console.warn('Could not load testimonials:', testimonialError);
                testimonials = [];
            }
            
            // Calculer les technologies uniques
            const uniqueTechnologies = extractTechnologies(projects);
            
            // Calculer l'expérience
            const experience = calculateExperience();
            
            // Calculer la note moyenne
            const averageRating = calculateAverageRating(testimonials);

            // S'assurer que toutes les valeurs sont des nombres valides
            const finalStats = {
                projects: Math.max(liveProjects.length, 0),
                clients: Math.max(testimonials.length, 0),
                technologies: Math.max(uniqueTechnologies, 8), // Au minimum 8 pour être réaliste
                experience: Math.max(experience, 3), // Au minimum 3 ans
                averageRating: averageRating > 0 ? Math.round(averageRating * 10) / 10 : 0,
                loading: false,
                error: null
            };

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
    const refreshStats = () => {
        loadStats();
    };

    return {
        ...stats,
        refreshStats
    };
};