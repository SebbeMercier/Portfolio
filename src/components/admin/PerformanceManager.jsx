// Composant pour gérer les performances et le cache IA
import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, Database, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import usePortfolioData from '../../hooks/usePortfolioData';

const PerformanceManager = () => {
  const {
    performanceMetrics,
    refreshSQLCache,
    analyzePerformance,
    isOptimized,
    cacheHit,
    loadTime,
    dataSource
  } = usePortfolioData();

  const [analysisData, setAnalysisData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Analyser les performances au montage
  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await analyzePerformance();
        if (result.success) {
          setAnalysisData(result.data);
        }
      } catch (error) {
        console.error('Erreur analyse performance:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, []); // Pas de dépendance pour éviter les boucles

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshSQLCache();
      if (result.success) {
        setLastRefresh(new Date());
        // Re-analyser après rafraîchissement
        setTimeout(() => handleAnalyzePerformance(), 1000);
      }
    } catch (error) {
      console.error('Erreur rafraîchissement cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAnalyzePerformance = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePerformance();
      if (result.success) {
        setAnalysisData(result.data);
      }
    } catch (error) {
      console.error('Erreur analyse performance:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPerformanceStatus = () => {
    if (!loadTime) return { status: 'unknown', color: 'gray', message: 'En attente...' };

    if (loadTime < 50) return { status: 'excellent', color: 'green', message: 'Excellent' };
    if (loadTime < 200) return { status: 'good', color: 'blue', message: 'Bon' };
    if (loadTime < 500) return { status: 'average', color: 'yellow', message: 'Moyen' };
    return { status: 'slow', color: 'red', message: 'Lent' };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            <Zap className="w-5 h-5 inline mr-2" />
            Gestionnaire de Performance IA
          </h3>
          <p className="text-gray-400 text-sm">
            Optimisation et monitoring des performances de l'assistant IA
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAnalyzePerformance}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <TrendingUp className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            {isAnalyzing ? 'Analyse...' : 'Analyser'}
          </button>
          <button
            onClick={handleRefreshCache}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir Cache'}
          </button>
        </div>
      </div>

      {/* Métriques de performance en temps réel */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Temps de chargement</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {loadTime ? `${loadTime}ms` : '--'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full bg-${performanceStatus.color}-900/30 text-${performanceStatus.color}-300`}>
              {performanceStatus.message}
            </span>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Source de données</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {dataSource === 'materialized_view' ? 'Cache SQL' :
                dataSource === 'fallback_queries' ? 'Requêtes' :
                  dataSource === 'static_fallback' ? 'Statique' : 'Inconnu'}
            </span>
            {isOptimized ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Cache Hit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {cacheHit ? '✅' : '❌'}
            </span>
            <span className="text-xs text-gray-400">
              {cacheHit ? 'Optimisé' : 'Non optimisé'}
            </span>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-300">Dernier refresh</span>
          </div>
          <div>
            <span className="text-sm text-white">
              {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Jamais'}
            </span>
          </div>
        </div>
      </div>

      {/* Métriques détaillées */}
      {performanceMetrics && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Métriques détaillées</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-400">Projets chargés</span>
              <p className="text-xl font-bold text-white">{performanceMetrics.itemsLoaded.projects}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Compétences chargées</span>
              <p className="text-xl font-bold text-white">{performanceMetrics.itemsLoaded.skills}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Expériences chargées</span>
              <p className="text-xl font-bold text-white">{performanceMetrics.itemsLoaded.experiences}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analyse des performances de la base de données */}
      {analysisData && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Analyse de la base de données</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 text-gray-300">Table</th>
                  <th className="text-left py-2 text-gray-300">Lignes</th>
                  <th className="text-left py-2 text-gray-300">Taille</th>
                  <th className="text-left py-2 text-gray-300">Index</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(analysisData) && analysisData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-2 text-white font-medium">{row.table_name}</td>
                    <td className="py-2 text-gray-300">{row.row_count}</td>
                    <td className="py-2 text-gray-300">{row.table_size}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${row.index_usage?.includes('Utilisé')
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                        }`}>
                        {row.index_usage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommandations */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Recommandations d'optimisation
        </h4>
        <div className="space-y-3">
          {!isOptimized && (
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-200 font-medium">Cache SQL non utilisé</p>
                <p className="text-yellow-300/80 text-sm">
                  Rafraîchissez le cache pour activer les optimisations SQL et améliorer les performances.
                </p>
              </div>
            </div>
          )}

          {loadTime && loadTime > 200 && (
            <div className="flex items-start gap-3 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
              <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-orange-200 font-medium">Performances dégradées</p>
                <p className="text-orange-300/80 text-sm">
                  Temps de chargement élevé. Vérifiez la connexion à la base de données et rafraîchissez le cache.
                </p>
              </div>
            </div>
          )}

          {isOptimized && loadTime && loadTime < 50 && (
            <div className="flex items-start gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-200 font-medium">Performances optimales</p>
                <p className="text-green-300/80 text-sm">
                  Votre assistant IA fonctionne avec des performances optimales grâce au cache SQL.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceManager;