// src/pages/About.jsx
import React from 'react';

const About = () => {
    // Technologies - 2 lignes au-dessus du logo
    const technologies = [
        // Ligne du haut (plus espacée horizontalement)
        { name: "HTML5", icon: "https://skillicons.dev/icons?i=html", x: -300, y: -250 },
        { name: "CSS3", icon: "https://skillicons.dev/icons?i=css", x: -180, y: -250 },
        { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs", x: -60, y: -250 },
        { name: "Redis", icon: "https://skillicons.dev/icons?i=redis", x: 60, y: -250 },
        { name: "JavaScript", icon: "https://skillicons.dev/icons?i=js", x: 180, y: -250 },
        { name: "ElasticSearch", icon: "https://skillicons.dev/icons?i=elasticsearch", x: 300, y: -250 },

        // Ligne du bas (juste au-dessus du logo)
        { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres", x: -300, y: -160 },
        { name: "MySQL", icon: "https://skillicons.dev/icons?i=mysql", x: -180, y: -160 },
        { name: "Swift", icon: "https://skillicons.dev/icons?i=swift", x: -60, y: -160 },
        { name: "Kotlin", icon: "https://skillicons.dev/icons?i=kotlin", x: 60, y: -160 },
        { name: "Express", icon: "https://skillicons.dev/icons?i=express", x: 180, y: -160 },
        { name: "Golang", icon: "https://skillicons.dev/icons?i=golang", x: 300, y: -160 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a0b2e] to-[#0a0a1a] text-white overflow-hidden relative">
            {/* Effet de lumière d'arrière-plan global */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Texte de description centré en haut */}
                <div className="text-center mb-20">
                    <p className="text-base md:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A full-stack development student driven by{' '}
                        <span className="text-purple-400 font-medium">curiosity</span> and{' '}
                        <span className="text-purple-400 font-medium">creativity</span>.<br />
                        I love turning ideas into functional, accessible, and elegant web experiences — and I'm eager to grow within<br />
                        a collaborative team.
                    </p>
                </div>

                {/* Conteneur principal avec perspective 3D */}
                <div className="relative w-full h-[800px] mx-auto" style={{ perspective: '1000px' }}>
                    {/* Logo central avec effet glow 3D */}
                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                            {/* Multi-couches de glow pour effet 3D */}
                            <div className="absolute -inset-24 bg-purple-500/20 rounded-full blur-[80px] animate-pulse-slow"></div>
                            <div className="absolute -inset-16 bg-purple-500/30 rounded-full blur-[60px]"></div>
                            <div className="absolute -inset-12 bg-purple-600/40 rounded-full blur-[40px]"></div>
                            <div className="absolute -inset-8 bg-purple-500/50 rounded-full blur-[20px]"></div>

                            {/* Sphère du logo avec dégradé radial */}
                            <div className="relative w-48 h-48 rounded-full flex items-center justify-center
                             bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700
                             shadow-[0_0_80px_rgba(168,85,247,0.9),0_0_120px_rgba(168,85,247,0.6),inset_0_0_40px_rgba(168,85,247,0.5)]
                             border-2 border-purple-400/30">
                                <div className="text-5xl font-bold text-white tracking-wider">
                                    &lt;S·M&gt;
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Icônes technologies avec lignes convergentes */}
                    {technologies.map((tech, index) => {
                        const centerX = 0;
                        const centerY = 0;

                        return (
                            <React.Fragment key={`tech-${index}`}>
                                {/* Ligne de connexion avec dégradé */}
                                <svg
                                    className="absolute top-[45%] left-1/2 pointer-events-none z-10"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <defs>
                                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                                            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.4)" />
                                            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                                        </linearGradient>
                                    </defs>
                                    <line
                                        x1={centerX}
                                        y1={centerY}
                                        x2={tech.x}
                                        y2={tech.y}
                                        stroke={`url(#gradient-${index})`}
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                {/* Icône */}
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                                    style={{
                                        left: `calc(50% + ${tech.x}px)`,
                                        top: `calc(45% + ${tech.y}px)`
                                    }}
                                >
                                    <div className="relative w-14 h-14">
                                        {/* Halo externe */}
                                        <div className="absolute -inset-2 rounded-full bg-purple-500/0
                                  group-hover:bg-purple-500/30 blur-md transition-all duration-300"></div>

                                        {/* Cercle de l'icône */}
                                        <div className="w-full h-full bg-[#1a1a2e] rounded-full flex items-center justify-center
                                  shadow-[0_0_15px_rgba(0,0,0,0.8)]
                                  group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]
                                  border border-gray-700/50 group-hover:border-purple-500/70
                                  transition-all duration-300
                                  group-hover:scale-110">
                                            <img
                                                src={tech.icon}
                                                alt={tech.name}
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md
                                text-xs text-gray-200 whitespace-nowrap border border-purple-500/30 shadow-lg">
                                        {tech.name}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}

                    {/* Orbites elliptiques en bas avec perspective */}
                    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
                         style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(75deg)' }}>
                        {/* Orbite 1 (la plus grande) */}
                        <div className="absolute border border-purple-500/20 rounded-full"
                             style={{ width: '700px', height: '700px', left: '-350px', top: '-350px' }}></div>
                        {/* Orbite 2 */}
                        <div className="absolute border border-purple-500/25 rounded-full"
                             style={{ width: '550px', height: '550px', left: '-275px', top: '-275px' }}></div>
                        {/* Orbite 3 */}
                        <div className="absolute border border-purple-500/30 rounded-full"
                             style={{ width: '400px', height: '400px', left: '-200px', top: '-200px' }}></div>
                        {/* Orbite 4 (la plus proche) */}
                        <div className="absolute border border-purple-500/35 rounded-full"
                             style={{ width: '250px', height: '250px', left: '-125px', top: '-125px' }}></div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default About;
