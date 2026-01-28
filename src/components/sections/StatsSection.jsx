// StatsSection.jsx - Section de statistiques animées avec données dynamiques temps réel
import { useEffect, useRef, useState, useMemo } from 'react';
import { Code2, Rocket, Users, Award, RefreshCw, Zap } from 'lucide-react';
import { animate } from 'animejs';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';
import { useTranslation } from '../../hooks/useTranslation';

export function StatsSection() {
    const sectionRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const { 
        projects, 
        clients, 
        technologies, 
        experience, 
        averageRating, 
        loading, 
        error, 
        refreshStats,
        lastUpdated,
        isAutoRefreshActive
    } = useRealtimeStats(30000); // Auto-refresh toutes les 30 secondes
    const { t } = useTranslation();

    // Configuration des stats avec données dynamiques
    const stats = useMemo(() => [
        { 
            icon: Code2, 
            value: projects, 
            suffix: '+', 
            label: t('stats.projectsCompleted', 'Projects Completed'), 
            color: 'from-purple-400 to-pink-500',
            description: t('stats.projectsDesc', 'Live & completed projects')
        },
        { 
            icon: Rocket, 
            value: experience, 
            suffix: '+', 
            label: t('stats.yearsExperience', 'Years Experience'), 
            color: 'from-blue-400 to-cyan-500',
            description: t('stats.experienceDesc', 'Building digital solutions')
        },
        { 
            icon: Users, 
            value: clients, 
            suffix: '+', 
            label: t('stats.happyClients', 'Happy Clients'), 
            color: 'from-green-400 to-emerald-500',
            description: averageRating > 0 ? `${averageRating}/5 ${t('stats.averageRating', 'average rating')}` : t('stats.clientsDesc', 'Satisfied customers')
        },
        { 
            icon: Award, 
            value: technologies, 
            suffix: '+', 
            label: t('stats.technologies', 'Technologies'), 
            color: 'from-orange-400 to-red-500',
            description: t('stats.technologiesDesc', 'Frameworks & tools mastered')
        }
    ], [projects, experience, clients, technologies, averageRating, t]);

    useEffect(() => {
        const sectionElement = sectionRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated && !loading) {
                        // Animer les cartes
                        animate(entry.target.querySelectorAll('.stat-card'), {
                            opacity: [0, 1],
                            translateY: [50, 0],
                            scale: [0.8, 1],
                            delay: (el, i) => i * 150,
                            duration: 800,
                            easing: 'out-expo'
                        });

                        // Animer les nombres
                        const numbers = entry.target.querySelectorAll('.stat-number');
                        numbers.forEach((num, index) => {
                            const target = stats[index]?.value || 0;
                            if (target > 0) {
                                let current = 0;
                                const increment = Math.max(target / 60, 0.1); // Animation plus fluide
                                const timer = setInterval(() => {
                                    current += increment;
                                    if (current >= target) {
                                        // Afficher la valeur finale (peut être décimale pour averageRating)
                                        num.textContent = target % 1 !== 0 ? target.toFixed(1) : target;
                                        clearInterval(timer);
                                    } else {
                                        num.textContent = Math.floor(current);
                                    }
                                }, 25);
                            } else {
                                num.textContent = target;
                            }
                        });

                        setHasAnimated(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionElement && !loading) {
            observer.observe(sectionElement);
        }

        return () => {
            if (sectionElement) {
                observer.unobserve(sectionElement);
            }
        };
    }, [hasAnimated, loading, stats]);

    return (
        <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header avec bouton refresh et indicateur temps réel */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            {t('stats.title', 'By the')} <span className="text-purple-400">{t('stats.numbers', 'Numbers')}</span>
                        </h2>
                        
                        <div className="flex items-center gap-2">
                            {/* Indicateur temps réel */}
                            {isAutoRefreshActive && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <Zap className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-green-400 font-medium">Real-time</span>
                                </div>
                            )}
                            
                            {/* Bouton refresh */}
                            {!loading && (
                                <button
                                    onClick={refreshStats}
                                    className="p-2 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-lg transition-colors"
                                    title={t('stats.refreshStats', 'Refresh statistics')}
                                >
                                    <RefreshCw className="w-4 h-4 text-gray-400 hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <p className="text-gray-400 max-w-2xl mx-auto mb-2">
                        {t('stats.description', 'Real-time statistics from my portfolio, updated automatically based on projects and client feedback.')}
                    </p>
                    
                    {/* Timestamp de dernière mise à jour */}
                    {lastUpdated && (
                        <p className="text-xs text-gray-500">
                            {t('stats.lastUpdated', 'Last updated')}: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">{t('stats.loading', 'Loading statistics...')}</p>
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
                            {t('interface.tryAgain', 'Try Again')}
                        </button>
                    </div>
                )}

                {/* Stats grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-card opacity-0 group relative overflow-hidden"
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
                                        <span className="text-xs text-green-400 font-medium">{t('stats.live', 'Live')}</span>
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
                                    <span className="stat-number text-3xl lg:text-4xl font-bold text-white">
                                        {stat.value || 0}
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
