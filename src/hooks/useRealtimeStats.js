// useRealtimeStats.js - Hook pour des statistiques en temps réel avec auto-refresh
import { useState, useEffect, useCallback, useRef } from 'react';
import portfolioDataService from '../services/portfolioDataService';
import { getVisibleTestimonials } from '../services/testimonialsService';

export const useRealtimeStats = (refreshInterval = 30000) => { // 30 secondes par défaut
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        technologies: 0,
        experience: 3,
        averageRating: 0,
        loading: true,
        error: null,
        lastUpdated: null
    });

    const intervalRef = useRef(null);
    const mountedRef = useRef(true);

    const calculateAverageRating = (testimonials) => {
        if (!testimonials || testimonials.length === 0) return 0;
        
        const totalRating = testimonials.reduce((sum, testimonial) => {
            return sum + (testimonial.rating || 5);
        }, 0);
        
        return Math.round((totalRating / testimonials.length) * 10) / 10;
    };

    const loadStats = useCallback(async (silent = false) => {
        try {
            if (!silent) {
                setStats(prev => ({ ...prev, loading: true, error: null }));
            }

            // Utiliser la fonction optimisée du portfolio service
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

            // Combiner les stats
            const finalStats = {
                projects: portfolioStats.projects,
                clients: Math.max(testimonials.length, portfolioStats.clients),
                technologies: portfolioStats.technologies,
                experience: portfolioStats.experience,
                averageRating: averageRating > 0 ? averageRating : portfolioStats.averageRating,
                loading: false,
                error: null,
                lastUpdated: new Date()
            };

            if (mountedRef.current) {
                setStats(finalStats);
                
                if (!silent) {
                    console.log('✅ Stats temps réel mises à jour:', {
                        projects: finalStats.projects,
                        technologies: finalStats.technologies,
                        clients: finalStats.clients,
                        timestamp: finalStats.lastUpdated.toLocaleTimeString()
                    });
                }
            }

        } catch (error) {
            console.error('Error loading realtime stats:', error);
            if (mountedRef.current) {
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            }
        }
    }, []);

    // Démarrer l'auto-refresh
    const startAutoRefresh = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            loadStats(true); // Silent refresh
        }, refreshInterval);

        console.log(`🔄 Auto-refresh des stats démarré (${refreshInterval/1000}s)`);
    }, [loadStats, refreshInterval]);

    // Arrêter l'auto-refresh
    const stopAutoRefresh = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('⏹️ Auto-refresh des stats arrêté');
        }
    }, []);

    // Refresh manuel
    const refreshStats = useCallback(() => {
        portfolioDataService.clearCache();
        loadStats(false);
    }, [loadStats]);

    // Effet principal
    useEffect(() => {
        mountedRef.current = true;
        
        // Charger immédiatement
        loadStats();
        
        // Démarrer l'auto-refresh
        startAutoRefresh();

        // Cleanup
        return () => {
            mountedRef.current = false;
            stopAutoRefresh();
        };
    }, [loadStats, startAutoRefresh, stopAutoRefresh]);

    // Effet pour redémarrer l'auto-refresh si l'intervalle change
    useEffect(() => {
        if (intervalRef.current) {
            startAutoRefresh();
        }
    }, [refreshInterval, startAutoRefresh]);

    return {
        ...stats,
        refreshStats,
        startAutoRefresh,
        stopAutoRefresh,
        isAutoRefreshActive: !!intervalRef.current
    };
};

export default useRealtimeStats;