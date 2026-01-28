// StatsWidget.jsx - Widget compact pour afficher les stats en temps réel
import { TrendingUp, Users, Code2, Star, RefreshCw, Zap } from 'lucide-react';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';

export function StatsWidget({ compact = false }) {
    const { 
        projects, 
        clients, 
        technologies, 
        averageRating, 
        loading, 
        refreshStats,
        lastUpdated,
        isAutoRefreshActive
    } = useRealtimeStats(60000); // Auto-refresh toutes les 60 secondes pour le widget

    const stats = [
        {
            icon: Code2,
            value: projects,
            label: 'Projects',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        },
        {
            icon: Users,
            value: clients,
            label: 'Clients',
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            icon: TrendingUp,
            value: technologies,
            label: 'Tech Stack',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10'
        },
        {
            icon: Star,
            value: averageRating,
            label: 'Rating',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            suffix: '/5'
        }
    ];

    if (compact) {
        return (
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                    {isAutoRefreshActive && (
                        <Zap className="w-3 h-3 text-green-400" />
                    )}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Live Stats</span>
                </div>
                
                <div className="flex items-center gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-white font-semibold">
                                {loading ? '...' : (stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value)}{stat.suffix || ''}
                            </span>
                            <span className="text-gray-400 text-sm">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {lastUpdated && (
                        <span className="text-xs text-gray-500">
                            {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={refreshStats}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="flex items-center gap-1">
                            {isAutoRefreshActive && (
                                <Zap className="w-2 h-2 text-green-400" />
                            )}
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400">Live</span>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">
                                {loading ? '...' : (stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value)}
                            </span>
                            {stat.suffix && (
                                <span className="text-lg text-gray-400">{stat.suffix}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        {lastUpdated && (
                            <p className="text-xs text-gray-500">
                                {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}