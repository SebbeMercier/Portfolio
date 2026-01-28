// StatsSection_Simple.jsx - Version simplifiée sans animejs pour tester
import { useEffect, useRef, useState } from 'react';
import { Code2, Rocket, Users, Award, RefreshCw } from 'lucide-react';
import { useStats } from '../hooks/useStats';

export function StatsSection() {
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { projects, clients, technologies, experience, averageRating, loading, error, refreshStats } = useStats();

    // Configuration des stats avec données dynamiques
    const stats = [
        { 
            icon: Code2, 
            value: projects, 
            suffix: '+', 
            label: 'Projects Completed', 
            color: 'from-purple-400 to-pink-500',
            description: 'Live & completed projects'
        },
        { 
            icon: Rocket, 
            value: experience, 
            suffix: '+', 
            label: 'Years Experience', 
            color: 'from-blue-400 to-cyan-500',
            description: 'Building digital solutions'
        },
        { 
            icon: Users, 
            value: clients, 
            suffix: '+', 
            label: 'Happy Clients', 
            color: 'from-green-400 to-emerald-500',
            description: `${averageRating}/5 average rating`
        },
        { 
            icon: Award, 
            value: technologies, 
            suffix: '+', 
            label: 'Technologies', 
            color: 'from-orange-400 to-red-500',
            description: 'Frameworks & tools mastered'
        }
    ];

    // Animation simple avec CSS
    useEffect(() => {
        if (!loading && !hasAnimated) {
            const timer = setTimeout(() => {
                setHasAnimated(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [loading, hasAnimated]);

    return (
        <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header avec bouton refresh */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            By the <span className="text-purple-400">Numbers</span>
                        </h2>
                        {!loading && (
                            <button
                                onClick={refreshStats}
                                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-lg transition-colors"
                                title="Refresh statistics"
                            >
                                <RefreshCw className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                        )}
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Real-time statistics from my portfolio, updated automatically based on projects and client feedback.
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading statistics...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={refreshStats}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Stats grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`group relative overflow-hidden transition-all duration-500 ${
                                    hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 
                                              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 
                                              transition-opacity duration-500"></div>

                                <div className="relative bg-gray-900/60 backdrop-blur-xl 
                                              border border-white/10 rounded-2xl p-6
                                              hover:border-purple-500/30 transition-all duration-300
                                              hover:scale-105">
                                    
                                    {/* Live indicator */}
                                    <div className="absolute top-3 right-3">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-400 font-medium">Live</span>
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} 
                                                  flex items-center justify-center mb-4
                                                  group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Number */}
                                    <div className="flex items-baseline space-x-1 mb-2">
                                        <span className="text-3xl lg:text-4xl font-bold text-white">
                                            {stat.value}
                                        </span>
                                        <span className="text-2xl lg:text-3xl font-bold text-purple-400">
                                            {stat.suffix}
                                        </span>
                                    </div>

                                    {/* Label */}
                                    <p className="text-sm font-medium text-gray-300 mb-1">{stat.label}</p>
                                    
                                    {/* Description */}
                                    <p className="text-xs text-gray-500">{stat.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}