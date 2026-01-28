// Hook React pour gérer les données du portfolio (OPTIMISÉ)
import { useState, useEffect, useCallback } from 'react';
import portfolioDataService from '../services/portfolioDataService';

export const usePortfolioData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Charger les données avec métriques de performance
  const loadData = useCallback(async (forceRefresh = false) => {
    const startTime = performance.now();
    
    try {
      setLoading(true);
      setError(null);

      if (forceRefresh) {
        portfolioDataService.clearCache();
      }

      const portfolioData = await portfolioDataService.getPortfolioData();
      const endTime = performance.now();
      
      setData(portfolioData);
      setLastUpdated(new Date());
      
      // Métriques de performance
      setPerformanceMetrics({
        loadTime: Math.round(endTime - startTime),
        dataSource: portfolioData.metadata?.dataSource || 'unknown',
        cacheHit: portfolioData.metadata?.cacheHit || false,
        itemsLoaded: {
          projects: portfolioData.projects?.length || 0,
          skills: portfolioData.skills?.length || 0,
          experiences: portfolioData.experiences?.length || 0
        }
      });
      
      console.log('✅ Données portfolio chargées dans le hook:', {
        loadTime: `${Math.round(endTime - startTime)}ms`,
        source: portfolioData.metadata?.dataSource,
        cacheHit: portfolioData.metadata?.cacheHit
      });
    } catch (err) {
      console.error('❌ Erreur chargement portfolio:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger au montage du composant
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Rafraîchir les données
  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Rafraîchir le cache SQL (pour l'admin)
  const refreshSQLCache = useCallback(async () => {
    try {
      setLoading(true);
      const result = await portfolioDataService.refreshCache();
      
      if (result.success) {
        // Recharger les données après rafraîchissement du cache
        await loadData(true);
        return { success: true, message: 'Cache SQL rafraîchi avec succès' };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('❌ Erreur rafraîchissement cache SQL:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  // Récupérer des projets par technologie
  const getProjectsByTech = useCallback(async (tech) => {
    try {
      return await portfolioDataService.getProjectsByTechnology(tech);
    } catch (err) {
      console.error(`❌ Erreur projets ${tech}:`, err);
      return [];
    }
  }, []);

  // Récupérer les compétences par catégorie
  const getSkillsByCategory = useCallback(async (category = null) => {
    try {
      return await portfolioDataService.getSkillsByCategory(category);
    } catch (err) {
      console.error('❌ Erreur compétences par catégorie:', err);
      return [];
    }
  }, []);

  // Analyser les performances (pour l'admin)
  const analyzePerformance = useCallback(async () => {
    try {
      return await portfolioDataService.analyzePerformance();
    } catch (err) {
      console.error('❌ Erreur analyse performance:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Recherche intelligente dans les données
  const searchData = useCallback((query) => {
    if (!data || !query) return null;
    
    const lowerQuery = query.toLowerCase();
    const results = {
      projects: [],
      skills: [],
      experiences: []
    };

    // Recherche dans les projets
    results.projects = data.projects.filter(project => 
      project.title?.toLowerCase().includes(lowerQuery) ||
      project.description?.toLowerCase().includes(lowerQuery) ||
      (project.technologies || project.tags || []).some(tech => 
        tech.toLowerCase().includes(lowerQuery)
      )
    );

    // Recherche dans les compétences
    results.skills = data.skills.filter(skill =>
      skill.name?.toLowerCase().includes(lowerQuery) ||
      skill.category?.toLowerCase().includes(lowerQuery)
    );

    // Recherche dans les expériences
    results.experiences = data.experiences.filter(exp =>
      exp.title?.toLowerCase().includes(lowerQuery) ||
      exp.company?.toLowerCase().includes(lowerQuery) ||
      exp.description?.toLowerCase().includes(lowerQuery)
    );

    return results;
  }, [data]);

  // Obtenir les technologies les plus utilisées
  const getTopTechnologies = useCallback((limit = 10) => {
    if (!data?.projects) return [];

    const techCount = {};
    
    data.projects.forEach(project => {
      const technologies = project.technologies || project.tags || [];
      technologies.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    return Object.entries(techCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tech, count]) => ({ name: tech, count }));
  }, [data]);

  return {
    // Données
    data,
    loading,
    error,
    lastUpdated,
    performanceMetrics,
    
    // Actions
    refresh,
    refreshSQLCache,
    getProjectsByTech,
    getSkillsByCategory,
    analyzePerformance,
    
    // Utilitaires
    searchData,
    getTopTechnologies,
    isDataAvailable: !!data,
    dataSource: data?.metadata?.dataSource || 'unknown',
    totalProjects: data?.metadata?.totalProjects || 0,
    totalSkills: data?.metadata?.totalSkills || 0,
    totalExperiences: data?.metadata?.totalExperiences || 0,
    
    // Métriques de performance
    isOptimized: data?.metadata?.dataSource === 'materialized_view',
    cacheHit: data?.metadata?.cacheHit || false,
    loadTime: performanceMetrics?.loadTime || null
  };
};

export default usePortfolioData;