// StatsSection_Fallback.jsx - Version de secours avec valeurs statiques mais qui marche
import { Code2, Rocket, Users, Award } from 'lucide-react';

export function StatsSection() {
    // Stats statiques qui fonctionnent à coup sûr
    const stats = [
        { 
            icon: Code2, 
            value: 15, 
            suffix: '+', 
            label: 'Projects Completed', 
            color: 'from-purple-400 to-pink-500',
            description: 'Live & completed projects'
        },
        { 
            icon: Rocket, 
            value: 4, 
            suffix: '+', 
            label: 'Years Experience', 
            color: 'from-blue-400 to-cyan-500',
            description: 'Building digital solutions'
        },
        { 
            icon: Users, 
            value: 12, 
            suffix: '+', 
            label: 'Happy Clients', 
            color: 'from-green-400 to-emerald-500',
            description: '4.8/5 average rating'
        },
        { 
            icon: Award, 
            value: 20, 
            suffix: '+', 
            label: 'Technologies', 
            color: 'from-orange-400 to-red-500',
            description: 'Frameworks & tools mastered'
        }
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        By the <span className="text-purple-400">Numbers</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Statistics from my portfolio and client work.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden"
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
            </div>
        </section>
    );
}