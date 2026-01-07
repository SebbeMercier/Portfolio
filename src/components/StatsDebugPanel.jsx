// StatsDebugPanel.jsx - Panel de debug pour tester les stats en temps réel
import { useState } from 'react';
import { RefreshCw, Zap, Database, Clock, Eye, EyeOff } from 'lucide-react';
import { useRealtimeStats } from '../hooks/useRealtimeStats';
import { usePortfolioData } from '../hooks/usePortfolioData';

export function StatsDebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30000);
    
    const realtimeStats = useRealtimeStats(refreshInterval);
    const portfolioData = usePortfolioData();

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsVisible(true)}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
                    title="Ouvrir le panel de debug des stats"
                >
                    <Database className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-96 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-semibold">Stats Debug Panel</h3>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                    <EyeOff className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Contrôles */}
            <div className="space-y-4">
                {/* Intervalle de refresh */}
                <div>
                    <label className="block text-sm text-gray-300 mb-2">
                        Intervalle de refresh (ms)
                    </label>
                    <select
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                        <option value={5000}>5 secondes</option>
                        <option value={10000}>10 secondes</option>
                        <option value={30000}>30 secondes</option>
                        <option value={60000}>1 minute</option>
                    </select>
                </div>

                {/* Status temps réel */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Status temps réel</span>
                        <div className="flex items-center gap-1">
                            {realtimeStats.isAutoRefreshActive ? (
                                <>
                                    <Zap className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-green-400">Actif</span>
                                </>
                            ) : (
                                <span className="text-xs text-red-400">Inactif</span>
                            )}
                        </div>
                    </div>
                    
                    {realtimeStats.lastUpdated && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Dernière MAJ: {realtimeStats.lastUpdated.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>

                {/* Stats actuelles */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-gray-300 mb-2">Stats actuelles</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-gray-400">Projets:</span>
                            <span className="text-white ml-1">{realtimeStats.projects}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Clients:</span>
                            <span className="text-white ml-1">{realtimeStats.clients}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Technologies:</span>
                            <span className="text-white ml-1">{realtimeStats.technologies}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Note:</span>
                            <span className="text-white ml-1">{realtimeStats.averageRating}</span>
                        </div>
                    </div>
                </div>

                {/* Métriques portfolio */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                    <h4 className="text-sm text-gray-300 mb-2">Portfolio Data</h4>
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Source:</span>
                            <span className="text-white">{portfolioData.dataSource}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Cache Hit:</span>
                            <span className={portfolioData.cacheHit ? 'text-green-400' : 'text-red-400'}>
                                {portfolioData.cacheHit ? 'Oui' : 'Non'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Load Time:</span>
                            <span className="text-white">{portfolioData.loadTime}ms</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={realtimeStats.refreshStats}
                        disabled={realtimeStats.loading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${realtimeStats.loading ? 'animate-spin' : ''}`} />
                        Refresh Stats
                    </button>
                    
                    <button
                        onClick={portfolioData.refresh}
                        disabled={portfolioData.loading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
                    >
                        <Database className={`w-4 h-4 ${portfolioData.loading ? 'animate-spin' : ''}`} />
                        Refresh Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
}